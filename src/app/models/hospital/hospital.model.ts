import {WorkHours} from './work-hours.model';

export interface Hospital {
  uid: string;
  county: string;
  city: string;
  address: string;
  medical_center_name: string;
  appointments_list?: any[];
  working_schedule?: WorkHours;
  role: string;
  date_created: number;
  isActive: boolean;
  phone: string;
  email: string;
  photoUrl?: string;
}
