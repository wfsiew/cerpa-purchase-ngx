import { map, finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ResponseWrapper, ResUtil, Pager, createRequestParams, OptionalSortingTerms, SortOptions, CategorySort, TermSort } from '../../../shared';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Product, ProductPricingData, PromotionHistoryList, TierPricingHistoryList } from './product-pricing.model';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { LookUpData } from './vendor/look-up/look-up.model';
import { environment } from '../../../../environments/environment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class ProductPricingService {
  private baseurl = environment.baseUrl;
  private baseEnvurl = environment.baseUrl;
  private purchaseUrl = `${this.baseurl}/api/purchase`;
  private inventoryUrl = `${this.baseEnvurl}/api/inventory`

  /** @see inventory_urls */
  private lookUpProductPricingUrl = `${this.inventoryUrl}` + '/material/lookup';   //Look Up 
  private lookUpSearchUrl = this.inventoryUrl + '/material/autocomplete';  //Look Up;
  private autoComplateCategoryUrl = this.purchaseUrl + '/material/category/autocomplete'

  /** @see purchase_urls */
  private currentUserUrl = `${this.purchaseUrl}/api/admin/current-user`;     // currentUser Url
  private productPricingListUrl = this.purchaseUrl + '/product-pricings';
  private productPricingUrl = this.purchaseUrl + '/product-pricing';         //list, search, sort, catergory
  private addProductPricingUrl = this.purchaseUrl + '/product-pricing';       //add
  private retrieveProductToEdit = this.purchaseUrl + '/product-pricing';
  private editProductPricingUrl = this.purchaseUrl + '/product-pricing';      //edit
  private deleteProductPricingUrl = this.purchaseUrl + '/product-pricing';    //delete
  private creditTermUrl = this.purchaseUrl + '/product-pricing/term-options'; // get the list of sort term 
  private sortOptionUrl = this.purchaseUrl + '/product-pricing/sort-options'; // get the list sort options 
  private productHistoryUrl = `${this.purchaseUrl}/product-pricing/history`;
  private productSearchUrl = `${this.purchaseUrl}/product-pricing/search`; // Product search

  private searchSource = new BehaviorSubject('');
  currentSearch = this.searchSource.asObservable();

  headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  isPromoItems: any;
  hasTierPrice: any;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private http: HttpClient) { }

  /**
   * @param search to share the params between elements vis service
   */
  changeSearch(search: string) {
    this.searchSource.next(search);
  }

  /**
   * @see check is the CERPA in search mood
   */
  isSearching(): boolean {
    return true
  }

  /**
   * @see check current user before the do any request
   */
  queryCurrentUser() {
    return this.http.get(this.currentUserUrl);
  }

  queryGetAutoCategoryList(term: string): Observable<object> {
    if (term != null) {
      return this.http.get(`${this.autoComplateCategoryUrl}?term=${term}`);
    }
    return this.http.get(`${this.autoComplateCategoryUrl}?term=`);
  }

  queryGetSortingList(): Observable<object> {
    this.showLoader();
    return this.http.get(`${this.sortOptionUrl}`)
      .pipe( finalize(() => this.hideLoader()));
  }
  queryGetTermList(): Observable<object> {
    return this.http.get(`${this.creditTermUrl}`);
  }

  /**
   * @param term 
   * make a request for auto-complete the list drop down in the look-up search  
   */
  queryLookAutoList(term: string): Observable<object> {
    return this.http.get(`${this.lookUpSearchUrl}?term=${term}`);
  }

  /**
   * @param pager 
   * @param term 
   * @see display the list of searched result in loop-up listing 
   */
  queryLookUpList(pager?: Pager, term?): Observable<ResponseWrapper> {
    this.showLoader();
    const httpParams: HttpParams = createRequestParams(pager);
    httpParams.append('status', status.toString())
    return this.http.get(`${this.lookUpProductPricingUrl}?term=${term}`, { params: httpParams, observe: 'response', headers: this.headers }).pipe(
      map((res: HttpResponse<any>) => ResUtil.convertResponseList<LookUpData>(res, LookUpData)))
      .pipe( finalize(() => this.hideLoader()));
  }

  /**
   * @param id ....
   */
  queryViewProducts(id): Observable<ResponseWrapper> { //
    const httpParams: HttpParams = createRequestParams();
    return this.http.get(this.editProductPricingUrl + `/${id}`, { params: httpParams, observe: 'response', headers: this.headers }).pipe(
      map((res: HttpResponse<any>) => ResUtil.convertResponse<Product>(res, Product)));
  }

  /**
   * @see product pricing history
   */
  queryListHistory(pager: Pager, id): Observable<object> {
    const httpParams: HttpParams = createRequestParams(pager);
    if (/^\d+$/.test(id)) {
      console.log('valid');
    } else {
      console.log('invalid');
    }
    return this.http.get(this.productHistoryUrl + `/${id}`, { params: httpParams, observe: 'response', headers: this.headers }).pipe(
      map((res: HttpResponse<any>) => ResUtil.convertResponseList<Product>(res, Product)));
  }

  queryTierPricingHistory(pager: Pager, id): Observable<object> {
    const httpParams: HttpParams = createRequestParams(pager);
    return this.http.get(`${this.productHistoryUrl}/${id}/tier-history`, { params: httpParams, observe: 'response', headers: this.headers }).pipe(
      map((res: HttpResponse<any>) => ResUtil.convertResponseList<TierPricingHistoryList>(res, TierPricingHistoryList)));
  }
  queryPromotionHistory(pager: Pager, id): Observable<object> {
    const httpParams: HttpParams = createRequestParams(pager);
    return this.http.get(`${this.productHistoryUrl}/${id}/promotion-history`, { params: httpParams, observe: 'response', headers: this.headers }).pipe(
      map((res: HttpResponse<any>) => ResUtil.convertResponseList<PromotionHistoryList>(res, PromotionHistoryList)));
  }
  /**
   * @param status 
   * @param pager 
   * display the list of products in product pricing list
   */
  queryListing(status?: number, optionalSort?, pager?: Pager): Observable<ResponseWrapper> {
    const httpParams: HttpParams = createRequestParams(pager);
    httpParams.append('status', status.toString());
    if (optionalSort.term == '') {
      return this.http.get(`${this.productPricingListUrl}?categories=${optionalSort.category}`, { params: httpParams, observe: 'response' }).pipe(
        map((res: HttpResponse<any>) => ResUtil.convertResponseList<ProductPricingData>(res, ProductPricingData)));
    } else {
      return this.http.get(`${this.productPricingListUrl}?categories=${optionalSort.category}&term=${optionalSort.term}`, { params: httpParams, observe: 'response' }).pipe(
        map((res: HttpResponse<any>) => ResUtil.convertResponseList<ProductPricingData>(res, ProductPricingData)));
    }
  }

  querySearch(keyword: string, pager?: Pager): Observable<ResponseWrapper> {
    const httpParams: HttpParams = createRequestParams(pager);
    const body = new HttpParams()
      .set('keyword', keyword)
    return this.http.post(this.productPricingUrl, body.toString(), { params: httpParams, observe: 'response', headers: this.headers }).pipe(
      map((res: HttpResponse<any>) => ResUtil.convertResponseList<ProductPricingData>(res, ProductPricingData)));
  }

  /**
   * @see POST_Resquest for Add new product pricing listing
   */
  queryAdd(data?: Product): Observable<ResponseWrapper> {
    const httpParams = new HttpParams();
    return this.http.post(`${this.addProductPricingUrl}`, data, { params: httpParams, observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => ResUtil.convertResponse<Product>(res, Product)))
  }

  /**
   * @see Get_Request to edit the product 
   * @param id for get request
   */
  queryEiditData(id: number): Observable<ResponseWrapper> {
    const httpParams = new HttpParams();
    return this.http.get(`${this.retrieveProductToEdit}/${id}`, { params: httpParams, observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => ResUtil.convertResponse<Product>(res, Product)))
  }

  /**
   * @see PUT_Request for update the product
   * @param id to update the product
   */
  queryUpdateData(id, data: Product): Observable<ResponseWrapper> {
    const httpParams = new HttpParams();
    return this.http.put(`${this.editProductPricingUrl}/${id}`, data, { params: httpParams, observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => ResUtil.convertResponse<Product>(res, Product)));
  }

  queryDeleteProduct(id?: number): Observable<ResponseWrapper> {
    const httpParams = new HttpParams();
    return this.http.delete(this.deleteProductPricingUrl + `/${id}`, { params: httpParams, observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => ResUtil.convertResponse<Product>(res, Product)));
  }

  /**
   * @see Sort the product pricing list listing 
   * @param v name
   */
  querySortBy(cust_sort_by: string, status: number, pager?: Pager): Observable<any> {
    const httpParams: HttpParams = createRequestParams(pager);
    const body = new HttpParams()
      .set('cust_sort_by', cust_sort_by)
      .set('status', status.toString());
    return this.http.post(this.productPricingUrl, body.toString(), { params: httpParams, observe: 'response', headers: this.headers }).pipe(
      map((res: HttpResponse<any>) => ResUtil.convertResponseList<ProductPricingData>(res, ProductPricingData)));
  }

  /**
   * @see Category to categorize the product pricing list list
   * @param v name 
   */
  queryCategoryBy(category_by: string, status: number, pager?: Pager): Observable<any> {
    const httpParams: HttpParams = createRequestParams(pager);
    const body = new HttpParams()
      .set('category_by', category_by)
      .set('status', status.toString());
    return this.http.post(this.productPricingUrl, body.toString(), { params: httpParams, observe: 'response', headers: this.headers }).pipe(
      map((res: HttpResponse<any>) => ResUtil.convertResponseList<ProductPricingData>(res, ProductPricingData)));
  }

  search(keyword: string, filter?, sort?, pager?: Pager): Observable<ResponseWrapper> {
    const httpParams: HttpParams = createRequestParams(pager);
    const body = new HttpParams()  
    .set('term', keyword)
    .set('current_promo', filter.isPromoItems)
    .set('tier', filter.hasTierPrice);
    return this.http.post(this.productSearchUrl + `?categories=${filter.category}&term=${filter.paymentTerms}`, body.toString(), { params: httpParams, observe: 'response', headers: this.headers }).pipe(
    map((res: HttpResponse<any>) => ResUtil.convertResponseList<Product>(res, Product)));
  }

  private showLoader(): void {
    this.spinnerService.show();
  }
  private hideLoader(): void {
    this.spinnerService.hide();
  }
}