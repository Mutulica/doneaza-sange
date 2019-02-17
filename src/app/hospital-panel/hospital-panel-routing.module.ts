import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LayoutComponent} from './layout/layout.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SettingsComponent} from './settings/settings.component';
import {CalendarComponent} from './calendar/calendar.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {NotificationViewComponent} from './notification-view/notification-view.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent},
      { path: 'setari', component: SettingsComponent},
      { path: 'calendar', component: CalendarComponent},
      { path: 'notificari', component: NotificationsComponent},
      { path: 'notificari/:id', component: NotificationViewComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitalPanelRoutingModule { }
