import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BootstrapModule } from '../shared/bootstrap.module';
import { HospitalPanelRoutingModule } from './hospital-panel-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
// Services
import { HospitalPanelService } from './hospital-panel.service';
import { NotificationsService } from './notifications.service';
// Components
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { CalendarComponent } from './calendar/calendar.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AppointHistoryComponent } from './appoint-history/appoint-history.component';
import { AppointNextComponent } from './appoint-next/appoint-next.component';
import { NotificationSendComponent } from './notification-send/notification-send.component';
import { NotificationViewComponent } from './notification-view/notification-view.component';
import { AppointmentTableComponent } from './appointment-table/appointment-table.component';


@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    SettingsComponent,
    CalendarComponent,
    NotificationsComponent,
    AppointHistoryComponent,
    AppointNextComponent,
    NotificationSendComponent,
    NotificationViewComponent,
    AppointmentTableComponent,
  ],
  imports: [
    CommonModule,
    HospitalPanelRoutingModule,
    BootstrapModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
  providers: [
    HospitalPanelService,
    NotificationsService,
  ]
})
export class HospitalPanelModule { }
