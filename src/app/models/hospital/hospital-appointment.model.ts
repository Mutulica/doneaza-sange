export interface HospitalAppointment {
  appointment_date: number;
  appointment_time: string;
  date_created: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  uid: string;
  blood_type: string;
  rh: string;
  status?: string;
}
