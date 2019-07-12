import { Injectable } from '@angular/core';
import { SortOrder } from '../models';
import { PageStateModel } from '../../components/inventory/inventory.model';

@Injectable()
export class PageStateService {
  currentUsername: string;
  isEditable = false;
  page = 1;
  sortField = null;
  sortOrder = SortOrder.ASC;
  searchData = null;
  init() {
    this.page = 1;
    this.sortField = null;
    this.sortOrder = SortOrder.ASC;
    this.searchData = null;
  }


  /** @see vendor */

  v_page: number = 1;
  v_sortField: string = null;
  v_sortOrder: SortOrder = SortOrder.ASC;
  v_searchData: string = '';
  v_paymentTermNo: any;
  v_status: any;
  v_paymentTermSelected = [];
  v_statusSelected = [];
  v_save: boolean = false;

  initVendor() {
    this.v_page = 1;
    this.v_save = false;
    this.v_sortField = null;
    this.v_sortOrder = SortOrder.ASC;
    this.v_searchData = '';
    this.v_paymentTermSelected = [];
    this.v_statusSelected = [];
  }

  vendor(page: number, sortField: string, sortOrder: any, searchKeyword: string, paymentTermSelected: any = [], statusSelected: any = []) {
    this.v_page = page;
    this.v_sortField = sortField;
    this.v_sortOrder = sortOrder;
    this.v_searchData = searchKeyword;
    this.v_paymentTermSelected = paymentTermSelected;
    this.v_statusSelected = statusSelected
  }
  /** @see Product Pricing State */

  pp_page: number = 1;
  pp_keyword: string = '';
  pp_promo: any = '';
  pp_tierPrice: any = '';
  pp_paymentTermData: any = '';
  pp_categoryParams: any = [];
  pp_paymentTermSelectedPP = [];
  pp_categoriesSelected = [];
  pp_filterSelected = [];
  pp_save: boolean = false;

  initPP() {
    this.pp_page = 1;
    this.pp_keyword = '';
    this.pp_promo = '';
    this.pp_tierPrice = '';
    this.pp_paymentTermData = '';
    this.pp_categoryParams = [];
    this.pp_paymentTermSelectedPP = [];
    this.pp_categoriesSelected = [];
    this.pp_filterSelected = [];
    this.pp_save = false;
  }


  /** @see Purchase Request */

  pr_page: number = 1
  pr_keyword: any = '';
  pr_status: any = '';
  pr_issuedDate: any = '';
  pr_selectedStatus = [];
  pr_statusList = [];
  pr_save: boolean = false;
  pr_saved_po: boolean = false;
  pr_isSearch: boolean = false;

  initPR() {
    this.pr_keyword = '';
    this.pr_status = '';
    this.pr_issuedDate = '';
    this.pr_selectedStatus = [];
    this.pr_statusList = [];
    this.pr_save = false;
    this.pr_saved_po = false;
    this.pr_isSearch = false;
  }

  PR(pr_page: number, pr_keyword: string, pr_status: string, pr_issuedDate: string, 
    pr_selectedStatus = [], pr_statusList = [], pr_save: boolean, pr_saved_po: boolean, pr_isSearch: boolean) {
    this.pr_page = pr_page;
    this.pr_keyword = pr_keyword;
    this.pr_status = pr_status;
    this.pr_issuedDate = pr_issuedDate;
    this.pr_selectedStatus = pr_selectedStatus;
    this.pr_statusList = pr_statusList;
    this.pr_save = pr_save;
    this.pr_saved_po = pr_saved_po;
    this.pr_isSearch = pr_isSearch;
  }

  /** @see Purchase Order  */

  po_page: number = 1;
  po_keyword: string = '';
  po_save: boolean = false;
  po_status = '';
  po_fromDate = '';
  po_toDate = ''
  po_selected = [];
  po_isSearch = false;

  PO(po_page: number, po_keyword: string, po_save: boolean, po_status, po_isSearch, po_fromDate, po_toDate, po_selected) {
    this.po_page = po_page;
    this.po_keyword = po_keyword;
    this.po_save = po_save;

    this.po_status = po_status;
    this.po_fromDate = po_fromDate;
    this.po_toDate = po_toDate;
    this.po_selected = po_selected;
    this.po_isSearch = po_isSearch;

  }
  initPO() {
    this.po_page = 1;
    this.po_keyword = '';
    this.po_save = false;

    this.po_status = '';
    this.po_fromDate = '';
    this.po_toDate = '';
    this.po_selected = [];
    this.po_isSearch = false;
  }

  constructor() { }

}

export class ModuleServices {
  public saveName(name: string) {
    localStorage.setItem('module-name', name);
  }
  initModule() {
    localStorage.setItem('module-name', 'Welcome');
  }
  getModelName(): string {
   return localStorage.getItem('module-name');
  }
}
