import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../core/auth.service';
import {User} from '../../models/user/user.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userAuthService: AuthService,
    private router: Router
  ) {
    this.createRegistrationForm();
  }

  ngOnInit() {

  }

  public async onUserRegister() {
    if (this.registrationForm.valid) {
      const newUser = this.createUserObj();
      console.log(this.registrationForm.value);
      const user = await this.userAuthService.registerWithEmailAndPass(newUser, this.registrationForm.value.password);
      if (user) {
        this.router.navigate(['/user-panel']);
      }
    }
  }

  private createRegistrationForm(): void {
    this.registrationForm = this.fb.group({
      firstName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  private createUserObj(): User {
    return {
      firstName: this.registrationForm.value.firstName,
      lastName: this.registrationForm.value.lastName,
      email : this.registrationForm.value.email,
    } as User;
  }
}
