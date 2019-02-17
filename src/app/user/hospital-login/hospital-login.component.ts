import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../core/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-hospital-login',
  templateUrl: './hospital-login.component.html',
  styleUrls: ['./hospital-login.component.scss']
})
export class HospitalLoginComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(
    public userAuthService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
  }

  public async onEmailAndPassLogin(): Promise<void> {
    if (this.loginForm.valid) {
      const user = await this.userAuthService.hospitalSignInWithEmail(this.loginForm.value.email, this.loginForm.value.password);
      if (user) {
        this.router.navigate(['/hospital-panel']);
      }
    }
  }

}
