import {Component, OnDestroy, OnInit} from '@angular/core';
import {HospitalAppointment} from '../../models/hospital/hospital-appointment.model';
import {HospitalPanelService} from '../hospital-panel.service';
import {Subscription} from 'rxjs';
import {UtilsService} from '../../shared/utils.service';

@Component({
  selector: 'app-appoint-history',
  templateUrl: './appoint-history.component.html',
  styleUrls: ['./appoint-history.component.scss']
})
export class AppointHistoryComponent implements OnInit, OnDestroy {

  // Appointments array
  public appointments: HospitalAppointment[];

  private _sub: Subscription;


  constructor(
    private _hospitalService: HospitalPanelService,
    private _utilsService: UtilsService
  ) {
    this._sub = this._hospitalService.getPastConfirmedApp().subscribe(
      result => {
        // this.appointments = this._utilsService.sortObjDesc(result, 'appointment_date', 'desc');
        this.appointments = result;
      }
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
