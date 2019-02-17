import { NgModule } from '@angular/core';

import {
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbAccordionModule,
  NgbModalModule,
  NgbTimepickerModule,
  NgbTabsetModule,
  NgbPaginationModule,
  NgbTooltipModule,
  NgbAlertModule,
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbModalModule,
    NgbTimepickerModule,
    NgbTabsetModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbAlertModule,
  ],
  exports: [
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbModalModule,
    NgbTimepickerModule,
    NgbTabsetModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbAlertModule,
  ],
  providers: []
})

export class BootstrapModule {}
