import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import {SignUpComponent} from './sign-up/sign-up.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {HospitalLoginComponent} from './hospital-login/hospital-login.component';

const routes: Routes = [
  {
    path: '' ,
    children: [
      { path: '', component: SignUpComponent },
      { path: 'user-login', component: SignInComponent },
      { path: 'centru', component: HospitalLoginComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
