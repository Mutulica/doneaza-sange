import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HospitalNotification} from '../../models/hospital/notification.model';
import {Subscription} from 'rxjs';
import {UtilsService} from '../../shared/utils.service';
import {NotificationsService} from '../notifications.service';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})

export class NotificationsComponent implements OnInit, OnDestroy {

  // Not. List
  public notificationsList: HospitalNotification[];
  public notificationsClone: HospitalNotification[];
  // Selected notification
  public selectedNotification: HospitalNotification;
  // Edit form
  public editForm: FormGroup;
  // Edit Mode
  public isEditing = false;
  // Search box input filter
  public filter = new FormControl('');
  public itemsPerPage = 10;
  public curentPage = 1;

  public isError = false;

  @ViewChild('content') modalContent;
  // Not. Subscription
  private _sub: Subscription;

  constructor(
    private _utilsService: UtilsService,
    private _notificationsService: NotificationsService,
    private _modalService: NgbModal,
    private _fb: FormBuilder,
    config: NgbModalConfig
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;

    this._sub = this._notificationsService.notificationListen().subscribe(res => {
      this.notificationsList = res;
      this.notificationsClone = res;
    });
  }

  ngOnInit() {}


  // Search box
  public onSearchBox() {
    if (this.filter.value.length >= 2) {
      setTimeout(() => {
        this.notificationsClone = this._utilsService.searchInObjArray(this.notificationsList, this.filter.value);
      }, 400);
    } else {
      this.notificationsClone = this.notificationsList;
    }
  }

  // TODO not working
  public onSortTable(value: string) {
    this.notificationsClone = this._utilsService.sortTable(this.notificationsClone, value, true);
  }

  // Delete notification
  public async onDeleteNotification(): Promise<void> {
    if (this.selectedNotification) {
      const res = await this._notificationsService.notificationDelete(this.selectedNotification.date_created);
      if (res) {
        this._modalService.dismissAll();
      }
    }
  }

  public onUpdateNotification() {
    this.isError = false;
    if (this.editForm.valid && this.editForm.dirty) {
      const notification: HospitalNotification = this.editForm.value;
      const res = this._notificationsService.notificationUpdate(notification);
      if (res) {
        this.isEditing = false;
        this.selectedNotification = this.editForm.value;
      } else {
        this.isError = true;
      }
    }
  }

  // TODO implement this
  // Get data by page
  // public async getchunk(): Promise<void> {
  //   if (this.data) {
  //     const index = this.data[this.data.length - 1];
  //     this.data = await this._notificationsService.notificationGetChunk(2, index.title);
  //   } else {
  //     this.data = await this._notificationsService.notificationGetChunk(2);
  //   }
  // }

  // Build Notification Edit Form
  public buildEditForm(notification: HospitalNotification) {
    this.editForm = this._fb.group({
      blood_type: [notification.blood_type, [Validators.required]],
      rh: [notification.rh, [Validators.required]],
      date_created: notification.date_created,
      title: [notification.title, [Validators.required]],
      subject: [notification.subject, [Validators.required]],
      body: [notification.body, [Validators.required]]
    });
    this.selectedNotification = this.editForm.value;
  }

  // Open Modal
  public open(notification: HospitalNotification): void {
    this._modalService.open(this.modalContent);
    this.buildEditForm(notification);
  }

  // Open Dialog
  public openDialog(dialog, notification: HospitalNotification) {
    this._modalService.open(dialog);
    this.selectedNotification = notification;
  }

  // Close Modal
  public closeModal() {
    this._modalService.dismissAll();
    this.isEditing = false;
    this.selectedNotification = null;
  }
  // Edit mode
  public toggleEditMode() {
    this.isEditing = !this.isEditing;
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
