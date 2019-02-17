import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User as FirebaseUser } from 'firebase';

import { User } from '../models/user/user.model';
import { Hospital } from '../models/hospital/hospital.model';


@Injectable()
export class AuthService {

  user$: Observable<User>;
  hospital$: Observable<Hospital>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );

    this.hospital$ = this.afAuth.authState.pipe(
      switchMap(hospital => {
        if (hospital) {
          return this.afs.doc<Hospital>(`hospitals/${hospital.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );

  }
  // Register new user
  async registerWithEmailAndPass(newUser: User, password: string): Promise<User>  {
    try {
      const credential = await this.afAuth.auth.createUserWithEmailAndPassword(newUser.email, password);
      return await this.updateUserData(credential.user, newUser);
    } catch (err) {
      console.log(err);
    }
  }

  // User sign in with email and pass
  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const credential = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      return await this.updateUserData(credential.user);
    } catch (err) {
      console.log(err);
    }
  }

  // Hospital sign in with email and pass
  async hospitalSignInWithEmail(email: string, password: string): Promise<Hospital> {
    try {
      const credential = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      return await this.updateHospitalData(credential.user);
    } catch (err) {
      console.log(err);
    }
  }

  // Google Auth
  async signInWithGoogle(): Promise<User> {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return await this.updateUserData(credential.user);
  }


  // Update or create user details
  private async updateUserData(user: FirebaseUser, options?: User): Promise<User> {
    // check if user exists
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const userDetails = await userRef.get().toPromise();
    if (!userDetails.data()) {
      const data: User = this.createUser(user, options);

      await userRef.set(data, { merge: true });
      return data;
    }
    return userDetails.data() as User;
  }

  // Update or create Hospital details
  private async updateHospitalData(user: FirebaseUser): Promise<Hospital> {
    // check if user exists
    const userRef: AngularFirestoreDocument<Hospital> = this.afs.doc(`hospitals/${user.uid}`);
    const hospitalDetails = await userRef.get().toPromise();
    if (!hospitalDetails.data()) {
      const data: Hospital = this.createHospital(user);

      await userRef.set(data, { merge: true });
      return data;
    }
    return hospitalDetails.data() as Hospital;
  }

  // User Password Reset
  async resetPassword(email: string): Promise<boolean> {
    if (email) {
      try {
        await this.afAuth.auth.sendPasswordResetEmail(email);
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
  }

  // User Sign out
  async userSignOut(): Promise<boolean> {
    await this.afAuth.auth.signOut();
    return await this.router.navigate(['/login/user-login']);
  }

  // Hospital Sign out
  async hospitalSignOut(): Promise<boolean> {
    await this.afAuth.auth.signOut();
    return await this.router.navigate(['/login/centru']);
  }

  // Create Hospital obj
  private createHospital(user: FirebaseUser): Hospital {
    return {
      uid: user.uid,
      county: null,
      city: null,
      address: null,
      medical_center_name: null,
      appointments_list: [],
      working_schedule: {
        monday: []
      },
      date_created: new Date().getTime(),
      isActive: false,
      role: 'hospital',
      phone: null,
      email: null
    };
  }

  // Create user obj
  private createUser(user: FirebaseUser, options?: User): User {
    return {
      uid: user.uid,
      email: user.email,
      firstName: options ? options.firstName : null ,
      lastName: options ? options.lastName : null,
      phone: null,
      gender: null,
      blood_type: null,
      rh: null,
      email_notification: null,
      sms_notification: null,
      next_appointment: null,
      canDonate: false,
      date_created: new Date().getTime(),
      photoUrl: user.photoURL,
      role: 'user',
      subscribed_to: []
    };
  }

}
