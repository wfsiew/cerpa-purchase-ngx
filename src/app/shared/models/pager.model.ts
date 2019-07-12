import { AppConstant } from '../constants/app.constant';
import { Sort, ProductPricingSort } from './sort.model';

export class Pager {
  limit: number;
  page: number;
  sorts: Sort[] | ProductPricingSort;
  constructor(page, limit?, sorts?) {
    this.page = page;
    if (limit) {
      this.limit = limit;
    } else {
      this.limit = AppConstant.PAGE_SIZE;
    }
    this.sorts = sorts;
  }
}
