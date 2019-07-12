import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
@Pipe({
  name: 'money'
})
export class CurrencyPipes implements PipeTransform {

  constructor(private currencyPipe: CurrencyPipe){}
  transform(value: any, currency: string, symbol: boolean = false): any {
    return this.currencyPipe.transform(value, currency, symbol).split('0.00')[0];
  }
}

 