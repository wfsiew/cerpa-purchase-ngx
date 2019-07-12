import { HttpHeaders } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';

import { Pagination } from '../models/pagination.model';
import { AppConstant } from '../constants/app.constant';
import { ResponseWrapper } from '../models';

export const parsePagination = (headers?: HttpHeaders): Pagination => {
  let pagination: Pagination = new Pagination();

  pagination.totalRecords = parseInt(headers.get(AppConstant.HTTP_HEADER.X_TOTAL_COUNT));

  const linkValue: string = headers.get(AppConstant.HTTP_HEADER.LINK);

  if (linkValue && linkValue.length !== 0) {
    let parts: string[] = linkValue.split(',');
    // Parse each part into a named link
    parts.forEach(part => {
      let section: string[] = part.split(';');

      if (section.length !== 2) {
        throw new Error('section could not be split on ";"');
      }

      let url: string = section[0].replace(/<(.*)>/, '$1').trim();
      let name: string = section[1].replace(new RegExp('([^?=&]+)(="([^&]*)")?', 'g'), function ($0, $1, $2, $3) { return $3; });

      pagination[name] = url;
    });

    const totalPages = pagination.last.match(/page=(\d+).*$/)[1]
    pagination.totalPages = parseInt(totalPages);
  } else {
    pagination.totalPages = 1;
  }

  return pagination;
};

export class ResUtil {

  static convertResponseList<T>(res: HttpResponse<any>, o: new() => T): ResponseWrapper {
    const results = [];
    //console.log("headers ===", res.headers);
  
    for (let i = 0; i< res.body.length; i++) {
      const entity: T = Object.assign(new o(), res.body[i]);
      results.push(entity);
    }
  
    return new ResponseWrapper(res.headers, results, res.status);
  }
  
  static convertResponse<T>(res: HttpResponse<any>, o: new() => T): ResponseWrapper {
    const entity: T = Object.assign(new o(), res.body);
    
    return new ResponseWrapper(res.headers, entity, res.status);
  }
}