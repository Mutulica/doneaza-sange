import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import {User} from './interfaces/user.model';

admin.initializeApp();


/**
 * On Delete appointment
 * Removes the appointment from hospital and user
 */
export const onAppointmentDelete = functions.firestore
  .document(`users_appointments/{id}/list/{date}`)
  .onDelete(async (snapshot, context) => {
    const data = snapshot.data();
    if(data) {
      const date = context.params.date;
      const hospitalId = data['center_id'] as string;
      try {
        // Remove booked time
        await deleteBookedHours(data.appointment_time, +data.appointment_date, data.center_id);
        // Remove appointment from hospitals appointments documents
        await  admin.firestore().doc(`appointments/${hospitalId}`)
          .collection('hospital_appointments')
          .doc(`${date}`)
          .delete();
      } catch (err) {
        console.log(err);
      }
    }
  });

/**
 * When user subscribes to hospital
 *
 * @type {CloudFunction<DocumentSnapshot>}
 */
export const onUserSubscribe = functions.firestore
  .document(`users/{userId}/subscribed_to/{hospitalId}`)
  .onCreate(async (snapshot, context) => {
    const userId = context.params.userId;
    const hospitalId = context.params.hospitalId;
    try {
      const ref = admin.firestore().doc(`users/${userId}`);
      const user = await ref.get();
      const userExists = user.exists;
      if(userExists) {
        const userData = user.data() as User;
        console.log(userData);
        await admin.firestore().doc(`hospitals/${hospitalId}`).collection('subscribers').doc(`${userId}`)
          .set({
          uid: userData.uid,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          dob: userData.dob,
          blood_type: userData.blood_type,
          rh: userData.rh
        });
      }
    } catch (err) {
      await admin.firestore().doc(`hospitals/${hospitalId}`)
        .collection('subscribers')
        .doc(`${userId}`)
        .delete();
      console.log(err);
    }
  });


/**
 * When user unsubscribe from hospital
 *
 * @type {CloudFunction<DocumentSnapshot>}
 */
export const onUserUnsubscribe = functions.firestore
  .document(`users/{userId}/subscribed_to/{hospitalId}`)
  .onDelete(async (snapshot, context) => {
    const userId = context.params.userId;
    const hospitalId = context.params.hospitalId;
    try {
      await admin.firestore().doc(`hospitals/${hospitalId}`).collection('subscribers').doc(`${userId}`).delete();
    } catch (err) {
      // await admin.firestore().doc(`hospitals/${hospitalId}`)
      //   .collection('subscribers')
      //   .doc(`${userId}`)
      //   .delete();
      console.log(err);
    }

  });


/**
 * On Delete user
 * Will delete all his appointments
 */
export const onUserDelete = functions.firestore
  .document(`users/{userId}`)
  .onDelete(async (snapshot, context) => {
    const userId = context.params.userId;
    const user: boolean = snapshot.exists;
    if(user) {
      try {
        const userDocs = await admin.firestore().doc(`users_appointments/${userId}`).collection('list').get();
        userDocs.forEach( async doc => {
          await doc.ref.delete();
        })
      } catch (err) {
        console.log(err);
      }
    }
  });

/**
 * When Hospital confirms user appointment
 *
 * @type {CloudFunction<Change<DocumentSnapshot>>}
 */
export const onConfirmAppoint = functions.firestore
  .document(`appointments/{hospitalId}/hospital_appointments/{date}`)
  .onUpdate(async (snapshot, context) => {
    const date = context.params.date;
    if (snapshot.after) {
      const data = snapshot.after.data() as HospitalAppointment;
      const docRef = await admin.firestore().doc(`users_appointments/${data['uid']}`)
        .collection('list')
        .doc(`${date}`);
      const doc = await docRef.get();
      const docData = doc.data() as UserAppointment;
      if(docData) {
        console.log(docData);
        docData.status = data.status;
        await docRef.set(docData, { merge: true});
      }
    }
  });

/**
 * User add appointment
 *
 */
