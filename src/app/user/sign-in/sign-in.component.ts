import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {


  // Password reset
  public passwordReset: boolean;
  public emailSentStatus: string;

  public loginForm: FormGroup;
  public resetPassForm: FormGroup;

  constructor(
    public userAuthService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
    this.resetPassForm = this.fb.group({
      email: [null, [Validators.required]]
    });
  }

  ngOnInit() {}

  public async googleAuth() {
    const user = await this.userAuthService.signInWithGoogle();

    if (user) {
      this.router.navigate(['/user-panel']);
    }
  }

  public async onEmailAndPassLogin(): Promise<void> {
    if (this.loginForm.valid) {
      const user = await this.userAuthService.signInWithEmail(this.loginForm.value.email, this.loginForm.value.password);
      if (user) {
        this.router.navigate(['/user-panel']);
      }
    }
  }

  public async onResetPassword() {
    if (this.resetPassForm.valid) {
      const res = await this.userAuthService.resetPassword(this.resetPassForm.value.email);
      res ? this.emailSentStatus = 'success' : this.emailSentStatus = 'error';
      console.log(this.emailSentStatus);
    }
    console.log(this.resetPassForm.value.email);
  }

  public togglePassResetForm() {
    this.emailSentStatus = '';
    this.resetPassForm.reset();
    this.passwordReset = !this.passwordReset;
  }

  ngOnDestroy() {
  }
}
