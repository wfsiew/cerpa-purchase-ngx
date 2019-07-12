import { Injectable } from '@angular/core';
import { SearchOption } from './search.model';

@Injectable()
export class SearchService {

  searchOption: SearchOption;

  constructor() {
    this.searchOption = new SearchOption();
  }

  clearSearchOption() {
    this.searchOption.init();
  }
}
