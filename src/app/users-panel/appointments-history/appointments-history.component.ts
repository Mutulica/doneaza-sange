import { Component, OnInit } from '@angular/core';
import {UsersPanelService} from '../users-panel.service';
import {UserAppointment} from '../../models/user/user-appointment.model';

@Component({
  selector: 'app-appointments-history',
  templateUrl: './appointments-history.component.html',
  styleUrls: ['./appointments-history.component.scss']
})
export class AppointmentsHistoryComponent implements OnInit {

  public appointments: UserAppointment[];

  page = 1;
  pageSize = 10;
  collectionSize = 0;

  get appCollection(): UserAppointment[] {
    return this.appointments
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  constructor(
    private userService: UsersPanelService
  ) {}

  ngOnInit() {
    this.getUserPastApp();
  }

  private async getUserPastApp() {
    this.appointments = await this.userService.getPastConfirmedApp();
    this.collectionSize = this.appointments.length;
  }
}
