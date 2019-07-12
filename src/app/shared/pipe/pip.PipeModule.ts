import { NgModule }      from '@angular/core';
import { DateAgoPipe } from './date-ago.pipe';
import { CurrencyPipes } from './currency.pipe';

@NgModule({
    imports:        [],
    declarations:   [DateAgoPipe, CurrencyPipes],
    exports:        [DateAgoPipe, CurrencyPipes],
})

export class PipeModule {

  static forRoot() {
     return {
         ngModule: PipeModule,
         providers: [],
     };
  }
} 