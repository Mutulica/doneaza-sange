import {Component, Input, OnInit} from '@angular/core';
import {HospitalAppointment} from '../../models/hospital/hospital-appointment.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilsService} from '../../shared/utils.service';
import {HospitalPanelService} from '../hospital-panel.service';

@Component({
  selector: 'app-appointment-table',
  templateUrl: './appointment-table.component.html',
  styleUrls: ['./appointment-table.component.scss']
})
export class AppointmentTableComponent implements OnInit {

  // Data
  @Input() dataList: HospitalAppointment[];
  // Ignore columns
  @Input() doNotDisplay = [];
  @Input() actions = '';
  // Data list copy
  public dataListClone: HospitalAppointment[] = this.dataList;

  get dataArray(): HospitalAppointment[] {
    return this.dataListClone ? this.dataListClone : this.dataList;
  }

  // Pagination
  public itemsPerPage = 10;
  public curentPage = 1;

  // Search input
  public filter = new FormControl('');
  // Clicked Row
  public selectedAppointment: HospitalAppointment;

  // If can confirm App.
  get canConfirm() {
    if (this.selectedAppointment) {
      return this.selectedAppointment.appointment_date < Date.now();
    }
    return false;
  }

  // If status is pending
  public statusForm = new FormGroup({
    status: new FormControl(null, Validators.required)
  });

  // Confirmation error
  public statusResultError: boolean;

  constructor(
    private _modalService: NgbModal,
    private _utilsService: UtilsService,
    private _hospitalService: HospitalPanelService
  ) {}

  ngOnInit() {}

  // Set selected appointment
  public onViewAppointment(appointment: HospitalAppointment): void {
    this.selectedAppointment = appointment;
  }

  // Confirm Appointment presence
  public async onConfirmApp(): Promise<void> {
    this.statusResultError = false;
    if (this.statusForm.valid) {
      const res = await this._hospitalService.confirmAppointment(this.selectedAppointment, this.statusForm.value.status);
      res ? this._modalService.dismissAll() : this.statusResultError = true;
    }
  }

  // Search box
  public onSearchBox() {
    if (this.filter.value.length >= 2 && this.dataList) {
      setTimeout(() => {
        this.dataListClone = this._utilsService.searchInObjArray(this.dataList, this.filter.value);
      }, 400);
    } else {
      this.dataListClone = this.dataList;
    }
  }

  // Open Modal
  open(content) {
    this._modalService.open(content);
  }

}
