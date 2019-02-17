import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, Subscription} from 'rxjs';
import {HospitalNotification} from '../models/hospital/notification.model';
import {Hospital} from '../models/hospital/hospital.model';
import {HospitalPanelService} from './hospital-panel.service';
import WhereFilterOp = firebase.firestore.WhereFilterOp;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService implements OnDestroy{

  // Logged in hospital
  public hospital: Hospital;
  public notificationsList: HospitalNotification[];

  private sub: Subscription;

  constructor(
    private afs: AngularFirestore,
    private hospitalService: HospitalPanelService,
  ) {
    this.sub = this.hospitalService.hospital$.subscribe(
      res => this.hospital = res
    );
  }


  // Listen to notifications changes
  public notificationListen(): Observable<HospitalNotification[]> {
    return this.afs.doc(`alerts/${this.hospital.uid}`)
      .collection('alerts_list', ref => ref.orderBy('date_created', 'desc'))
      .valueChanges() as Observable<HospitalNotification[]>;
  }

  // Get notifications
  public async notificationGetAll(): Promise<HospitalNotification[]> {
    try {
      const ref = await this.afs.doc(`alerts/${this.hospital.uid}`).collection('alerts_list').get().toPromise();
      const docs = ref.docs.map(el => el.data());
      return docs as HospitalNotification[];
    } catch (err) {
      console.log(err);
    }
  }

  // Get notifications
  public async notificationGetChunk(limit: number, startAt?: string): Promise<HospitalNotification[]> {
    try {
      const ref = await this.afs.doc(`alerts/${this.hospital.uid}`).collection('alerts_list');

      const data = !startAt ? await ref.ref.orderBy('date_created', 'desc').limit(2).get()
        : await ref.ref.orderBy('title').startAfter(`${startAt}`).limit(2).get();

      const docs = data.docs.map(el => el.data());
      return docs as HospitalNotification[];
    } catch (err) {
      console.log(err);
    }
  }


  // Get notifications with query
  public async notificationQuery(field: string, operation: WhereFilterOp, value: string): Promise<HospitalNotification[]> {
    const ref =  this.afs.doc(`alerts/${this.hospital.uid}`).collection('alerts_list');
    try {
      const query = await ref.ref.where(field, operation, value).get();
      const data = query.docs.map(el => el.data());
      return data as HospitalNotification[];
    } catch (err) {
      console.log(err);
    }
  }

  // Add notification
  public async notificationAdd(notification: HospitalNotification): Promise<boolean> {

    try {
      const ref = await this.afs.doc(`alerts/${this.hospital.uid}`)
        .collection('alerts_list')
        .doc(`${notification.date_created}`)
        .set(notification);
      return true;
    } catch (err) {
      return false;
    }

  }

  public async notificationUpdate(notification: HospitalNotification): Promise<boolean> {
    try {
      const ref = await this.afs.doc(`alerts/${this.hospital.uid}`)
        .collection('alerts_list')
        .doc(`${notification.date_created}`)
        .update(notification);
      return true;
    } catch (err) {
      return false;
    }
  }

  // Delete Notification
  public async notificationDelete(date: number): Promise<boolean> {
    try {
      await this.afs.doc(`alerts/${this.hospital.uid}`)
        .collection('alerts_list')
        .doc(`${date}`)
        .delete();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
