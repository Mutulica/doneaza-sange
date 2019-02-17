import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersPanelService} from '../users-panel.service';
import {Subscription} from 'rxjs';
import {UserAppointment} from '../../models/user/user-appointment.model';

@Component({
  selector: 'app-appointment-view',
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.scss']
})
export class AppointmentViewComponent implements OnInit, OnDestroy {

  public userAppointments: UserAppointment[];
  private sub: Subscription;

  get isUserLoaded () {
    return this.userPanelService.userLoaded;
  }

  constructor(
    private userPanelService: UsersPanelService
  ) {
    this.sub = this.userPanelService.loggedInUser$.subscribe(async user => {
      if (user) {
        this.getAppList();
      }
    });
  }

  ngOnInit() {
  }

  public async onDeleteApp(appointment: UserAppointment) {
    const res = await this.userPanelService.userDeleteAppointment(appointment.appointment_date);
  }

  private async getAppList() {
    this.userAppointments =  await this.userPanelService.getFutureApp();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
