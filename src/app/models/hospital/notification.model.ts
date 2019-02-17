export interface HospitalNotification {
  title: string;
  body: string;
  subject?: string;
  blood_type: string;
  rh: string;
  date_created: number;
  hospital_center_name: string;
}
