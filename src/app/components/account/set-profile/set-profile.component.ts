import { Component, OnInit } from '@angular/core';
import { Company, Country } from './set-profile.model';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material';
import { UploadImageComponent } from './upload-image';
import { AccountService } from '../service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AccountLocalConstant } from '../account-locale.constant';
import { AppConstant } from '../../../shared';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as _ from 'lodash';

@Component({
  selector: 'app-set-profile',
  templateUrl: './set-profile.component.html',
  styleUrls: ['./set-profile.component.css']
})

export class SetProfileComponent implements OnInit {

  success_message = false;
  hasError = false;
  errorMessage: string;
  message: string;
  Company = new Company();
  formgroup: FormGroup;
  countries = [];
  states = [];
  phone_codes = [];
  fax_codes = [];
  contact_p_phone_codes = [];
  banks = [];
  bank_format:any = /^[1-9]{6}$/;
  default_phone_code = null;
  default_fax_code = null;
  default_phone_conde = null;
  no = 0;
  activation_code = null;
  company_logo = 'assets/images/default-m-icon/default-m-icon.png';
  selectedCountry_id: number;
  selectedState_id: number;
  bank_id: number;
  contactPersons: FormArray;
  userId:any;

  selectionList = [
    { key: 0, value: 'cash on delivery' },
    { key: 7, value: '7 days' },
    { key: 15, value: '15 days' },
    { key: 30, value: '30 days' },
    { key: 60, value: '60 days' },
    { key: 90, value: '90 days' }
  ]
  constructor(
    private router: Router,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.getBankList(null);
    this.createForm();
    this.checkStapes();
    this.getCountries();
  }

  /**
   * check for the link activation and stepin which step the was the last set-up profile
   */
  checkStapes() {
    this.spinnerService.show();
    this.route.queryParams.subscribe(
      (res) => {
        this.setAcivationCode(res.code);
        this.activation_code = res.code;
        this.spinnerService.hide();
      },
      (err) => {
        this.router.navigate(['/login'])
      }
    )
  }

  /**
   * @param code 
   * if the link is active and the vendor already has set password
   * now vendor can request for vendor details to prossed with update vendor profile
   */
  setAcivationCode(code) {
    this.spinnerService.show();
    this.accountService.queryCheckActivationUrl(code).subscribe(
      (res: any) => {
        this.spinnerService.hide();
        if (res != null || res != undefined) {
          if (res.step === null) {
            this.router.navigate(['/activate'], { queryParams: { code: code } })
          } else if (res.step === 1) {
            this.router.navigate(['/login'])
          }
          else {
            this.spinnerService.show();
            this.accountService.queryCheckVendor(res.id, this.activation_code).subscribe(
              (resp: any) => {
                if (resp) {
                  this.spinnerService.hide();
                  this.userId = res
                  return this.setReloadedVerdorData(resp);
                }
              }, (error) => {
                return this.router.navigate(['/login'])
              }
            )
          }
        } else {
          return this.router.navigate(['/login'])
        }
      },
      (err) => {
        return this.router.navigate(['/login'])
      }
    )
  }

  /** 
   * @param data 
   * to display vendor details to edit
   * and update
   */
  setReloadedVerdorData(data) {
    // var contact_p = data.contactPersons[0];
    if (data != null) {
      if (data.company_logo != null) {
        this.company_logo = data.company_logo
      }
      this.getPhoneCodeList(data.office_phone_code);
      this.getFaxCodeList(data.office_fax_code);

      this.formgroup.patchValue(
        {
          id: data.id,
          biz_reg_num: data.biz_reg_num,
          gst_number: data.gst_number,
          credit_limit: data.credit_limit,
          payment_term: data.payment_term,
          bank_acct_num: data.account_num,
          // con_id: contact_p.id,
          office_phone: data.office_phone,
          office_fax: data.office_fax,
          addr_line_1: data.address.addr_line_1,
          addr_line_2: data.address.addr_line_2,
          addr_line_3: data.address.addr_line_3,
          postcode: data.address.postcode,
          city: data.address.city,
          company_logo: data.company_logo,
          company_name: data.company_name
          // name: contact_p.name,
          // email: contact_p.email,
        }
      );

      this.selectedOption = data.payment_term;

      if (data.bank) {
        this.getBankList(data.bank.id);
      }

      this.contactPersons = this.formgroup.get('contactPersons') as FormArray;

      if (data.contact_persons) {
        data.contact_persons.forEach(contactPerson => {
          this.contactPersons.push(this.createContactPerson(contactPerson));
        });
      }

      if (data.address.country) {
        this.selectedCountry_id = data.address.country.id;
        this.formgroup.patchValue({
          country: this.selectedCountry_id
        });

        this.accountService.getStates(this.selectedCountry_id).subscribe(
          (res: any) => {
            this.states = res;

            if (data.address.state) {
              this.selectedState_id = data.address.state.id;

              this.formgroup.patchValue({
                state: data.address.state.id
              });
            }
          },
          (err) => {
            this.onError(err);
          }
        );
      }
    }
  }

