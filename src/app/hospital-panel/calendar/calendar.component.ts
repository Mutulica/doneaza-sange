import {Component, OnDestroy, OnInit} from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {HospitalPanelService} from '../hospital-panel.service';

import {HospitalAppointment} from '../../models/hospital/hospital-appointment.model';
import {Hospital} from '../../models/hospital/hospital.model';
import {Subscription} from 'rxjs';
import {HospitalNotification} from '../../models/hospital/notification.model';



@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  private sub: Subscription;

  public hospital: Hospital;
  // Appointments
  public appointments: HospitalAppointment[] = [];
  // Get Hospital from service
  get center() {
    return this.hospitalService.hospital;
  }

  page = 1;
  pageSize = 10;
  collectionSize = 0;

  get appCollection(): HospitalAppointment[] {
    return this.appointments
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }


  constructor(
    private hospitalService: HospitalPanelService,
    private modal: NgbModal
  ) {
    // this.hospitalService.hospital$.subscribe(res => this.hospital = res );
  }

  ngOnInit() {
    if (this.center.uid) {
      this.getAllApp();
    }
  }



  // Get Subscribe to Appointments List
  private getAllApp(): void {
    if (this.center.uid) {
      this.sub = this.hospitalService.appointmentsGetAll(this.center.uid)
        .subscribe(res => {
          this.appointments = res as HospitalAppointment[];
          this.collectionSize = res.length;
        });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
