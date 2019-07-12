import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../../environments/environment';
import { createRequestParams, ResponseWrapper, Pager, ResUtil } from '../../../shared';
import { PurchaseOrderList, RejectPo } from './purchase-order.model';
import { LookUpData } from './look-up/look-up.model';
import { IssuePO, RejectReason } from './issue-po.model';
import { VendorDoProduct } from '../product-pricing';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

Observable
@Injectable()
export class PurchaseOrderService {
  private baseurl = environment.baseUrl;
  private baseEnvurl = environment.baseUrl;
  private purchaseUrl = `${this.baseurl}/api/purchase`;
  private inventoryUrl = `${this.baseEnvurl}/api/inventory`;
  private purchaseOrderUrl = `${this.purchaseUrl}/purchase-order`;

  /** @see inventory_urls */
  private lookUpProductPricingUrl = `${this.inventoryUrl}` + '/material/lookup';   //Look Ups

  /** @see purchase_urls */
  private purchaseRequestUrl = this.purchaseUrl + '/purchase-request'; // add purchase request url 
  private poListUrl = `${this.purchaseUrl}/purchase-orders`;
  private searchPOUrl = `${this.purchaseUrl}/purchase-order/search`;
  private viewPOUrl = `${this.purchaseUrl}`;
  private rejectReasonListUrl = `${this.purchaseUrl}/purchase-order/reject-reasons`;
  private rejectUrl = `${this.purchaseUrl}/purchase-order`;
  private acceptUrl = `${this.purchaseUrl}/purchase-order`;
  private getDODetailsUrl = `${this.purchaseUrl}/purchase-order`
  private doDeliversUrl = `${this.purchaseUrl}/purchase-order`

  private searchSource = new BehaviorSubject('');
  currentSearch = this.searchSource.asObservable();

  headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private http: HttpClient) { }

  /**
   * @see check current user before the do any request
   */
  // queryCurrentUser() {
  //   return this.http.get(this.currentUserUrl);
  // }

  /**
 * @param pager 
 * @param term 
 * @see display the list of searched result in loop-up listing 
 */
  queryVendorLookUpList(pager?: Pager, term?, prId?: number): Observable<ResponseWrapper> {
    const httpParams: HttpParams = createRequestParams(pager);
    httpParams.append('status', status.toString())
    return this.http.get(`${this.purchaseUrl}/vendor/lookup?term=${term}&pr=${prId}`, { params: httpParams, observe: 'response', headers: this.headers })
      .map((res: HttpResponse<any>) => ResUtil.convertResponseList<LookUpData>(res, LookUpData));
  }

  queryAutolookUp(term, pr_id): Observable<object> {
    console.log(term, pr_id);
    
    return this.http.get(`${this.purchaseUrl}/vendor/autocomplete?term=${term}&pr=${pr_id}`,);
  }

  querySubmitPurchesReqouste(data): Observable<object> {
    return this.http.post(this.purchaseRequestUrl, data);
  }

  queryGetQ(vendor_id, prid): Observable<object> {
    if (vendor_id === null) {
      return this.http.get(`${this.purchaseUrl}/product-quotation?pr=${prid}`);
    }else{
      return this.http.get(`${this.purchaseUrl}/product-quotation?pr=${prid}&vendor=${vendor_id}`);
    }
  }

  queryListing(status?: number, pager?: Pager): Observable<ResponseWrapper> {
    const httpParams: HttpParams = createRequestParams(pager);
    return this.http.get(`${this.poListUrl}`, { params: httpParams, observe: 'response' })
      .map((res: HttpResponse<any>) => ResUtil.convertResponseList<PurchaseOrderList>(res, PurchaseOrderList));
  }

  /**
   * @param date 
   * search Purchase Order by terms 
   */

  querySearchPO(keyword: string, statusList, issuedDate, pager?: Pager): Observable<ResponseWrapper> {
    this.showLoader();
    const httpParams: HttpParams = createRequestParams(pager);
    const body = new HttpParams()
      .set('term', keyword)
      .set('status', statusList)
      .set('issued_date', issuedDate);
    return this.http.post(this.searchPOUrl, body.toString(), { params: httpParams, observe: 'response', headers: this.headers })
      .map((res: HttpResponse<any>) => ResUtil.convertResponseList<PurchaseOrderList>(res, PurchaseOrderList))
      .finally(() => this.hideLoader());
  }

  queryGetPOItems(poID: number, vendor: number): Observable<ResponseWrapper> {
    const httpParams: HttpParams = createRequestParams();
    return this.http.get(`${this.purchaseUrl}/product-quotation?pr=${poID}&vendor=${vendor}`, { params: httpParams, observe: 'response' })
      .map((res: HttpResponse<any>) => ResUtil.convertResponse<IssuePO>(res, IssuePO));
  }

  queryLoadDefualtVendor(prId: number) {
    var url = ``;
    return this.http.get(`${this.purchaseUrl}/vendor/${prId}`);
    // .map((res: HttpResponse<any>) => ResUtil.convertResponseList<LookUpData>(res, LookUpData));
  }

  queryGetDefualtVendor(prId: number, pager?: Pager) {
    const httpParams: HttpParams = createRequestParams(pager);
    var url = 'vendor/lookup';
    return this.http.get(`${this.purchaseUrl}/${url}?pr=${prId}`, { params: httpParams, observe: 'response' })
      .map((res: HttpResponse<any>) => ResUtil.convertResponseList<LookUpData>(res, LookUpData));
  }

  /**
   * @param totalPrice 
   * @param vendorID 
   * check credit limit ....
   */
  queryCheckCreditLimit(totalPrice: string, vendorID: number): Observable<object> {
    return this.http.get(`${this.purchaseUrl}/purchase-order/check-credit-limit?amount=${totalPrice}&vendor=${vendorID}`);
  }

  /**
   * @param data 
   * issue PO
   */
  queryIssuePO(data): Observable<ResponseWrapper> {
    const httpParams: HttpParams = createRequestParams();
    return this.http.post(`${this.purchaseUrl}/purchase-order`, data, { params: httpParams, observe: 'response' })
      .map((res: HttpResponse<any>) => ResUtil.convertResponse<IssuePO>(res, IssuePO));
  }

  queryChartInfo(id): Observable<Object> {
    return this.http.get(`${this.purchaseUrl}/purchase-order/${id}/delivery-status`);
  }

  queryDoItems(id): Observable<Object> {
    return this.http.get(`${this.purchaseUrl}/purchase-order/${id}/delivery-order/current`);
  }

  updateDoItems(id, data): Observable<ResponseWrapper> {
    const httpParams = new HttpParams();
    return this.http.put(`${this.purchaseUrl}/purchase-order/${id}/delivery-order/current`, data, { params: httpParams, observe: 'response' }).
      map((res: HttpResponse<any>) => ResUtil.convertResponse<VendorDoProduct>(res, VendorDoProduct));
  }

  queryItemsHistory(id): Observable<Object> {
    return this.http.get(`${this.purchaseUrl}/purchase-order/${id}/delivery-order/history`);
  }


  /**
   * @param id po id 
   * @see as_vendor get the po details to accept or reject the po
   */
  queryGetPurchaseOrderDetails(id, p): Observable<object> {
    const httpParams: HttpParams = createRequestParams();
    if (p === 'pr') {
      return this.http.get(`${this.viewPOUrl}/purchase-request/${id}/purchase-order`, { params: httpParams, observe: 'response' });
    } else if (p === 'po') {
      // api/purchase/purchase-order/{id}
      return this.http.get(`${this.viewPOUrl}/purchase-order/${id}`, { params: httpParams, observe: 'response' });
    } else {
      return
    }
  }

  /**
   * @param id 
   * @see as_vendor if he/she want to reject here 
   * be listed the list of rejection reason
   */
  queryRejectReasonList(): Observable<object> {
    const httpParams: HttpParams = createRequestParams();
    return this.http.get(`${this.purchaseUrl}/purchase-order/reject-reasons`, { params: httpParams, observe: 'response' })
      .map((res: HttpResponse<any>) => ResUtil.convertResponseList<RejectReason>(res, RejectReason));
  }

  /**
   * as vendor if accept the PO
   */
  queryAcceptPurchaseOrder(poId: number): Observable<object> {
    return this.http.post(`${this.acceptUrl}/${poId}/accept`, poId);
  }

  /**
   * as vendor if reject the PO
   */
  queryRejectPurchaseOrder(poId: number, rejReason: string): Observable<ResponseWrapper> {
    const httpParams: HttpParams = createRequestParams();
    let body = { reason: rejReason }
    return this.http.post(`${this.rejectUrl}/${poId}/reject`, body, { params: httpParams, observe: 'response' })
      .map((res: HttpResponse<any>) => ResUtil.convertResponse<RejectPo>(res, RejectPo));
  }

  /**
   * @param id 
   * get Deliver Order details
   */
  queryGetDODetails(id): Observable<object> {
    return this.http.get(`${this.getDODetailsUrl}/${id}/delivery-order`);
  }

  /**
   * @param id 
   * do deliver 
   */
  queryDoDeliver(data, id): Observable<object> {
    return this.http.post(`${this.doDeliversUrl}/${id}/delivery-order`, data);
  }

  queryPrintDO(poID: number): Observable<object> {
    return this.http.get(`${this.purchaseOrderUrl}/${poID}/delivery-order/download?preview=1`, { responseType: 'blob' });
  }

  querydownloadDO(poID: number): Observable<object> {
    return this.http.get(`${this.purchaseOrderUrl}/${poID}/delivery-order/download`, { responseType: 'blob' });
  }
 
  /**
   * @param id 
   * vendor retrive the PO details to invoice
   */
  queryGetInvoice(id): Observable<object> {
    return this.http.get(`${this.purchaseOrderUrl}/${id}/invoice`);
  }

  /**
   * @see As a purchasing staff, I should be able to view the issued invoice and download it.
   */
  getLatestInvoice(id: number): Observable<object> {
    return this.http.get(`${this.purchaseOrderUrl}/${id}/invoice/current`);
  }

  /**
   * as staff i would like to Download the latest invoices 
   */
  // queryDownloadLatestInvoice(poID) {
  //   // /purchase/purchase-order/{id}/invoice/current/download
  //   return this.http.get(`${this.purchaseOrderUrl}/${poID}/invoice/current/download`, { responseType: 'blob' });
  // }

  // /purchase/purchase-order/{id}/delivery-order/download
  queryVendorDownloadInvoice(poID): Observable<object> {
    return this.http.get(`${this.purchaseOrderUrl}/${poID}/delivery-order/download`, { responseType: 'blob' });
  }

    //purchase/purchase-order/{id}/delivery-order/download

    queryVendorDownloadInvoiceDelivered(poID): Observable<object> {
      return this.http.get(`${this.purchaseOrderUrl}/${poID}/invoice-delivered`, { responseType: 'blob' });
    }

  /**
   * 
   * @param poID 
   * as user i sould be able to downlaod the PO @see /purchase/purchase-order/{id}/download
   */
    queryDownloadPO(poID): Observable<object> {
      return this.http.get(`${this.purchaseOrderUrl}/${poID}/download`, { responseType: 'blob' });
    }
  

  /**
   * vendor issue invoice
   */
  queryIssueInvoice(id): Observable<object> {
    return this.http.post(`${this.purchaseOrderUrl}/${id}/invoice`, {});
    // VND_0029
  }

  /**
   * as pstaff i would like to download invoice
   */
  queryDownloadInvoice(poID): Observable<object> {
    return this.http.get(`${this.purchaseOrderUrl}/${poID}/invoice/current/download`, { responseType: 'blob' });
  }

  /**
   * as vendor i would like to Download invoice
   */
  queryDownloadDeliveredInvoice(poID, invoStatus:string): Observable<object> {
    if (invoStatus =='delivered-item') {
      return this.http.get(`${this.purchaseOrderUrl}/${poID}/invoice-delivered/download`, { responseType: 'blob' });
    }else{
      return this.http.get(`${this.purchaseOrderUrl}/${poID}/invoice/download`, { responseType: 'blob' });
    }
  }

  /**
   * @see As a vendor, I should be able to get invoice based on delivered items.
   */
   getDeliveredInvoiceItem(id:number): Observable<object>{
    return this.http.get(`${this.purchaseOrderUrl}/${id}/invoice-delivered`);
   }


  /**
   * @see As a vendor, I should be able to issue invoice based on delivered items.
   */
  issueDeliveredInvoiceItem(id:number): Observable<object>{
    return this.http.post(`${this.purchaseOrderUrl}/${id}/invoice-delivered`, {});
   }

   autoComplete(id):Observable<object>{
    return this.http.post(`${this.purchaseOrderUrl}/${id}/complete`, {});
   }

   postSavedPO(id,data): Observable<object> {
     return this.http.post(`${this.purchaseRequestUrl}/${id}/purchase-order-saved`, data);
   }

   deleteSavedPO(id): Observable<object> {
    return this.http.delete(`${this.purchaseRequestUrl}/${id}/purchase-order-saved`);
  }
  
  private showLoader(): void {
    this.spinnerService.show();
  }
  private hideLoader(): void {
    this.spinnerService.hide();
  }

} 
