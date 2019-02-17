import {Component, OnDestroy, OnInit} from '@angular/core';
import { UsersPanelService } from '../users-panel.service';

import {Hospital} from '../../models/hospital/hospital.model';
import {UtilsService} from '../../shared/utils.service';

import {NgbDateStruct, NgbCalendar, NgbDatepickerConfig, NgbDate} from '@ng-bootstrap/ng-bootstrap';

import {UsersBookingService} from '../users-booking.service';
import {User} from '../../models/user/user.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-appointment-add',
  templateUrl: './appointment-add.component.html',
  styleUrls: ['./appointment-add.component.scss']
})
export class AppointmentAddComponent implements OnInit, OnDestroy {

  public user: User;
  public status = {loading: false, loaded: false, error: false};
  public userActions = {success: false, error: false};
  // Calendar date model
  public dateModel: NgbDateStruct;
  // Selected Date
  public selectedDate: number;
  // Selected appointment time
  public selectedTime: string;
  // Hospitals list
  public hospitals: Hospital[];
  // Selected hospital
  public selectedHospital: Hospital;
  // Hospital available booking hours
  public hospitalBookingHours: string[];

  private userSub: Subscription;
  private hospitalSub: Subscription;

  constructor(
    private userService: UsersPanelService,
    public usersBookingService: UsersBookingService,
    private utilsService: UtilsService,
    public calendar: NgbCalendar,
    private config: NgbDatepickerConfig,
  ) {
      // this.userService.addHospital();
      this.hospitalSub = this.userService.hospitals$.subscribe( res => this.hospitals = res);

      this.userSub = this.userService.loggedInUser$.subscribe( user => {
        this.user = user;
        // TODO uncomment this after booking system testing
        // this.setMinDate(user);
      });
  }

  ngOnInit() {
    // this.model = this.calendar.getToday();
    // this.selectedDate = this.utilsService.convertDateToMiliseconds(this.calendar.getToday());
    this.config.outsideDays = 'hidden';
    this.config.markDisabled = (date: NgbDate) => this.calendar.getWeekday(date) >= 6;
    this.status.loaded = true;
  }
  // Set min date to 30 days after last appointments
  // and maxDate 14 days after minDate
  private async setMinDate(user: User): Promise<void> {
    if (user) {
      const nextApp = await this.userService.getNextApp();
      let minDate = this.calendar.getToday();
      if (nextApp.length > 0) {
        minDate = this.calendar.getNext(this.utilsService.convertToNgbDate(nextApp[0].appointment_date), 'd', 30) ;
        this.config.minDate = minDate;
      } else {
        this.config.minDate = minDate;
      }
      this.config.maxDate = this.calendar.getNext(minDate, 'd', 14);
    }
  }
  // Add new appointment
  public async onAddAppointment(): Promise<void> {
    this.status.loading = true;
    // Get date in miliseconds
    const appointDate = this.utilsService.convertDateToMiliseconds(this.dateModel, this.selectedTime);
    // Send new appointment request
    const appointment  = await this.usersBookingService.addNewAppointment(appointDate, this.selectedTime, this.selectedHospital);
    if (appointment) {
      this.userActions.success = true;
      this.status.loading = false;
      this.resetValues();
    } else {
      this.userActions.success = false;
      this.userActions.error = true;
      this.status.loading = false;
    }
  }


  // Set: Selected hospital
  public onHospitalChange(event): void {
    this.selectedHospital = this.hospitals[event.srcElement.value];
  }

  // Change date
  public async onChangeDate(event: NgbDate): Promise<void> {
    this.dateModel = event;
    this.selectedDate = this.utilsService.convertDateToMiliseconds(event);
    if (this.selectedHospital) {
      this.hospitalBookingHours = await this.usersBookingService.onChangeDate(event, this.selectedHospital);
    }
  }

  // Change time
  public onSelectTime(event): void {
    this.selectedTime = event.srcElement.value;
  }

  private resetValues() {
    this.selectedTime = null;
    this.selectedHospital = null;
    this.selectedDate = null;
    this.dateModel = null;
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.hospitalSub.unsubscribe();
  }
}
