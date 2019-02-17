import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout/layout.component';
import { HomeModule } from './home/home.module';
import {AuthGuard} from './core/auth.guard';
import {HospitalGuard} from './core/hospital.guard';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', loadChildren: './home/home.module#HomeModule'},
      { path: 'login', loadChildren: './user/user.module#UserModule' },
      { path: 'useful-info', loadChildren: './useful-info/useful-info.module#UsefulInfoModule' },
      { path: 'user-panel', loadChildren: './users-panel/users-panel.module#UsersPanelModule', canActivate: [AuthGuard] },
      { path: 'hospital-panel', loadChildren: './hospital-panel/hospital-panel.module#HospitalPanelModule', canActivate: [HospitalGuard] },
    ],
  },
];


@NgModule({
  imports: [
    HomeModule,
    RouterModule.forRoot([
      ...routes,
    ], {
      scrollPositionRestoration: 'disabled',
      enableTracing: false
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouting { }
