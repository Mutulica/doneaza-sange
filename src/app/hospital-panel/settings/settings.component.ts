import {Component, OnDestroy, OnInit} from '@angular/core';
import {Hospital} from '../../models/hospital/hospital.model';
import {HospitalPanelService} from '../hospital-panel.service';
import {Subscription} from 'rxjs';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilsService} from '../../shared/utils.service';
import {ImageUploadService} from '../../shared/image-upload.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  timeFrom = {hour: 7, minute: 0};
  hourStep = 1;
  minuteStep = 30;

  public hospital: Hospital;
  public detailsForm: FormGroup;
  public timeSchedule: FormGroup;

  public editForm: boolean;

  private _sub: Subscription;

  constructor(
    private _hospitalService: HospitalPanelService,
    private _fb: FormBuilder,
    private _utilsService: UtilsService,
    private _imageUploadService: ImageUploadService
  ) {
    this._sub = this._hospitalService.hospital$.subscribe(
      (res: Hospital | null) => {
        this.hospital = res;
        if (res) {
          this.buildHospitalForm();
        }
      }
    );

  }

  ngOnInit() {
    this.buildScheduleForm();
  }

  private buildHospitalForm(): void {
    this.detailsForm = this._fb.group({
      medical_center_name: new FormControl(this.hospital.medical_center_name, []),
      city: new FormControl(this.hospital.city, []),
      address: new FormControl(this.hospital.address, []),
      phone: new FormControl(this.hospital.phone, []),
      email: new FormControl(this.hospital.email, []),
    });
  }

  // Edit button clicked
  public onEditDetails(): void {
    this.editForm = !this.editForm;
  }
  // On Change Profile image
  public async imageUpload(event) {
    const type = event.target.files[0].type.split('/')[0];
    if (type === 'image') {
      try {
        const image = await this._imageUploadService.uploadImage(event.target.files[0], this.hospital.uid);
        if (image) {
          this.hospital.photoUrl = image;
          await this._hospitalService.hospitalDetailsUpdate(this.hospital);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  // Save details
  public async onSaveDetails(): Promise<void> {
    const res = await this._hospitalService.hospitalDetailsUpdate(this.detailsForm.value);
    if ( res ) {
      this.onEditDetails();
    }
  }

  // Cancel Edit
  public onCancelEdit(): void {
    this.buildHospitalForm();
    this.onEditDetails();
  }

  public onSaveSchedule() {
    console.log(this.scheduleArray.value);

    this.sendNewSchedule();
  }

  private async sendNewSchedule() {
    const hospital = this._hospitalService.hospital;
    this.scheduleArray.value.forEach(el => {
      console.log(hospital.working_schedule);
      hospital.working_schedule[el.weekday] = this._utilsService.getTimeBetween(
            `${el.timeFrom['hour']}:${el.timeFrom['minute']}`,
            `${el.timeTo['hour']}:${el.timeTo['minute']}`,
            30);
    });
    const res = await this._hospitalService.hospitalDetailsUpdate(hospital);
    if (res) {
      this.timeSchedule.reset();
    }
  }

  public async buildSchedule() {
   const schedule = this._utilsService.getTimeBetween('09:00', '15:00', 30);
   const hospital = this._hospitalService.hospital;
   hospital.working_schedule.friday = schedule;
   await this._hospitalService.hospitalDetailsUpdate(hospital);
  }

  public addDay(): void {
    this.scheduleArray.push(this.addHoursGroup());
  }

  public removeDay(index): void {
    this.scheduleArray.removeAt(index);
  }

  private buildScheduleForm() {
    this.timeSchedule = this._fb.group( {
      working_schedule: this._fb.array([this.addHoursGroup()])
    });
  }

  private addHoursGroup() {
    return this._fb.group({
      weekday: [null, Validators.required],
      timeFrom: [null, Validators.required],
      timeTo: [null, Validators.required]
    });
  }

  get scheduleArray() {
    return <FormArray>this.timeSchedule.get('working_schedule');
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

}
