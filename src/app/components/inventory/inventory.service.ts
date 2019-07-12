import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Pager, createRequestParams } from '../../shared';
import { SortBatch } from './inventory.model';
import * as _ from 'lodash';
@Injectable()
export class InventoryService {
  baseUrl = environment.baseUrl;
  headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

  constructor (private http: HttpClient) { }

  get_ProductList(pager: Pager) {
    const httpParams: HttpParams = createRequestParams(pager);
    return this.http.get(`${this.baseUrl}/api/inventory/products`,
      { params: httpParams, observe: 'response', headers: this.headers });
  }

// par_reached=${prm.reached_par_level}&
// expired_stocks=${prm.expiredStock}&
// not_for_sale=${prm.notForSale}&
// current_promotion=${prm.currentPromotion}

  get_searchProductList(term, pager: Pager, prm, sort) {
    const httpParams: HttpParams = createRequestParams(pager);
    return this.http.get(`${this.baseUrl}/api/inventory/products?term=${term}&
product_category=${prm.product_category}&
product_type=${prm.product_type}`,
      { params: httpParams, observe: 'response', headers: this.headers });
  }

  get_qtyMeasures() {
    return this.http.get(`${this.baseUrl}/api/inventory/qty-measures`);
  }

  get_autocompleteBrand(term) {
    return this.http.get(`${this.baseUrl}/api/inventory/brand/autocomplete?term=${term}`);
  }
  get_autocompleteProductCategory(term) {
    return this.http.get(`${this.baseUrl}/api/inventory/product-category/autocomplete?term=${term}`);
  }

  get_autocompleteModel(id, term) {
    return this.http.get(`${this.baseUrl}/api/inventory/brand/${id}/model/autocomplete?term=${term}`);
  }

  post_addProduct(data) {
    return this.http.post(`${this.baseUrl}/api/inventory/product`, data);
  }

  post_addProductPicture(img, id, imgId) {
    return this.http.post(`${this.baseUrl}/api/inventory/product/${id}/picture/${imgId}`, img);
  }

  get_product(id) {
    return this.http.get(`${this.baseUrl}/api/inventory/product/${id}`);
  }
  put_product(id, data) {
    return this.http.put(`${this.baseUrl}/api/inventory/product/${id}`, data);
  }
  get_productPicture(id) {
    return this.http.get(`${this.baseUrl}/api/inventory/product/${id}/pictures`);
  }

  post_productPicture(id, img) {
    return this.http.get(`${this.baseUrl}/api/inventory/product/${id}`);
  }

  post_newProductBatch(data, productId) {
    return this.http.post(`${this.baseUrl}/api/inventory/product/${productId}/product-batch`, data);
  }
  put_newProductBatch(data, productId, batchId) {
    return this.http.put(`${this.baseUrl}/api/inventory/product/${productId}/product-batch/${batchId}`, data);
  }

  get_productBatch(productId, batchId) {
    return this.http.get(`${this.baseUrl}/api/inventory/product/${productId}/product-batch/${batchId}`);
  }

  get_productBatches(productId, pager: Pager, sort) {
    const httpParams: HttpParams = createRequestParams(pager);
    if (sort != null || sort !== undefined) {
      const sorts: SortBatch = Object.assign(sort, {});
      return this.http.get(`${this.baseUrl}/api/inventory/product/${productId}/product-batches?${sorts.active}=${sorts.direction}`,
        { params: httpParams, observe: 'response', headers: this.headers });
    } else {
      return this.http.get(`${this.baseUrl}/api/inventory/product/${productId}/product-batches`,
        { params: httpParams, observe: 'response', headers: this.headers });
    }
  }

  get_disposeReason() {
   return this.http.get(`${this.baseUrl}/api/inventory/product/product-batch/dispose-reasons`);
  }

  delete_dispose(id, message) {
   return this.http.put(`${this.baseUrl}/product/product-batch/dispose-reasons`, message);
  }
}

