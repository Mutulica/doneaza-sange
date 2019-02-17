import {Injectable, OnDestroy} from '@angular/core';
import { User } from '../models/user/user.model';
import { UtilsService } from '../shared/utils.service';
import {UsersPanelService} from './users-panel.service';
import {Subscription} from 'rxjs';
import {Hospital} from '../models/hospital/hospital.model';
import {UserAppointment} from '../models/user/user-appointment.model';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class UsersBookingService implements OnDestroy {

  // Logged in user
  public user: User;
  // If 30 days passed since last donation
  public canDonate: boolean;
  // Selected Date
  public selectedDate: number;

  private sub: Subscription;

  constructor(
    private utilsService: UtilsService,
    private userService: UsersPanelService,
  ) {
    this.sub = this.userService.loggedInUser$.subscribe(user => {
      this.user = user;
      // if (user) {
      //   this.checkForAppointments(user);
      // }
    });

  }

  // Check if your can make appointment
  // Return the no. days have passed since the last one
  public checkForAppointments(user: User): void {
    // Set: min days
    let numDays = 30;
    if (user && user.next_appointment) {
      // Get number of days
      numDays = this.utilsService.numDaysBetween(user.next_appointment);
    } else if (user && user.appointments_history.length) {
      const appLength = user.appointments_history.length;
      numDays = this.utilsService.numDaysBetween(user.appointments_history[appLength - 1]);
    }
    numDays >= 30 ? this.canDonate = true : this.canDonate = false;
  }

  // Add appointment
  public async addNewAppointment(date: number, time: string, hospital: Hospital): Promise<boolean> {

    if (hospital && date && time) {
      // Check if appointment exists
      const ifAppExists = await this.userService.appointmentExists(date, time, hospital.uid);
      // If false, add new appointment
      if (!ifAppExists) {
        // Create User appointment Obj
        const userAppointment = this.createUserAppObj(date, time, hospital);
        // Add new appointment
        return await this.userService.userAddAppointment(hospital, userAppointment);
      } else {
        return false;
      }

    }

  }

  // Calendar Date selected
  public async onChangeDate(date: NgbDate, hospital: Hospital): Promise<string[]> {
    if (date) {
      const selectedDate = this.utilsService.convertDateToMiliseconds(date);
      // Get: booked hours array
      const hospitalBookedHours = await this.userService.getBookedHours(selectedDate, hospital.uid);
      // Set: hospitalWorkingHours
      return hospitalBookedHours ? this.listSchedule(hospitalBookedHours, selectedDate, hospital) : [];
    }
  }


  // Get the available booking hours
  public listSchedule(data: string[], selectedDate: number, hospital: Hospital): string[] {
    const day = this.utilsService.getDayOfWeek(selectedDate);
    const updatedSchedule = hospital.working_schedule[day];
    if (updatedSchedule) {
      return updatedSchedule.filter(hours => {
        const index = data.indexOf(hours);
        return index < 0 ? hours : null;
      });
    } else {
      return hospital.working_schedule[day];
    }
  }



  private createUserAppObj(selectedDate: number, selectedTime: string, hospital: Hospital): UserAppointment {
    return {
      date_created: new Date().getTime(),
      city: hospital.city,
      address: hospital.address,
      medical_center: hospital.medical_center_name,
      center_id: hospital.uid,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      status: 'pending'
    };
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
