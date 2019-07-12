import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
// import { ENV } from '@environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { catchError, map, tap, } from 'rxjs/operators';
import { ResponseWrapper, createRequestParams, Pager, ResUtil } from '../../../shared';
import { Vendor, VendorDetails, State } from './vendor.model';
import { VendorInvite } from './vendor-invite.model';
import { of } from 'rxjs/observable/of';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Injectable()
export class VendorService {
  private envBaseUrl = environment.baseUrl;
  private purchaseBaseUrl = `${this.envBaseUrl}/api/purchase`;
  private resourceUrl = `${this.purchaseBaseUrl}/vendor`;
  private reinviteVendorResourceUrl = `${this.purchaseBaseUrl}/vendor/reinvite`;
  private inviteVendorResourceUrl = `${this.purchaseBaseUrl}/invite-vendor`;
  private detailsResourceUrl = `${this.purchaseBaseUrl}/vendor`;
  private editResourceUrl = `${this.purchaseBaseUrl}/vendor`;
  private statesResourceUrl = `${this.purchaseBaseUrl}/states`;
  private blacklistResourceUrl = `${this.purchaseBaseUrl}/vendor/blacklist`;
  private countryListUrl = `${this.envBaseUrl}/api/countries`;
  private statesListUrl = `${this.envBaseUrl}/api/country`;
  private bankUrl = `${this.envBaseUrl}/api/banks`;
  private headers: HttpHeaders;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private http: HttpClient) {
    this.headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
  }

  /**
   * @param o
   * send invitation to new vendor
   * @see vendor-invite-dialog submit()
   */
  inviteVendor(o: VendorInvite): Observable<object> {
    return this.http.post(this.inviteVendorResourceUrl, o);
  }

  reinviteVendor(id: number): Observable<object> {
    return this.http.post(`${this.reinviteVendorResourceUrl}/${id}`, {});
  }

  blacklistVendor(id: number): Observable<object> {
    const url = `${this.blacklistResourceUrl}/${id}`;
    return this.http.post(url, {});
  }

  deleteVendor(id: number): Observable<object> {
    const url = `${this.detailsResourceUrl}/${id}`;
    return this.http.delete(url, {});
  }

  /**
   * @param status
   * @param pager
   * reqiest to display the list of vendor @see both vendor and purchase staff
   * @see vendor loadData()
   */
  query(status?: number, pager?: Pager): Observable<ResponseWrapper> {
    this.showLoader();
    const httpParams: HttpParams = createRequestParams(pager);
    let url = this.resourceUrl;
    if (status >= 0) {
      url = `${url}?status=${status}`;
    }
    return this.http.get(url, { params: httpParams, observe: 'response' })
    .map((res: HttpResponse<any>) => ResUtil.convertResponseList<Vendor>(res, Vendor))
    .finally(() => this.hideLoader());
  }

  queryNext(url: string): Observable<ResponseWrapper> {
    return this.http.get(url, { observe: 'response' })
    .map((res: HttpResponse<any>) => ResUtil.convertResponseList<Vendor>(res, Vendor));
  }

  /**
   *
   * @param keyword
   * @param status
   * @param paymentTerm
   * @param pager
   * @see Search_vendor by keyword, paymentTrem and status
   */
  search(keyword: string, status: string, paymentTerm: string , pager?: Pager): Observable<ResponseWrapper> {
    this.showLoader();
    const httpParams: HttpParams = createRequestParams(pager);
    const body = new HttpParams()
    .set('term', keyword)
    .set('status', status)
    .set('payment_term', paymentTerm);
    return this.http.post(this.resourceUrl + '/search', body.toString(), { params: httpParams, observe: 'response', headers: this.headers })
    .map((res: HttpResponse<any>) => ResUtil.convertResponseList<Vendor>(res, Vendor))
    .finally(() => this.hideLoader());
  }

  /**
   * @param id
   * view vendor details
   * @see vendor-view load()
   */
  queryDetails(id: number): Observable<ResponseWrapper> { /** used */
    const httpParams: HttpParams = createRequestParams();
    const url = `${this.detailsResourceUrl}/${id}`;
    return this.http.get(url, { params: httpParams, observe: 'response' })
    .map((res: HttpResponse<any>) => ResUtil.convertResponse<VendorDetails>(res, VendorDetails));
  }

  /**
   * to get the list of @see countries
   * @see vendor-edit getCountries()
   */
  queeyGetCounries(): Observable<object> {  /** used */
    return this.http.get(this.countryListUrl);
  }

  /**
   * @param id
   * to get the list of list of stats by passing country @see id
   * @see vendor-edit getStats(country)
   */
  queeyGetStats(id): Observable<object> { /** used */
    return this.http.get(`${this.statesListUrl}/${id}/states`);
  }

  /**
   * @param id
   * list of banks.
   */
  queryGetBankList(): Observable<object> {
    return this.http.get(`${this.bankUrl}`);
  }

  /**
   *
   * @param id
   * get the country phone code no
   */
  queryCountryPhoneCode(): Observable<object> {
    return this.http.get(`${this.countryListUrl}`);
  }

  /**
   * @param id
   * to get the vendor details
   * @see vendor-edit  load()
   */
  queryEdit(id: number): Observable<ResponseWrapper> { /** used */
    const httpParams: HttpParams = createRequestParams();
    const url = `${this.editResourceUrl}/${id}`;
    return this.http.get(url, { params: httpParams, observe: 'response' })
    .map((res: HttpResponse<any>) => ResUtil.convertResponse<VendorDetails>(res, VendorDetails));
  }

  /**
   * @param data
   * to @see update the vendor details
   * @see vendor-edit submit()
   */
  editVendor(data): Observable<object> { /** used */
    if (data != null) {
        return this.http.put(this.editResourceUrl + `/${data.id}`, data);
    }
}

  querystates(country_id: number) {
    const httpParams: HttpParams = createRequestParams();
    const url = `${this.statesResourceUrl}/${country_id}`;
    return this.http.get(url, { params: httpParams, observe: 'response' })
    .map((res: HttpResponse<any>) => ResUtil.convertResponseList<State>(res, State));
  }

  find(id: number): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.resourceUrl}/${id}`);
  }

  private showLoader(): void {
    this.spinnerService.show();
  }
  private hideLoader(): void {
    this.spinnerService.hide();
  }
}
