import {Component, OnDestroy, OnInit} from '@angular/core';
import {HospitalPanelService} from '../hospital-panel.service';
import {HospitalAppointment} from '../../models/hospital/hospital-appointment.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-appoint-next',
  templateUrl: './appoint-next.component.html',
  styleUrls: ['./appoint-next.component.scss']
})
export class AppointNextComponent implements OnInit, OnDestroy {

  public appointments: HospitalAppointment[];
  public doNotDisplay = ['status'];

  private _sub: Subscription;

  constructor(
    private _hospitalService: HospitalPanelService,
  ) {
    this._sub = this._hospitalService.getFutureApp().subscribe(
      res => {
        this.appointments = res;
      }
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
