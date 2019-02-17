import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../core/auth.service';
import {Observable, Subscription } from 'rxjs';
import {User} from '../models/user/user.model';
import {UsersPanelService} from './users-panel.service';
import {Hospital} from '../models/hospital/hospital.model';
import {HospitalNotification} from '../models/hospital/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService implements OnDestroy {

  private _user: User;
  private _sub: Subscription;

  constructor(
    private _userService: UsersPanelService,
    private authService: AuthService,
    private afs: AngularFirestore,
  ) {
    // Get: logged in user
    this._sub = this._userService.loggedInUser$.subscribe(user => {
      if (user) {
        this._user = user;
      }
    });
  }

  // User get Notifications from favorite Hospitals list
  public async notificationsGetFavorite(hospitals: Hospital[]): Promise<any> {
    if (this._user && hospitals) {
      const notifications: HospitalNotification[] = [];
        hospitals.map(async hospital => {
              const data = await this.getNotByHospitalId(hospital.uid) as HospitalNotification[];
              if (data) {
                notifications.push(...data);
              }
            }
          );
        return notifications;
    }
  }

  // Get notifications by hospital ID
  public async getNotByHospitalId(hospitalId: string) {
    const notifications: HospitalNotification[] = [];
    const ref = this.afs.doc(`alerts/${hospitalId}`).collection('alerts_list');
    const docs = await ref.ref
      .where('blood_type', '==', `${this._user.blood_type}`)
      .orderBy('date_created', 'desc')
      .get();
    docs.forEach(data => {
      const notData = data.data() as HospitalNotification;
      notifications.push(notData);
    });
    return notifications;
  }

  // User get ALL Notifications from selected Hospital
  public async selectedHospitalNotGetAll(id: string): Promise<HospitalNotification[]> {
    const notifications: HospitalNotification[] = [];
    if (id) {
      const ref = this.afs.doc(`alerts/${id}`).collection('alerts_list');

      const docs = await ref.ref.orderBy('date_created', 'desc').get();

      docs.forEach(el => {
        const notification = el.data() as HospitalNotification;
        notifications.push(notification);
      });
      return notifications;
    }

  }

  // User get Notifications from selected Hospital
  public async hospitalNotificationsByType(id: string): Promise<HospitalNotification[]> {
    const notifications: HospitalNotification[] = [];
    if (id) {
      const ref = this.afs.doc(`alerts/${id}`).collection('alerts_list');

      const docs = await ref.ref
        .where('blood_type', '==', this._user.blood_type)
        .where('rh', '==', this._user.rh)
        .orderBy('date_created', 'desc').get();

      docs.forEach(el => {
        const notification = el.data() as HospitalNotification;
        notifications.push(notification);
      });
      return notifications;
    }
  }

  // Get User hospital subscriptions as Observable
  public getSubscriptions() {
    if (this._user) {
      return this.afs.doc(`users/${this._user.uid}`).collection('subscribed_to').valueChanges() as Observable<Hospital[]>;
    }
  }

  public getNotificationsById(hospitalId: string): Observable<any> {
   const data = this.afs.doc(`alerts/${hospitalId}`).collection('alerts_list').valueChanges();
   return data;
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
