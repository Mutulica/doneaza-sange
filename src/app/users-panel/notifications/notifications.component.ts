import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UsersPanelService} from '../users-panel.service';
import {Subscription} from 'rxjs';
import {HospitalNotification} from '../../models/hospital/notification.model';
import {Hospital} from '../../models/hospital/hospital.model';
import {User} from '../../models/user/user.model';
import {NotificationsService} from '../notifications.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  // Modal content Ref
  @ViewChild('content') modalContent: ElementRef;

  public isLoading = false;
  // Notifications List
  public notifications: HospitalNotification[];
  // Selected Notification
  public selectedNotification: HospitalNotification;
  // Hospitals List
  public hospitals: Hospital[];

  // Logged user
  private user: User;
  // Notifications state
  // public showAllNotifications = false;

  // subscriptions
  private userSub: Subscription;
  private hospitalSub: Subscription;

  // Pagination
  public itemsPerPage = 10;
  public curentPage = 1;

  constructor(
    private _userService: UsersPanelService,
    private _notificationsService: NotificationsService,
    private _modalService: NgbModal,
  ) {
     this.userSub = this._userService.loggedInUser$.subscribe(user => {
        if (user) {
          this.user = user;
          this.isLoading = true;
          this.getSubscriptions();
        }
      });
  }

  ngOnInit() {
  }

  // Get user subscriptions
  private getSubscriptions(): void {
    this.hospitalSub = this._notificationsService.getSubscriptions().subscribe(
      hospitals => {
        if (hospitals) {
          this.hospitals = hospitals;
          this.getMyNotifications(hospitals);
        }
      }
    );
  }

  // Get user notifications
  public async getMyNotifications(hospitals: Hospital[]): Promise<void> {
    if (hospitals) {
      this.notifications = await this._notificationsService.notificationsGetFavorite(hospitals);
      this.isLoading = false;
    }
  }
  // On Hospital Selected
  public async onHospitalSelect(event): Promise<void> {
    event.target.value !== 'all'
      ? this.notifications = await this._notificationsService.getNotByHospitalId(event.target.value)
      : this.getMyNotifications(this.hospitals);
  }

  // Notification clicked
  public onViewNotification(notification: HospitalNotification): void {
    this.selectedNotification = notification;
    this.open(this.modalContent);
  }

  // Open Modal
  open(content: ElementRef): void {
    this._modalService.open(content);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.hospitalSub.unsubscribe();
    // this._notSub.unsubscribe();
  }
}
