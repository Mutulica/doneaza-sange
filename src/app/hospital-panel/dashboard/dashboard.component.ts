import {Component, OnDestroy, OnInit} from '@angular/core';
import {HospitalAppointment} from '../../models/hospital/hospital-appointment.model';
import {HospitalPanelService} from '../hospital-panel.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  public appointments: HospitalAppointment[];

  private _sub: Subscription;

  constructor(
    private _hospitalService: HospitalPanelService,
  ) {
    this._sub = this._hospitalService.getPastUnconfirmedApp().subscribe(res => {
      this.appointments = res;
    });
  }


  ngOnInit() {}


  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
