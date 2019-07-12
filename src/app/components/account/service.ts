import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Company } from './set-profile';
import { environment } from '../../../environments/environment';
@Injectable()
export class AccountService {
    private envBaseUrl = environment.baseUrl;

    private uploadImgUrl = `${this.envBaseUrl}/api/cerpa-admin/user/picture`;
    private userInfoUrl = `${this.envBaseUrl}/api/cerpa-admin/user/profile`;

    private purchaseBaseUrl = `${this.envBaseUrl}/api/purchase`;
    private resourceUrl = `${this.purchaseBaseUrl}/set-password`;
    private checkActivationUrl = `${this.purchaseBaseUrl}/check-activation`;
    private registerVendorUrl = `${this.purchaseBaseUrl}/register-vendor`;
    private countryListUrl = `${this.envBaseUrl}/api/countries`;
    private statesListUrl = `${this.envBaseUrl}/api/country`;
    private vendorUrl = `${this.purchaseBaseUrl}/load-vendor`;
    private companyLogoUrl = `${this.purchaseBaseUrl}/company-logo`;
    private changePasswordUrl = `${this.envBaseUrl}/api/cerpa-admin/change-password/`;
    private bankUrl = `${this.envBaseUrl}/api/banks`;
    private checkResetPasswordUrl = `${this.envBaseUrl}/api/cerpa-admin/check-reset-password/`;
    private forgotPasswordUrl = `${this.envBaseUrl}/api/cerpa-admin/forgot-password/`;
    private resetPasswordUrl = `${this.envBaseUrl}/api/cerpa-admin/reset-password/`;

    private headers: HttpHeaders;

    fetchedTasks: any = [];
    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    }

    queryGetUserDetails(): Observable<object> {
        return this.http.get(this.userInfoUrl);
    }

    upLoadUserProfileImg(img: File): Observable<object> {
        const formData: FormData = new FormData();
        formData.append('picture', img);
        return this.http.post(this.uploadImgUrl, formData);
    }

    updateInfo(data): Observable<object> {
        return this.http.put(this.userInfoUrl, data);
    }

    queryCheckActivationUrl(code: string) {
        const params = new HttpParams().set('code', code);
        return this.http.get(this.checkActivationUrl, { params: params });
    }

    query(UserPass): Observable<object> {
        return this.http.post(this.resourceUrl, UserPass);
    }
    queryRegisterVendor(data: any, code: string): Observable<object> {
        if (code != null) {
            return this.http.post(this.registerVendorUrl + `?code=${code}`, data);
        }
    }
    queryCountries() {
        return this.http.get(this.countryListUrl);
    }
    getStates(country_id): Observable<object> {
        return this.http.get(`${this.statesListUrl}/${country_id}/states`);
    }
    queryCheckVendor(id, activationCode): Observable<object> {
        return this.http.get(`${this.vendorUrl}/${id}?code=${activationCode}`);
    }

    /**
     * upload image for vendor set profile and vendor update profile
     */
    queryUploadImage(id: number, img: File): Observable<object> {
        const formData: FormData = new FormData();
        formData.append('id', id.toString());
        formData.append('company_logo', img);
        return this.http.post(this.companyLogoUrl, formData);
    }

    /**
     * Change Password
     */
    queryChangePassword(data): Observable<object> {
        return this.http.post(this.changePasswordUrl, data);
    }

    /**
     * get Bank List
     */
    queryBankList(): Observable<object> {
        return this.http.get(this.bankUrl);
    }

    /**
     * get phone code List
     */
    queryPhoneCodeList(): Observable<object> {
        return this.http.get(this.countryListUrl);
    }

    /**
     * get fax code List
     */
    queryFaxCodeList(): Observable<object> {
        return this.http.get(this.countryListUrl);
    }

    /**
     * check reset password code
     */
    queryResetPasswordCode(code): Observable<any> {
        return this.http.get(this.checkResetPasswordUrl + `?code=${code}`);
    }

    /**
     * forgot password submit
     */
    queryForgotPassword(data): Observable<any> {
        return this.http.post(this.forgotPasswordUrl, data);
    }

    /**
     * Reset the new password
     */
    queryResetPassword(data): Observable<any> {
        return this.http.post(this.resetPasswordUrl, data);
    }
}
