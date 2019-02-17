import {UserAppointment} from './user-appointment.model';

export interface User {
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
  appointments_history?: UserAppointment[];
  next_appointment?: UserAppointment;
  canDonate: boolean;
  role?: string;
  date_created: number;
  photoUrl?: string;
  subscribed_to: string[];
}
