import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {Subscription} from 'rxjs';
import {User} from '../../models/user/user.model';
import {Hospital} from '../../models/hospital/hospital.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public isUserAuth: User;
  public isHospitalAuth: Hospital;
  private userSub: Subscription;
  private hospitalSub: Subscription;
  public isLoading = true;

  constructor(
    public authService: AuthService
  ) {
    this.userSub = this.authService.user$.subscribe( user => {
      this.isUserAuth = user;
      this.isLoading = false;
    });
    this.hospitalSub = this.authService.hospital$.subscribe( hospital => {
      this.isHospitalAuth = hospital;
      this.isLoading = false;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.hospitalSub.unsubscribe();
  }
}
