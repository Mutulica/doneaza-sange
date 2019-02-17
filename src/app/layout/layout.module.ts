import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BootstrapModule } from '../shared/bootstrap.module';

import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [HeaderComponent, LayoutComponent, FooterComponent],
  imports: [
    RouterModule,
    SharedModule,
    BootstrapModule
  ]
})
export class LayoutModule { }
