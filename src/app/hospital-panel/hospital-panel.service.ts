import {Injectable, OnDestroy} from '@angular/core';
import {AuthService} from '../core/auth.service';
import {Hospital} from '../models/hospital/hospital.model';
import {BehaviorSubject, combineLatest, forkJoin, merge, Observable} from 'rxjs';
import {AngularFirestore, DocumentData} from '@angular/fire/firestore';
import {HospitalAppointment} from '../models/hospital/hospital-appointment.model';
import {map} from 'rxjs/internal/operators';


@Injectable({
  providedIn: 'root'
})
export class HospitalPanelService implements OnDestroy {

  // Logged in hospital
  public hospital: Hospital;
  // Hospital subject
  private hospitalSubject: BehaviorSubject<Hospital | null> = new BehaviorSubject<Hospital | null>(null);
  // Hospital Observable
  public hospital$: Observable<Hospital | null> = this.hospitalSubject.asObservable();

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
  ) {
    this.authService.hospital$.subscribe( res => {
      this.hospital = res;
      this.hospitalSubject.next(res);
    });
  }

  // Update Hospital Details
  public async hospitalDetailsUpdate(hospital: Hospital): Promise<boolean> {
    if (hospital) {
      try {
        const dbRef = await this.afs.doc(`hospitals/${this.hospital.uid}`);
        dbRef.set(hospital, {merge: true});
        return true;
      } catch (err) {
        return false;
      }
    }
  }

  // Get all Appointments
  public appointmentsGetAll(uid: string): Observable<DocumentData[]> {
    return this.afs
      .doc(`appointments/${uid}`)
      .collection('hospital_appointments')
      .valueChanges();
  }


  // Get Future Appointments with query
  public getFutureApp(): Observable<HospitalAppointment[]> {
    const date = Date.now();
    return  this.afs.doc(`appointments/${this.hospital.uid}`)
      .collection('hospital_appointments', ref => {
        return ref.where('appointment_date', '>', `${date}`)
                  .orderBy('appointment_date');
      })
      .valueChanges() as Observable<HospitalAppointment[]>;
  }

  // Get past confirmed Appointments
  public getPastConfirmedApp(): Observable<HospitalAppointment[]> {
    // Today's date
    const date = Date.now();

    const query_1 = this.afs.doc(`appointments/${this.hospital.uid}`)
      .collection('hospital_appointments', ref => {
        return ref.where('appointment_date', '<', `${date}`)
          .where('status', '==', 'completed')
          .orderBy('appointment_date', 'desc');
      }).valueChanges();

    const query_2 = this.afs.doc(`appointments/${this.hospital.uid}`)
      .collection('hospital_appointments', ref => {
        return ref.where('appointment_date', '<', `${date}`)
          .where('status', '==', 'uncompleted')
          .orderBy('appointment_date', 'desc');
      }).valueChanges();

      // Combine observables
      return combineLatest<HospitalAppointment[]>(query_1, query_2)
        .pipe(
          map(([q1, q2]) => [...q1, ...q2])
        );
  }

  // Get past unconfirmed Appointments
  public getPastUnconfirmedApp(): Observable<HospitalAppointment[]> {
    const date = Date.now();
    return this.afs.doc(`appointments/${this.hospital.uid}`)
      .collection('hospital_appointments', ref => {
        return ref.where('appointment_date', '<', `${date}`)
          .where('status', '==', 'pending')
          .orderBy('appointment_date', 'desc');
      })
      .valueChanges() as Observable<HospitalAppointment[]>;
  }


  public async confirmAppointment(appointment: HospitalAppointment, status: string): Promise<boolean> {
    if (appointment) {
      try {
        const ref = await this.afs.doc(`appointments/${this.hospital.uid}`)
          .collection('hospital_appointments')
          .doc(`${appointment.appointment_date}`);
         const ifExists = await ref.get().toPromise();
         if (ifExists.exists) {
           ref.set({status: status}, { merge: true});
           return true;
         }
        return false;
      } catch (err) {
        return false;
      }
    }
  }

  ngOnDestroy() {
    this.hospitalSubject.complete();
  }
}
