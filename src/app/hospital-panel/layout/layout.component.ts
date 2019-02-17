import {Component, OnDestroy, OnInit} from '@angular/core';
import {HospitalPanelService} from '../hospital-panel.service';
import {Hospital} from '../../models/hospital/hospital.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  public hospital: Hospital;
  private sub: Subscription;

  constructor(
    private hospitalService: HospitalPanelService
  ) {
    this.sub = this.hospitalService.hospital$.subscribe(
        hospital => this.hospital = hospital
    );
  }

  ngOnInit() {
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
