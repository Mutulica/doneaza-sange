import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersPanelService} from '../users-panel.service';
import {User} from '../../models/user/user.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public user: User;
  private sub: Subscription;
  constructor(
    private userPanel: UsersPanelService,
  ) {
   this.sub = this.userPanel.loggedInUser$.subscribe(user => this.user = user);
  }

  ngOnInit() {
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
