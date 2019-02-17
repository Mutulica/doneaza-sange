import { Component, OnInit } from '@angular/core';
import {HospitalNotification} from '../../models/hospital/notification.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificationsService} from '../notifications.service';

@Component({
  selector: 'app-notification-send',
  templateUrl: './notification-send.component.html',
  styleUrls: ['./notification-send.component.scss']
})
export class NotificationSendComponent implements OnInit {

  // Alert
  status = {
    success: false,
    error: false
  };
  // Form
  notificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificationsService: NotificationsService
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  // Send notification
  public async onSendNotification(): Promise<void> {
    const notification = this.notificationForm.value as HospitalNotification;
    notification.date_created = Date.now();
    notification.hospital_center_name = this.notificationsService.hospital.medical_center_name;
    // Send Request
    const res = await this.notificationsService.notificationAdd(notification);
    if (res) {
      // Reset form
      this.notificationForm.reset();
    }
    // Display error or success
    this.showMessage(res);
  }


  // Show Error or Success
  private showMessage(result: boolean): void {
    this.status.success  = result;
    this.status.error = !result;
    setTimeout(() => {
      this.status.success  = false;
      this.status.error = false;
    }, 3000);
  }

  // Build Notification form
  private buildForm(): void {
    this.notificationForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required]),
      blood_type: new FormControl('', [Validators.required]),
      rh: new FormControl('', [Validators.required]),
    });
  }
}
