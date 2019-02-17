import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersPanelService} from '../users-panel.service';
import {Hospital} from '../../models/hospital/hospital.model';
import {Subscription} from 'rxjs';
import {User} from '../../models/user/user.model';
import {NotificationsService} from '../notifications.service';
import {UserSubscription} from '../../models/user/user-subscription.model';

@Component({
  selector: 'app-hospitals-list',
  templateUrl: './hospitals-list.component.html',
  styleUrls: ['./hospitals-list.component.scss']
})
export class HospitalsListComponent implements OnInit, OnDestroy {

  // User
  public user: User;
  // Fav. Hospitals list
  public favoriteHospitals: UserSubscription[];
  // Hospitals List
  public hospitals: Hospital[];


  // subscriptions
  private _userSub: Subscription;
  private _hospitalSub: Subscription;
  private _favListSub: Subscription;

  constructor(
    private _userPanelService: UsersPanelService,
    private _notificationsService: NotificationsService
  ) {
    // ==> Get: User
    this._userSub = this._userPanelService.loggedInUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.getSubscriptions();
      }
    });
    // ==> Get: Hospitals
    this._hospitalSub = this._userPanelService.hospitals$.subscribe(
      hospitals => this.hospitals = hospitals
    );


  }

  ngOnInit() {}

  // On user subscribe/unsubscribe
  public onAddRemoveSubscription(hospitalId: string, index?: number): void {
    !this.onCheckSubscription(hospitalId) ? this.userSubscribeToHospital(hospitalId, index) : this.userUnsubscribeFromHospital(hospitalId);
  }

  // Get user subscriptions
  private getSubscriptions(): void {
    this._favListSub = this._notificationsService.getSubscriptions().subscribe(
      res => {
        if (res) {
          this.favoriteHospitals = res;
        }
      }
    );
  }


  // Subscribe to hospital
  public async userSubscribeToHospital(hospitalId: string, index: number): Promise<void> {
    if (hospitalId) {
      const hospital = this.hospitals[index];
      const userSubscription: UserSubscription = {
          medical_center_name: hospital.medical_center_name,
          address: hospital.address,
          city: hospital.city,
          county: hospital.county,
          phone: hospital.phone,
          uid: hospital.uid
        };
        // Add new subscription
        await this._userPanelService.hospitalSubscriptionAdd(userSubscription);
    }
  }

  // Unsubscribe from hospital
  public async userUnsubscribeFromHospital(id: string): Promise<void> {
    await this._userPanelService.hospitalSubscriptionRemove(id);
  }

  // Check if subscribed to hospital
  public onCheckSubscription(hospitalId: string): boolean {
    if (this.favoriteHospitals) {
      return this.favoriteHospitals.some(el =>  el.uid === hospitalId);
    }
    return false;
  }

  ngOnDestroy() {
    this._userSub.unsubscribe();
    this._hospitalSub.unsubscribe();
    this._favListSub.unsubscribe();
  }
}
