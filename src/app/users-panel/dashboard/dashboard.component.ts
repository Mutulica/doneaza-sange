import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersPanelService } from '../users-panel.service';
import { User } from '../../models/user/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public user: User;
  private sub: Subscription
  constructor(
    private userService: UsersPanelService,
  ) {
    this.sub = this.userService.loggedInUser$.subscribe( user => this.user = user);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
