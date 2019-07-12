import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { VendorService } from './vendor.service';
import { VendorDetails, Country, State } from './vendor.model';
import { ResponseWrapper } from '../../../shared/models';
import { MatDialog } from '@angular/material';
import { UploadVendorImageComponent } from './upload-image-dialog';
import { Location } from '@angular/common';
import { AppConstant } from '../../../shared';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as _ from 'lodash';
@Component({
  selector: 'app-vendor-edit',
  templateUrl: './vendor-edit.component.html',
  styleUrls: ['./vendor-edit.component.css']
})

export class VendorEditComponent implements OnInit {
 
  hasError = false;
  success_message = false;
  spinner = true;
  no = 0;
  selectedCountry_id: number;
  selectedState_id: number = 0;
  bankList: any = [];
  phoneCodeList: any = [];
  faxCodeList: any = [];

  vendor: VendorDetails;
  countries: Country[];
  states: State[];
  company_id = null;
  contact_person_email = '';
  company_logo = 'assets/images/default-m-icon/default-m-icon.png';
  mform: FormGroup;
  loadData: any;

  bank_id: number;
  fax_code: number;
  phone_code: number;
  /**
   * @see note update the translate and keep its enum ...
   */
  paymentTerms = [
    { key: 0, value: 'cash on delivery' },
    { key: 7, value: '7 days' },
    { key: 15, value: '15 days' },
    { key: 30, value: '30 days' },
    { key: 60, value: '60 days' },
    { key: 90, value: '90 days' }
  ]


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private vendorService: VendorService,
    private translateService: TranslateService,
    private location: Location,
    private fb: FormBuilder) {
    this.vendor = new VendorDetails();
  }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.company_id = this.route.snapshot.paramMap.get('id');
    this.load();
    this.getCountries();
    this.createForm();
    // this.mform.value.business_reg_no.toUpperCase();
  }
  /**
   * @see 006-01123323432
   */

  getBankList(bank_id?: number) {
    this.vendorService.queryGetBankList().subscribe(
      (res: any) => {
        this.bank_id = bank_id;
        this.bankList = res;
        this.mform.patchValue({ bank: bank_id })
      }, (err) => {
        console.log(err);
      })
  }

  /**
   * get country phone code no
   */

  getPhoneCode(iso_code_id) {
    this.vendorService.queryCountryPhoneCode().subscribe(
      (res: any) => {
        this.phone_code = iso_code_id;
        this.phoneCodeList = res;
        this.mform.patchValue({ office_phone_code: iso_code_id })
      }, (err) => {
        console.log(err);
      })
  }

  getFaxCode(iso_code_id) {
    this.vendorService.queryCountryPhoneCode().subscribe(
      (res: any) => {
        this.fax_code = iso_code_id;
        this.faxCodeList = res;
        this.mform.patchValue({ office_fax_code: iso_code_id })
      }, (err) => {
        console.log(err);
      })
  }

  /**
   * create form for eidt @see vendor_profile and @see contact_persons
   */
  createForm() {
    this.mform = this.fb.group({
      id: [''],
      company_name: ['', [Validators.required, Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.COMPANY_NAME)]],
      company_logo: null,
      biz_reg_num: ['', [Validators.required, Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.BUSINESS_REGI_NO)]],
      gst_number: ['', [Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.TAX_NO)]],
      credit_limit: [0, Validators.required],
      payment_term: [0, Validators.required],
      bank: [null],
      bank_acct_num: ['', [Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.ACCOUNT_NO)]],
      office_phone_code: [null],
      office_phone: ['', [Validators.required, Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.OFFICE_NO)]],
      office_fax_code: [null],
      office_fax: ['', [Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.OFFICE_NO)]],
      address: this.fb.group({
        id: [''],
        addr_line_1: ['', [Validators.required, Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.ADDRESS_LINE1)]],
        addr_line_2: ['', Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.ADDRESS_LINE2)],
        addr_line_3: ['', Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.ADDRESS_LINE3)],
        postcode: ['', [Validators.required, Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.POST_CODE)]],
        city: ['', [Validators.required, Validators.maxLength(100)]],
        country: [this.selectedCountry_id, Validators.required],
        state: [this.selectedState_id, [Validators.required, Validators.min(1)]]
      }),
      contact_persons: this.fb.array(
        [
          this.initContactsPerson()
        ]
      )
    });
  }
  initContactsPerson() {
    return this.fb.group(
      {
        id: [''],
        name: ['', [Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.CONTACT_PERSON)]],
        email: ['', [Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.EMAIL)]],
        phone_code: [null],
        phone: ['', [Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.PHONE_NO)]],
        alt_email: ['', [Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.EMAIL)]]
      }
    )
  }

  /**
   * @see load the user by thier id to eidt
   */
  load() {
    this.spinnerService.show();
    if (this.company_id === null) {
      return
    }
    this.vendorService.queryEdit(this.company_id).subscribe( /** checked */
      (res: ResponseWrapper) => this.onSuccess(res),
      (res: ResponseWrapper) => this.onError(res)
    );
  }

  /**
   * to get the @see country list
   */
  getCountries() {
    this.vendorService.queeyGetCounries().subscribe( /** checked */
      (res: any) => {
        this.countries = res;
        return this.getStats(res[0].id)
      },
      (err) => {
        console.log(err);
      }
    )
  }

  /**
   * @param country_id 
   * to get the @see state best on the country
   */
  getStats(country_id: number) {
    this.vendorService.queeyGetStats(country_id).subscribe( /** checked */
      (res: any) => {
        if (res.length != 0) {
          this.mform.patchValue({ address: { country: country_id, state: this.selectedState_id } })
          return this.states = res
        } else {
          this.mform.patchValue({ address: { state: 0 } })
          return this.states = []
        }
      },
      (err) => {
        console.log(err);
      }
    )
  }

  /**
   * @param state_id 
   * @see Update state id in the form 
   */
  setState(state_id: number) {
    this.mform.patchValue(
      {
        state: state_id
      }
    )
  }

  /**
   * create  @see Dynoimic_FormArray using @see FormArray for contact person
   */
  get contact_persons(): FormArray {
    return this.mform.get('contact_persons') as FormArray;
  }

  /**
   * submit vendor details to @see service
   */
  submit() {
    var body = {
      address: {
        addr_line_1: this.mform.value.address.addr_line_1,
        addr_line_2: this.mform.value.address.addr_line_2,
        addr_line_3: this.mform.value.address.addr_line_3,
        city: this.mform.value.address.city,
        country: this.mform.value.address.country,
        id: this.mform.value.address.id,
        postcode: this.mform.value.address.postcode,
        state: this.mform.value.address.state,
      },
      bank: this.mform.value.bank,
      bank_acct_num: this.mform.value.bank_acct_num,
      biz_reg_num: this.mform.value.biz_reg_num,
      company_logo: this.mform.value.company_logo,
      company_name: this.mform.value.company_name,
      contact_persons: [
        {
          alt_email: this.mform.value.contact_persons[0].alt_email,
          email: this.mform.value.contact_persons[0].email,
          id: this.mform.value.contact_persons[0].id,
          name: this.mform.value.contact_persons[0].name,
          phone_code: this.mform.value.contact_persons[0].phone_code,
          phone: this.mform.value.contact_persons[0].phone,
        }
      ],
      credit_limit: this.mform.value.credit_limit,
      gst_number: this.mform.value.gst_number,
      id: this.mform.value.id,
      office_fax: this.mform.value.office_fax,
      office_fax_code: this.mform.value.office_fax_code,
      office_phone: this.mform.value.office_phone,
      office_phone_code: this.mform.value.office_phone_code,
      payment_term: this.mform.value.payment_term,
    }

    this.spinnerService.show();
    this.vendorService.editVendor(body).subscribe( /** checked */
      (res) => {
        this.onSuccessSubmit(res)
        this.success_message = true;
      },
      (err) => {
        this.onError(err)
      }
    )
  }

  /**
   * @param v 
   * create @see switch_button to set the payment term value
   */

  set selectedPaymentTerm(i: number) {
    this.no = i;
    this.mform.patchValue(
      {
        payment_term: i
      }
    )
  }

  /**
   * @see get the payment and update with form
   */
  get selectedPaymentTerm(): number {
    return this.no
  }

  /**
   * @param id
   * @see set country_id in the for to update
   */
  set selectedCountry(id: number) {
    this.mform.patchValue(
      {
        address: {
          country: id
        }
      }
    )
  }

  /**
   * @param id
   * @see set state_id in the for to update
   */
  set selectedState(id: number) {
    this.mform.patchValue(
      {
        address: {
          state: id
        }
      }
    )
  }

  /**
   * get the country id to from UI and update to the form
   */
  get selectedCountry(): number {
    return this.selectedCountry_id
  }

  /**
  * get the state id to from UI and update to the form
  */
  get selectedState(): number {
    return this.selectedState_id
  }

  /**
   * @param data 
   * patch data from server and patch it back to 
   * the form for edit using @see patchValue method
   */
  putchFormValues(data) {
    // this.contact_person_email = data.contact_persons[0].email;
    if (data.company_logo != null) {
      this.company_logo = data.company_logo
    }
    this.no = data.payment_term
    this.selectedCountry_id = data.address.country.id;
    this.selectedState_id = data.address.state.id;

    this.mform.patchValue(
      {
        id: data.id,
        company_name: data.company_name,
        company_logo: this.mform.value.company_logo,
        biz_reg_num: data.biz_reg_num,
        gst_number: data.gst_number,
        credit_limit: data.credit_limit,
        payment_term: data.payment_term,
        bank: data.bank_id,
        bank_acct_num: data.account_num,
        office_phone: data.office_phone,
        office_phone_code: data.iso_code_id,
        office_fax: data.office_fax,
        office_fax_code: data.office_fax_code,
        address: {
          id: data.address.id,
          addr_line_1: data.address.addr_line_1,
          addr_line_2: data.address.addr_line_2,
          addr_line_3: data.address.addr_line_3,
          postcode: data.address.postcode,
          city: data.address.city,
          country: this.selectedCountry_id,
          state: this.selectedState_id
        },
      }
    )
    let add_contact_persons: FormArray = <FormArray>this.mform.get('contact_persons');
    // let counter = 0;
    // data.contact_persons.forEach(_add_contact => {
    //   if (counter == 0) {
    //     add_contact_persons.at(0).patchValue(_add_contact);
    //   } else {
    //     add_contact_persons.push(this.fb.group(_add_contact));
    //   }
    //   counter++;
    // });

    var contactP = _.find(data.contact_persons, function (o) {
      var currentUserEmail = localStorage.getItem('currentUserEmail');
      return o.email == currentUserEmail;
    });
    // console.log('cP ',contactP);
    this.contact_person_email = contactP.email;
    add_contact_persons.at(0).patchValue(contactP);
  }

  /**
   * open @see dialog to upload the company logo
   */
  openUploadDialog() {
    var id = {
      id: this.mform.value.id
    }
    const dialogRef = this.dialog.open(UploadVendorImageComponent, {
      width: '500px',
      height: '500px',
      data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      this.load();
    });
  }

  /**
   * @param values 
   * all loaded success response
   */
  onSuccess(values) {
    this.spinnerService.hide();
    this.spinner = false;
    this.loadData = values.data;
    this.getBankList(values.data.bank.id);
    this.getPhoneCode(values.data.office_phone_code);
    this.getFaxCode(values.data.office_fax_code);
    return this.putchFormValues(values.data);

  }

  /**
   * @param res 
   * success submit response
   */
  onSuccessSubmit(res) {
    this.spinnerService.hide();
    return setTimeout(() => {
      this.success_message = false;
      this.location.back();
    }, 1000);
  }

  /**
   * @param error 
   * catch all error response
   */
  onError(error) {
    this.hasError = true;
    this.spinner = false;
    this.spinnerService.hide();
    // this.location.back();
  }

  /**
   * back button to prevouse page
   */
  back() {
    this.location.back();
  }
}