export const onUserAddAppointment = functions.firestore
  .document(`users_appointments/{id}/list/{date}`)
  .onCreate( async (snapshot, context) => {
    const userId = context.params.id;
    const date = context.params.date;
    const data = snapshot.data();
    if(data) {
      try {
        // Get user info
        const userRef = await admin.firestore().doc(`users/${userId}`).get();
        const user = userRef.data();
        if(userRef.exists && user) {
          // Create hospital appointment Obj.
          const appoint = {
            appointment_date: date,
            appointment_time: data['appointment_time'],
            blood_type: user['blood_type'],
            date_created: data['date_created'],
            email: user['email'],
            dob: user['dob'],
            firstName: user['firstName'],
            lastName: user['lastName'],
            phone: user['phone'],
            rh: user['rh'],
            uid: userId,
            confirmed: false,
            completed: false,
            status: 'pending'
          };
          // Update booked hours document
          await updateBookedHours(data['appointment_time'], +data['appointment_date'], data['center_id']);
          // Add appointment to hospital appointments collection
          await admin.firestore()
            .doc(`appointments/${data['center_id']}`)
            .collection('hospital_appointments')
            .doc(`${date}`)
            .set(appoint, { merge: true });
        }
      } catch(err) {
        console.log(err)
      }
    }
  });


/**
 * Update booked hours document
 *
 * @param {string} selectedTime
 * @param {number} selectedDate
 * @param {string} hospitalId
 * @returns {Promise<void>}
 */
async function updateBookedHours(selectedTime: string, selectedDate: number, hospitalId: string) {
  // Get appointment day in miliseconds (time will be: 00:00)
  const dayInMiliseconds = getBookingDay(selectedDate);
  try {
    const docRef = admin.firestore().doc(`/appointments/${hospitalId}`).collection('appointments').doc(`${dayInMiliseconds}`);
    const doc = await docRef.get();
    const data = doc.data();
    let hoursArray  = [];

    if (data) {
      hoursArray = data['booked_hours'];
    }
    // Check if does not exist
    if (hoursArray.indexOf(selectedTime) < 0) {
      hoursArray.push(selectedTime);
    }
    await docRef.set({ booked_hours: hoursArray }, {merge: true})
  } catch (err) {
    console.log(err);
  }

}

/**
 * Remove Time (ex: '12:00') from booked hours document
 *
 * @param {string} selectedTime
 * @param {number} selectedDate
 * @param {string} hospitalId
 * @returns {Promise<void>}
 */
async function deleteBookedHours(selectedTime: string, selectedDate: number, hospitalId: string): Promise<void> {
  // Get appointment day in miliseconds (time will be: 00:00)
  const dayInMiliseconds = getBookingDay(selectedDate);
  try {
    const docRef = admin.firestore().doc(`/appointments/${hospitalId}`).collection('appointments').doc(`${dayInMiliseconds}`);
    const doc = await docRef.get();
    const data = doc.data();
    let hoursArray  = [];

    if (data) {
      hoursArray = data['booked_hours'];
    }
    const index = hoursArray.indexOf(selectedTime);
    if (index > -1) {
      hoursArray.splice(index, 1);
    }
    // check if array is empty
    if(hoursArray.length > 0) {
      // update the document
      await docRef.set({ booked_hours: hoursArray }, {merge: true})
    } else {
      // remove document
      await docRef.delete();
    }
  } catch (err) {
    console.log(err);
  }

}

/**
 * Return Booking day in miliseconds
 *
 * @param {number} dateInMiliseconds
 * @returns {number}
 */
function getBookingDay(dateInMiliseconds: number): number {
  const daySelected = new Date(dateInMiliseconds);
  const bookDay = new Date(daySelected.getFullYear(), daySelected.getMonth(), daySelected.getDate());
  return bookDay.getTime();
}



interface HospitalAppointment {
  appointment_date: number;
  appointment_time: string;
  date_created: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: number;
  uid: string;
  confirmed: boolean;
  completed: boolean;
  status: string;
}

interface UserAppointment {
  medical_center: string;
  appointment_date: number;
  city: string;
  address: string;
  center_id: string;
  date_created: number;
  appointment_time: string;
  confirmed: boolean;
  completed: boolean;
  status: string;
}

interface User {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  dob?: number;
  blood_type?: string;
  rh?: string;
  email_notification?: boolean;
  sms_notification?: boolean;
  canDonate: boolean;
  role?: string;
  date_created: number;
  photoUrl?: string;
  subscribed_to: string[];
}
