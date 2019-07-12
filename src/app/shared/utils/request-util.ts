import { HttpParams } from '@angular/common/http';

import { Pager } from '..';

export const createRequestParams = (pager?: Pager): HttpParams => {
  let httpParams: HttpParams = new HttpParams();
  if (pager) {
    httpParams = httpParams.append('_page', pager.page.toString());
    httpParams = httpParams.append('_limit', pager.limit.toString());

    if (pager.sorts) {
      const sortsParam: string = pager.sorts.toString().replace(',', '$');
      httpParams = httpParams.append('sort', sortsParam);
    }

  }
  return httpParams;
};