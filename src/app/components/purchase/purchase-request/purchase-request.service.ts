import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../../environments/environment';
import { createRequestParams, Pager, ResponseWrapper, ResUtil } from '../../../shared';
import { Vendor } from '../vendor';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

Observable
@Injectable()
export class PurchaseRequestService {
  private baseurl = environment.baseUrl;
  private baseEnvurl = environment.baseUrl;
  private purchaseUrl = `${this.baseurl}/api/purchase`;
  // private inventoryUrl = `${this.baseEnvurl}/api/inventory`
  private cancelPRUrl = `${this.purchaseUrl}/purchase-request`;
  private cancelPOUrl = `${this.purchaseUrl}/purchase-order`;
  private viewPRUrl = `${this.purchaseUrl}/purchase-request`;

  /** @see purchase_OP_urls */
  private purchaseRequestListUrl = `${this.purchaseUrl}/purchase-requests`
  private issuePurchaseRequestUrl = `${this.purchaseUrl}/purchase-request`; // add purchase request url 
  private issuePRUrl = `${this.purchaseUrl}/purchase-request`
  private purchaseRequestSearchUrl = `${this.purchaseUrl}/purchase-request/search`;

  private searchSource = new BehaviorSubject('');
  currentSearch = this.searchSource.asObservable();

  headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private http: HttpClient) { }

  /**
   * @param data
   * add purchase request
   */

  queryIssuePurchesReqouste(data): Observable<object> {
    return this.http.post(this.issuePurchaseRequestUrl, data);
  }

  queryUpdateIssuePurchesReqouste(data, id: number): Observable<object> {
    return this.http.put(`${this.issuePurchaseRequestUrl}/${id}`, data);
  }

  queryPRList(status?: number, pager?: Pager): Observable<ResponseWrapper> {
    this.showLoader();
    const httpParams: HttpParams = createRequestParams(pager);
    return this.http.get(this.purchaseRequestListUrl, { params: httpParams, observe: 'response' })
      .map((res: HttpResponse<any>) => ResUtil.convertResponseList<Vendor>(res, Vendor))
      .finally(() => this.hideLoader());
  }

  queryViewPR(id, from): Observable<object> {
    if (from == 'pr') return this.http.get(`${this.viewPRUrl}/${id}`);
    if (from == 'po') return this.http.get(`${this.cancelPOUrl}/${id}/purchase-request`);
  }

  issuePR(id): Observable<object> {
    return this.http.post(`${this.issuePRUrl}/${id}`, id)
  }

  queryGetQ(prid:number): Observable<object> {
    console.log(prid);
    
      return this.http.post(`${this.purchaseUrl}/product-quotation`,[{id:prid}]);
  }

  queryReissuePR(id): Observable<object> {
    return this.http.get(`${this.issuePRUrl}/${id}`)
  }

  queryCancelPR(id): Observable<object> {
    return this.http.post(`${this.cancelPRUrl}/${id}/cancel`, id);
  }
  queryCancelPO(id): Observable<object> {
    return this.http.put(`${this.cancelPOUrl}/${id}/cancel`, id);
  }

  searchPR(data, pager?: Pager): Observable<ResponseWrapper> {
    const httpParams: HttpParams = createRequestParams(pager);
    const body = new HttpParams()
      .set('term', data.term)
      .set('status', data.status)
      .set('issued_date', data.issuedDate)
      .set('saved_po', data.saved_po);
    return this.http.post(this.purchaseRequestSearchUrl, body.toString(), { params: httpParams, observe: 'response', headers: this.headers })
      .map((res: HttpResponse<any>) => ResUtil.convertResponseList<Vendor>(res, Vendor));
  }

  getSavedPO(id): Observable<Object> {
    return this.http.get(`${this.issuePRUrl}/${id}/purchase-order-saved`);    
  }
  
  private showLoader(): void {
    this.spinnerService.show();
  }
  private hideLoader(): void {
    this.spinnerService.hide();
  }
}