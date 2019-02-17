import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import {HomeComponent} from './home/home.component';
import {AppointmentAddComponent} from './appointment-add/appointment-add.component';
import {AppointmentViewComponent} from './appointment-view/appointment-view.component';
import {NotificationsComponent} from './notifications/notifications.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HospitalsListComponent} from './hospitals-list/hospitals-list.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'appointment', component: AppointmentViewComponent},
      { path: 'dashboard', component: DashboardComponent},
      { path: 'appointment-add', component: AppointmentAddComponent},
      { path: 'alerts', component: NotificationsComponent},
      { path: 'user', component: UserDetailsComponent},
      { path: 'hospitals', component: HospitalsListComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersPanelRoutingModule { }
