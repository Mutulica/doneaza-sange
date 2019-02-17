import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
// Env
import { environment } from '../environments/environment';
// Language
import { registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome';


import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';


import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule} from '@angular/fire/storage';

import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';


import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { AuthService } from './core/auth.service';
// Guards
import { AuthGuard } from './core/auth.guard';
import {HospitalGuard} from './core/hospital.guard';

registerLocaleData(localeRo, 'ro');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRouting,
    LayoutModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule,
    AngularFireStorageModule,
  ],
  providers: [
    AuthService,
    AngularFireAuth,
    AngularFirestore,
    AuthGuard,
    HospitalGuard,
    {provide: LOCALE_ID, useValue: 'ro'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
