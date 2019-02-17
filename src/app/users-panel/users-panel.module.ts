import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BootstrapModule } from '../shared/bootstrap.module';
import { NgxPaginationModule } from 'ngx-pagination';
// Services
import { UsersPanelService } from './users-panel.service';
import { UtilsService } from '../shared/utils.service';
import {UsersBookingService} from './users-booking.service';
import { ImageUploadService } from '../shared/image-upload.service';
import {NotificationsService} from './notifications.service';

import { UsersPanelRoutingModule } from './users-panel-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

// Components
import { HomeComponent } from './home/home.component';
import { AppointmentAddComponent } from './appointment-add/appointment-add.component';
import { AppointmentViewComponent } from './appointment-view/appointment-view.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppointmentsHistoryComponent } from './appointments-history/appointments-history.component';
import { HospitalsListComponent } from './hospitals-list/hospitals-list.component';
import { DonorFormComponent } from './donor-form/donor-form.component';

@NgModule({
  declarations: [
    HomeComponent,
    AppointmentAddComponent,
    AppointmentViewComponent,
    NotificationsComponent,
    UserDetailsComponent,
    DashboardComponent,
    AppointmentsHistoryComponent,
    HospitalsListComponent,
    DonorFormComponent
  ],
  imports: [
    UsersPanelRoutingModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BootstrapModule,
    NgxPaginationModule,
  ],
  providers: [
    UsersPanelService,
    UtilsService,
    UsersBookingService,
    ImageUploadService,
    NotificationsService
  ]
})
export class UsersPanelModule { }
