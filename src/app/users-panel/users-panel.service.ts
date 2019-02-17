import {Injectable, OnDestroy} from '@angular/core';
import {AuthService} from '../core/auth.service';
import {User} from '../models/user/user.model';
import {BehaviorSubject, combineLatest, forkJoin, merge, Observable, of, Subscription} from 'rxjs';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Hospital} from '../models/hospital/hospital.model';
import {UserAppointment} from '../models/user/user-appointment.model';
import {HospitalNotification} from '../models/hospital/notification.model';
import {combineAll, map, tap} from 'rxjs/internal/operators';
import {HospitalAppointment} from '../models/hospital/hospital-appointment.model';
import {UserSubscription} from '../models/user/user-subscription.model';

@Injectable()

export class UsersPanelService implements OnDestroy {

  public userLoaded: boolean;
  // Logged in user
  public currentUser: User;
  private userSubject = new BehaviorSubject<User | null>(null);
  private hospitalsSubject = new BehaviorSubject<Hospital[] | null>(null);

  public hospitals$ = this.hospitalsSubject.asObservable();
  // Logged in user
  public loggedInUser$: Observable<User | null> = this.userSubject.asObservable();

  private sub: Subscription;

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
  ) {
    // Get: logged in user
    this.sub = this.authService.user$.subscribe(user => {
      this.currentUser = user;
      this.userLoaded = true;
      this.getHospitals();
      this.userSubject.next(user);
    });
  }

  // Update: User details
  public async userUpdate(user: User): Promise<boolean> {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${this.currentUser.uid}`);
      try {
         await userRef.set(user, { merge: true });
         return true;
      } catch (err) {
        return false;
      }
  }


  // // User Subscribe to Hospital
  // public async hospitalSubscriptionAdd(subscription, hospitalId: string): Promise<boolean> {
  //   const ref = this.afs.doc(`hospitals/${hospitalId}`).collection('subscribers').doc(`${subscription['uid']}`);
  //   try {
  //     await ref.set(subscription , {merge: true});
  //     return true;
  //   } catch (err) {
  //     console.log(err);
  //     return false;
  //   }
  // }

  // User Subscribe to Hospital
  public async hospitalSubscriptionAdd(subscription: UserSubscription): Promise<boolean> {
    const ref = this.afs.doc(`users/${this.currentUser.uid}`)
      .collection('subscribed_to')
      .doc(`${subscription['uid']}`);
    try {
      await ref.set(subscription , {merge: true});
      return true;
    } catch (err) {
      return false;
    }
  }

  // User Unsubscribe from Hospital
  public async hospitalSubscriptionRemove(hospitalId: string): Promise<boolean> {
    const ref = this.afs.doc(`users/${this.currentUser.uid}`).collection('subscribed_to').doc(`${hospitalId}`);
    try {
      await ref.delete();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // User get Notifications from favorite Hospitals list
  public notificationsGetFavorite(all?: boolean): HospitalNotification[] {
    const notifications: HospitalNotification[] = [];
    if (this.currentUser) {
      this.currentUser.subscribed_to.map(async (id) => {
          const ref = this.afs.doc(`alerts/${id}`).collection('alerts_list');
          const docs = await ref.ref.orderBy('date_created', 'desc').get();
          docs.forEach(data => {
            const notData = data.data() as HospitalNotification;
            if (!all) {
              if (notData.blood_type === this.currentUser.blood_type && notData.rh === this.currentUser.rh) {
                notifications.push(notData);
              }
            } else {
              notifications.push(notData);
            }
          });
        }
      );
      return notifications;
    }

  }

  // User get favorite Hospitals Details
  // TODO add subscriptions to different subcollection
  public hospitalsGetFavorite(): Hospital[] {
    const hospitals: Hospital[] = [];
    if (this.currentUser) {
      this.currentUser.subscribed_to.map(async (id) => {
          const ref = this.afs.doc(`hospitals/${id}`);
          const docs = await ref.get();
          docs.forEach(data => {
            const hospitalData = data.data() as Hospital;
            hospitals.push(hospitalData);
          });
        }
      );
      return hospitals;
    }

  }


  // Add User Appointment
  public async userAddAppointment(
    hospital: Hospital,
    userAppointment: UserAppointment,
  ): Promise<boolean> {

    try {
      await this.afs.doc(`users_appointments/${this.currentUser.uid}`)
        .collection(`list`)
        .doc(`${userAppointment.appointment_date}`)
        .set(userAppointment);

      return true;

    } catch (err) {
      return false;
    }

  }
  // Get Appointments
  public async getUserAppointments() {

    const docs = [];
    await this.afs.doc(`users_appointments/${this.currentUser.uid}`)
      .collection('list')
      .get()
      .toPromise()
      .then(snapshot => {
        snapshot.forEach(doc => {
          docs.push(doc.data()) ;
        });
      });
    return docs;
  }

  // Get All future Appointments with query
  public async getFutureApp(): Promise<UserAppointment[]> {
    const ref =  this.afs.doc(`users_appointments/${this.currentUser.uid}`).collection('list').ref;
    const date = Date.now();
    try {
      const query = await ref.where('appointment_date', '>', date)
        .orderBy('appointment_date')
        .get();
      const data = query.docs.map(el => el.data());
      return data as UserAppointment[];
    } catch (err) {
      console.log(err);
    }
  }

  // Get next Appointments with query
  public async getNextApp(): Promise<UserAppointment[]> {
    const ref =  this.afs.doc(`users_appointments/${this.currentUser.uid}`).collection('list').ref;
    const date = Date.now();
    try {
      const query = await ref.where('appointment_date', '>', date)
        .orderBy('appointment_date', 'desc')
        .limit(1)
        .get();
      const data = query.docs.map(el => {
        return el.data();
      });
      return data as UserAppointment[];
    } catch (err) {
      console.log(err);
    }
  }

  // Get past confirmed Appointments with query
  public async getPastConfirmedApp(): Promise<UserAppointment[]> {
    const ref =  this.afs.doc(`users_appointments/${this.currentUser.uid}`).collection('list').ref;
    const date = Date.now();
    try {
      const query = await ref.where('appointment_date', '<', date)
        .orderBy('appointment_date', 'desc')
        .get();
      const data = query.docs.map(el => {
        return el.data();
      });
      return data as UserAppointment[];
    } catch (err) {
      console.log(err);
    }
  }

  // Delete appointment
  public async userDeleteAppointment(date: number): Promise<boolean> {
    try {
      await this.afs.doc(`users_appointments/${this.currentUser.uid}`).collection('list').doc(`${date}`).delete();
      return true;
    } catch (err) {
      return false;
    }
  }


  // Get Hospital Booked hours by date
  public async getBookedHours(date, hospitalId: string): Promise<string[]> {
    const fieldData = await this.afs
      .doc(`appointments/${hospitalId}`)
      .collection('appointments')
      .doc(`${date}`)
      .get()
      .toPromise();
    const booked_hours =  fieldData.data();
    return booked_hours ? booked_hours.booked_hours : [];
  }

  // Update Hospital booked hours by date
  public async updateBookedHours(date: number, time: string[], hospitalId: string): Promise<boolean> {
    try {
      await this.afs
        .doc(`appointments/${hospitalId}`)
        .collection('appointments')
        .doc(`${date}`)
        .set({ booked_hours: time});
      return true;
    } catch (err) {
      return false;
    }
  }

  // Add new Hospital
  public async addHospital() {

    const dbRef = await this.afs.collection('hospitals');
    const id = dbRef.ref.doc().id;
    const newHospital: Hospital = {
      uid: id,
      city: 'Turda',
      county: 'Cluj',
      address: 'str. ABCD',
      medical_center_name: 'CTA Turda',
      role: 'hospital',
      isActive: true,
      date_created: new Date().getTime(),
      phone: '0754445555',
      email: 'test@turda.com'
    };
    await this.afs.collection('appointments').doc(`${id}`).set(newHospital, {merge: true});
    dbRef.doc(`${id}`).set(newHospital);
  }

  // Get Hospitals list
  public async getHospitals(): Promise<void> {

    const snapshot = await this.afs.firestore.collection('hospitals').get();
    if (snapshot) {
      const hospitals = snapshot.docs.map(doc => doc.data() as Hospital);
      this.hospitalsSubject.next(hospitals);
    }
  }

  public async appointmentExists(date: number, time: string, hospitalId: string): Promise<boolean> {
    const doc = await this.afs
      .doc(`appointments/${hospitalId}`)
      .collection(`hospital_appointments`)
      .doc(`${date}`)
      .get().toPromise();
     return doc.exists;
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
