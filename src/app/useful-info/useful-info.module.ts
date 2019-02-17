import { NgModule } from '@angular/core';

import { UsefulInfoRoutingModule } from './useful-info-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    UsefulInfoRoutingModule
  ]
})
export class UsefulInfoModule { }
