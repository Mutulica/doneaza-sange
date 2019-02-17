import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BootstrapModule } from '../shared/bootstrap.module';

import { UserRoutingModule } from './user-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HospitalLoginComponent } from './hospital-login/hospital-login.component';

@NgModule({
  declarations: [SignInComponent, SignUpComponent, HospitalLoginComponent],
  imports: [
    UserRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BootstrapModule
  ],
  providers: []
})
export class UserModule { }
