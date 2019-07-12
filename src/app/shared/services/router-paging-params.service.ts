import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { SortOrder, Sort } from '../models/sort.model';
import { Pager } from '../models/pager.model';
import { AppConstant } from '../constants/app.constant';

@Injectable()
export class RouterPagingParams implements Resolve<Pager> {

    constructor() {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Pager {
        const page: string = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort: string = route.queryParams['sort'] ? route.queryParams['sort'] : 'id:asc';
        let sorts: Sort[] = [];

        let sortStrings: string[] = sort.split(',');

        for (let i = 0; i < sortStrings.length; i++) {
            sorts[i] = new Sort(sortStrings[i].split(':')[0], sortStrings[i].split(':')[1]);
        }

        return new Pager(page, AppConstant.PAGE_SIZE, sorts);
    }
}