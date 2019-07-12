import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, AbstractControl, Validator, ValidationErrors, FormControl } from '@angular/forms';
import { ProductPricingService } from '../../product-pricing.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../../account/services/auth.service';
import { MatDialog } from '@angular/material';
import { LookUpComponent } from '../look-up/look-up-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CurrentUser, Promotion, Pricing, ProductPricingData } from '../../product-pricing.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AppConstant, AppLocaleConstant } from '../../../../../shared';
import { ProductPricingConstant } from '../../product-pricing.constant';
import { SubmitModel } from './add.model';
import { ProductPricingHistoryComponent } from '../../product-pricing.history.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  minDate = new Date();
  isTouched: boolean = false;
  productPricingData = new ProductPricingData();
  user_role: boolean = false;
  spinner: boolean = false;
  isvendor: boolean;
  product: any;
  isEdit: boolean = true;
  errorMessage: string;
  material_picture = AppLocaleConstant.MATERIAL_DEFAULT_ICON;
  material_name = null;
  tax_scheme = [];
  pDeletes = [];
  tDeletes = [];
  isvalidPricing: boolean = false
  isvalidPromotion: boolean = false
  hasError:boolean = false;
  isvalidForm:boolean = true
  readonly AppConstant = AppConstant;

  /**
   * @see Vendor can add, edit delete product
   * @see Staff can view blacklist and delete product
   */

  formgroup: FormGroup

  constructor(
    public dialog: MatDialog,
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthService,
    private translateService: TranslateService,
    private ProductService: ProductPricingService
  ) { }
  /**
   * the functions within @see ngOnInit() is going to be loaded when the plage is loaded
   */
  ngOnInit() {
    this.translateService.setDefaultLang('en')
    this.initRole();
    this.createForm();
  }

  /**
   * checking the users rule if the rule is not matched 
   * @see initRole() will automatically send back to previous page
   */
  initRole() {
    if (!this.authService.getUser()) {
      this.authService.queryUserDetails().subscribe(
        user => {
          if (user.id) {
            this.isvendor = this.authService.hasGroup(AppConstant.ROLE.VENDOR);
            if (user.groups[0].name === AppConstant.ROLE.VENDOR) {
              this.setUserId(this.route.snapshot.url[0].path, this.route.snapshot.params.id);
            } else if (user.groups[0].name === AppConstant.ROLE.PURCHASER) {
              this.setUserId(this.route.snapshot.url[0].path, this.route.snapshot.params.id);
            } else {
              this.location.back();
            }
          }
        }
      )
    }
    else {
      this.isvendor = this.authService.hasGroup(AppConstant.ROLE.VENDOR);
      // this.hidemenu = this.isvendor;
      if (this.isvendor) {
        this.setUserId(this.route.snapshot.url[0].path, this.route.snapshot.params.id);
      } else {
        this.setUserId(this.route.snapshot.url[0].path, this.route.snapshot.params.id);
      }
    }
  }

  setUserId(path: string, value?: number) {
    if (path === 'edit' && value != null) {
      this.isEdit = true;
      return this.editData(value);
    } else if (path === 'add-product') {
      this.isEdit = false;
      return
    }
    else {
      this.location.back();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LookUpComponent, {
      width: '600px',
      height: '600px',
      autoFocus: false,
      data: { name: this.productPricingData }
    });
    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res) {
          this.setLookUpData(res);
        }else{
          return
        }
      }
    );
  }
  setLookUpData(data) {
    if (data === undefined || data.length === 0) {
      return
    }
    else {
      if (data.material_picture === undefined || data.material_picture === null) {
        this.material_picture = this.material_picture;
      } else {

        this.material_picture = data.material_picture;
        this.material_name = data.name;
      }
      this.formgroup.patchValue(
        {
          material_id: data.id,
        }
      )
    }
  }

  createForm() {
    this.tax_scheme = ProductPricingConstant.TAX_SCHEME;
    this.formgroup = this.fb.group(
      {
        material_id: ['', [Validators.required]],
        use_lowest_price: [false],
        validity_date: null,
        default_price: ['', [Validators.required]],
        tax_scheme: ['', [Validators.required, Validators.min(0)]],
        pricings: this.fb.array([this.initPricing()]),
        promotions: this.fb.array([this.initPromotion()])
      }
      , { validator: this.validateForm }
    )

    if (!this.isEdit) {
      // if (this.pricings.length === 1) { this.pricings.removeAt(0) }
      // if (this.promotions.length === 1) { this.promotions.removeAt(0) }
    }
  }

  validateForm(control: AbstractControl): { [key: string]: boolean } {
    var tr = false;
    var pr = false;
    const tierPrice = control.get('pricings');
    const promotion = control.get('promotions');
    var tier = tierPrice.value;
    var promo = promotion.value;

    if (promo.length>0) {
      for (let i = 0; i < promo.length; i++) {
        var fd = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(promo[i].from_date);
        var td = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(promo[i].to_date);
        if (promo[i].from_date <= promo[i].to_date && fd && td) {
          pr = true;
        }
        else {
          // this.isvalidPricing = false;
          pr = false;
          break
        }
      }
    }else{
      pr = true;
    }

    if (tier.length>0) {
      for (let i = 0; i < tier.length; i++) {
        if (tier[i].from_qty <= tier[i].to_qty) {
          tr = true;
        }
        else {
          tr = false;
          break
        }
      }
    } else {
      tr = true;
    }

    if (tr && pr) {
      return null
    }

    return { mismatch: true }
  }

  nn(){
    console.log('test .....?');
  }
  initPricing() {
    return this.formgroup = this.fb.group({
      id: [0],
      from_qty: ['', [Validators.required]],
      to_qty: ['', [Validators.required]],
      price: ['', [Validators.min(0)]],
    })
  }

  get pricings(): FormArray {
    return this.formgroup.get('pricings') as FormArray;
  }

  addPricing(): void {
    this.pricings.push(this.fb.group(new Pricing()));
  }
  removePricing(i, rm) {
    this.formgroup.value.pricings.touched
    if (/^\d+$/.test(rm) && rm !== 0) {
      this.tDeletes.push({ id: rm })
    } else {
      this.tDeletes.push()
    }
    this.pricings.removeAt(i)
  }

  initPromotion() {
    return this.formgroup = this.fb.group({
      id: [0],
      from_date: [null, [Validators.min(0)]],
      to_date: [null, [Validators.min(0)]],
      price: [0, [Validators.min(0)]]
    })
  }

    get promotions(): FormArray {
      return this.formgroup.get('promotions') as FormArray;
    };

    addPromotion(): void {
      this.promotions.push(this.fb.group(new Promotion()));
    }
    removePromotion(i, rm) {
      this.formgroup.enable 
      if (/^\d+$/.test(rm) && rm !== 0) {
        this.pDeletes.push({ id: rm })
      } else {
        this.pDeletes.push()
      }
      this.promotions.removeAt(i);
    }

    addNewProduct(data): void {

      if(data.promotions.length > 0) {
      if (data.promotions.from_date === 0 || data.promotions.to_date === 0) {
        console.log('invalid form ');
        return
      }
    }
    var body = {
      price: data.default_price,
      validity_date: data.validity_date||null,
      tax_scheme: data.tax_scheme,
      rrp_price: 22,
      use_lowest_price: data.use_lowest_price,
      material: {
        id: data.material_id
      },
      pricings: data.pricings,
      promotions: data.promotions,
      tier_deletes: this.tDeletes,
      promo_deletes: this.pDeletes,
    }
    if (this.route.snapshot.url[0].path === 'add-product') {
      this.submitAdd(body);
    } else if (this.route.snapshot.url[0].path === 'edit' && Number(this.route.snapshot.url[1].path) > 0) {
      this.submitEdit(Number(this.route.snapshot.url[1].path), body);
    } else {
      this.location.back()
    }
  }

  submitAdd(data) {

    this.spinnerService.show();
    this.ProductService.queryAdd(data).subscribe((s) => {
      if (s) {
        this.resetForm();
      } else {
        this.onError('something is wrong ...');
      }
    }, (err) => {
      this.onError(err)
    })
  }
  submitEdit(id, data) {
    this.spinnerService.show();
    this.ProductService.queryUpdateData(id, data).subscribe((res) => {
      this.resetForm();
      console.log(res);
    }, (err) => {
      this.onError(err)
    })
  }

  editData(value?: number) {
    this.ProductService.queryEiditData(value).subscribe((res) => {
      this.setProductData(res.data);
    }, (err => {
      this.onError(err)
    }))
  }

  setProductData(values) {
    var entity: SubmitModel = Object.assign({}, values);
    this.material_picture = entity.material.material_picture;
    this.material_name = entity.material.name;
    this.formgroup.patchValue({
      material_id: entity.material.id,
      use_lowest_price: entity.use_lowest_price,
      default_price: entity.price,
      validity_date: values.validity_date,
      tax_scheme: entity.tax_scheme,
    })

    let addPriceArray: FormArray = <FormArray>this.formgroup.get('pricings');
    let counter = 0;
    entity.pricings.forEach(_add_price => {
      if (counter == 0) {
        addPriceArray.at(0).patchValue(_add_price);
      } else {
        addPriceArray.push(this.fb.group(_add_price));
      }
      counter++;
    });
    let addPromotionsArray: FormArray = <FormArray>this.formgroup.get('promotions');
    counter = 0;
    entity.promotions.forEach(_add_promotion => {
      if (counter == 0) {
        addPromotionsArray.at(0).patchValue(_add_promotion);
      } else {
        addPromotionsArray.push(this.fb.group(_add_promotion));
      }
      counter++;
    });
    if (entity.pricings.length === 0) { this.pricings.removeAt(0) }
    if (entity.promotions.length === 0) { this.promotions.removeAt(0) }
  }

  openHistory() {
    var id = this.route.snapshot.params.id;
    const dialogRef = this.dialog.open(ProductPricingHistoryComponent, {
      width: '80%',
      height: '80%',
      autoFocus: false,
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(
      (res) => {
        console.log('closed');
      });
  }

  back() {
    this.location.back()
  }

  onError(error) {
    this.spinnerService.hide();
    this.errorMessage = "Failed to save product pricing";
    this.hasError = true;
  }

  ngOnDestroy() {
    // unsubscribe();
  }

  resetForm() {
    this.spinnerService.hide();
    this.formgroup.reset();
    this.location.back()
  } 
}