  get selectedCountry(): number {
    return this.selectedCountry_id;
  }

  set selectedCountry(id: number) {
    this.formgroup.patchValue(
      {
        address: {
          country: id
        }
      }
    )
  }

  get selectedState(): number {
    return this.selectedState_id;
  }

  set selectedState(id: number) {
    this.formgroup.patchValue(
      {
        address: {
          state: id
        }
      }
    )
  }

  /**
   * set peyment term
   */

  set selectedOption(i: number) {
    this.no = i;
    this.formgroup.patchValue(
      {
        payment_term: i
      }
    )
  }

  get selectedOption(): number {
    return this.no
  }

  /**
   * create form for vendor set-up profile
   */
  createForm() {
    this.formgroup = this.fb.group(
      {
        id: ['', Validators.required],
        company_logo: [''],
        company_name: ['', [Validators.maxLength(100), Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.COMPANY_NAME)]],
        biz_reg_num: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.BUSINESS_REGI_NO)]],
        gst_number: ['', [Validators.required, Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.TAX_NO)]],
        credit_limit: [0, [Validators.required, Validators.min(0)]],
        payment_term: [0, [Validators.required, Validators.min(0)]],
        bank: [null],
        bank_acct_num: [null,[Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.ACCOUNT_NO)]],
        office_phone: ['', [Validators.required, Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.PHONE_NO)]],
        office_phone_code: [null],
        office_fax: ['', [Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.PHONE_NO)]],
        office_fax_code: [null],
        // address
        addr_line_1: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.ADDRESS_LINE1)]],
        addr_line_2: ['', [Validators.maxLength(100)]],
        addr_line_3: ['', [Validators.maxLength(10)]],
        postcode: ['', [Validators.required, Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.POST_CODE)]],
        city: ['', [Validators.required, Validators.maxLength(100)]],
        country: ['', Validators.required],
        state: ['', Validators.required],
        // contact person
        contactPersons: this.fb.array([])
      }
    )
  }

  createContactPerson(contactPerson?: any): FormGroup {
    if (contactPerson) {
      return this.fb.group({
        con_id: [contactPerson.id, Validators.required],
        name: [contactPerson.name, [Validators.maxLength(255), Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.CONTACT_PERSON)]],
        email: [contactPerson.email, [Validators.maxLength(255), Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.EMAIL)]],
        phone: [contactPerson.phone, [Validators.maxLength(15), Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.PHONE_NO)]],
        alt_email: [contactPerson.alt_email, [Validators.maxLength(255), Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.EMAIL)]],
      });
    } else {
      return this.fb.group({
        con_id: ['', Validators.required],
        name: ['', [Validators.maxLength(255), Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.CONTACT_PERSON)]],
        email: ['', [Validators.maxLength(255), Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.EMAIL)]],
        phone: ['', [Validators.maxLength(15), Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.PHONE_NO)]],
        alt_email: ['', [Validators.maxLength(255), Validators.pattern(AppConstant.CUSTOM_VALIDATIONS.EMAIL)]],
      });
    }
  }

  /**
   * open the dialog to upload company logo
   */
  openDialog(): void {
    if (this.formgroup.value.id) {
      const dialogRef = this.dialog.open(UploadImageComponent, {
        width: '400px',
        height: '400px',
        data: { id: this.formgroup.value.id }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result === true) {
          console.log('success');
          return this.loadUserImage();
        } else {
          console.log('error 1');
        }
      }, (err) => {
        console.log('error 2', err);
      });
    }
  }

  loadUserImage(){
    this.accountService.queryCheckVendor(this.userId.id, this.activation_code).subscribe((res:any)=>{
      if (res.company_logo !=null) {
        this.company_logo = res.company_logo;
      }
    },
    (err)=>{this.onError(err)})
  }

  /**
   * request for list of countries
   */
  getCountries() {
    this.accountService.queryCountries().subscribe(
      (res: any) => {
        if (res) {
          this.countries = res;
        }
      },
      (err) => {
        console.log(err)
      }
    )
  }

  /**
   * get bank list
   */

   getBankList(bank_id) {
      this.accountService.queryBankList().subscribe(
        (res: any = []) => {
          this.banks = res;
          if (bank_id != null) {
            // console.log(bank_id);
            this.bank_id = bank_id;

            this.formgroup.patchValue({
              bank: bank_id
            });
            // this.bank_format = data.acct_number_format;
            // console.log('done: ' + this.formgroup.value);
          }
        }, (err) => {
          this.onError(err);
        });
   }

  /**
   * get country code list for phone no
   */

   getPhoneCodeList(data){
    this.accountService.queryPhoneCodeList().subscribe(
      (res:any=[])=>{
        this.phone_codes = res;
        this.formgroup.patchValue({ office_phone_code: data })
        this.default_phone_code = res[0].iso_code;
      },(err)=>{
        this.onError(err);
      })
   }

  /**
   * get country code list for fax no 
   */

   getFaxCodeList(data){
    this.accountService.queryFaxCodeList().subscribe(
      (res:any=[])=>{
        this.fax_codes = res;
        this.formgroup.patchValue({office_fax_code: data })
        this.default_fax_code = res[0].iso_code;
      },(err)=>{
        this.onError(err);
      })
   }

   /**
    * get country code for contact person 
    */
   getContactPhoneCodeList(){
    // this.accountService.queryPhoneCodeList().subscribe(
    //   (res:any=[])=>{
    //     this.contact_p_phone_codes = res;
    //     this.formgroup.patchValue({ phone_code: res[0].iso_code })
    //     this.default_phone_code = res[0].iso_code;
    //   },(err)=>{
    //     this.onError(err);
    //   })
   }

  /**
   * @param country_id 
   * get the list of states best on selected country 
   */
  getStates(country_id) {
    this.accountService.getStates(country_id).subscribe(
      (res: any) => {
        this.formgroup.patchValue({
          country: country_id
        })
        this.states = res;
      },
      (err) => {
        this.onError(err);
      }
    ) 
  }

  /**
   * @param state_id 
   * updating the state in the form 
   */
  setStates(state_id) {
    this.formgroup.patchValue(
      {
        state: state_id
      }
    )
  }

  /**
   * submit the form to sever
   */
  AddVendorProfile() {
    // this.spinnerService.show();
    const company: Company = Object.assign({},
      {
        id: this.formgroup.value.id,
        company_name: this.formgroup.value.company_name,
        biz_reg_num: this.formgroup.value.biz_reg_num,
        gst_number: this.formgroup.value.gst_number,
        credit_limit: this.formgroup.value.credit_limit,
        payment_term: this.formgroup.value.payment_term,
        bank: this.formgroup.value.bank,
        bank_acct_num: this.formgroup.value.bank_acct_num,
        office_phone: this.formgroup.value.office_phone,
        office_phone_code: this.formgroup.value.office_phone_code,
        office_fax: this.formgroup.value.office_fax,
        office_fax_code: this.formgroup.value.office_fax_code,
        address: {
          id: this.formgroup.value.con_id,
          addr_line_1: this.formgroup.value.addr_line_1,
          addr_line_2: this.formgroup.value.addr_line_2,
          addr_line_3: this.formgroup.value.addr_line_3,
          postcode: this.formgroup.value.postcode,
          city: this.formgroup.value.city,
          country: this.formgroup.value.country,
          state: this.formgroup.value.state
        // },
        // contactPersons: [
        //   {
        //     id: this.formgroup.value.con_id,
        //     name: this.formgroup.value.name,
        //     email: this.formgroup.value.email,
        //     phone: this.formgroup.value.phone,
        //     phone_code: this.formgroup.value.phone_code,
        //     alt_email: this.formgroup.value.alt_email
          },
          contact_persons: []
        // ]
      });

      for (let contactPerson of this.contactPersons.controls) {
        company.contact_persons.push({
          id: contactPerson.value.con_id,
          email: contactPerson.value.email,
          alt_email: contactPerson.value.alt_email,
          phone: contactPerson.value.phone,
          name: contactPerson.value.name
        });
     }

     console.log('company: ' + JSON.stringify(company));
    if (this.activation_code != null && this.activation_code != undefined) {

      this.accountService.queryRegisterVendor(company, this.activation_code).subscribe((res) => {
        if (res) {
          this.success_message = true;
          setTimeout(() => {
            this.spinnerService.hide();
            this.router.navigate(['/login']);
          }, 1000);
        }
      }, (err) => {
        this.hasError = true;
        console.log(err);
        this.translateResponseMessage(err);
      });
    }
  }

onError(error){
  this.translateResponseMessage(error);
}
  translateResponseMessage(err): void {
    this.translateService.get([
      AccountLocalConstant.GEN_0006,
    ]).subscribe(
      (error_message) => {
        if (err.error.error === 'GEN_0006') {
          // link expired
          console.log('link has expired', error_message);
          return this.router.navigate(['/login']);
        }
        else {
          console.log(err.error.error);
          return this.router.navigate(['/login'])
        }
      }
    )
  }
  /**
   * @param message 
   * @see display the response message for user
   */
  showResponseMessage(message: string): string {
    this.hasError = true;
    return this.message = message
  }

  get profileContactPersons() {
    return this.formgroup.get('contactPersons') as FormArray;
  }
}
