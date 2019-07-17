import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { InventoryService } from '../inventory.service';
import { AppConstant } from '../../../shared';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  readonly appConstant = AppConstant;
  fGroup: FormGroup;
  picture = null;
  pictureId = null;
  pictureUrl = null;
  categoryList = [];
  capacityList = [];
  quantityMeasureList = [];
  brandList = [];
  modelList = [];
  isEditMode = false;
  brandName = '';
  modelName = '';
  productCategoryName = '';
  modelQtyMeasure = '';
  productTypeList = [
    { id: 0, name: 'Rebranded' },
    { id: 1, name: 'Divided' },
    { id: 2, name: 'Repackaged' },
    { id: 3, name: 'Service' }
  ];
  constructor (
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private translateService: TranslateService,
    private inventoryService: InventoryService
  ) {
    this.translateService.setDefaultLang('en');
  }

  ngOnInit() {
    this.createForm();
    this.loadQtyMeasure();
    this.searchCategory(null);
    this.searchBrand(null);
    this.fGroup.get('product_type').setValue(0);
    const id = this.route.snapshot.params.id;
    if (_.isEmpty(id)) {
      if (!this.isEditMode) {
        this.promotions.removeAt(0);
      }
      this.isEditMode = false;
    } else {
      this.isEditMode = true;
      this.reloadProduct(id);
      this.getImage(id);
    }
  }

  getImage(id) {
    this.inventoryService.get_productPicture(id).subscribe((res: any) => {
      if (res.length > 0) {
        this.pictureUrl = res[0].picture;
        this.pictureId = res[0].id;
      } else {
        this.pictureUrl = this.appConstant.DEFAULT_ICONS.USER_ICON;
      }
    });
  }

  reloadProduct(id) {
    this.inventoryService.get_product(id).subscribe((res: any) => {
      this.patchValues(res);
    });
  }

  patchValues(data) {
    this.fGroup.patchValue({
      product_type: data.product_type,
      name: data.name,
      description: data.description,
      par_level: data.par_level,
      optimum_level: data.optimum_level,
      price: data.price,
      not_for_sale: data.not_for_sale,
      commission: data.commission,
      auto_stock_up: data.auto_stock_up
    });

    if (!_.isNull(data.brand)) {
      this.fGroup.get('brand').setValue(data.brand.id);
      this.brandName = data.brand.name;
    }
    if (!_.isNull(data.model)) {
      this.fGroup.get('model').setValue(data.model.id);
      this.modelName = data.model.name;
    }
    if (!_.isNull(data.product_category)) {
      this.fGroup.get('product_category').setValue(data.product_category.id);
      this.fGroup.get('ctr').setValue(data.product_category.name);
      this.productCategoryName = data.product_category.name;
    } else {
      console.log('dont have product category');
    }
    if (!_.isNull(data.qty_measure)) {
      this.fGroup.get('qty_measure').setValue(data.qty_measure.id);
      this.modelQtyMeasure = data.qty_measure.name;
    }
    if (data.promotions.length === 0) {
      this.promotions.removeAt(0);
    } else {
      let counter = 0;
      const entity: SubmitModel = Object.assign({}, data);
      const addPromotionsArray: FormArray = <FormArray> this.fGroup.get('promotions');
      counter = 0;
      entity.promotions.forEach(addPromo => {
        if (counter === 0) {
          addPromotionsArray.at(0).patchValue(addPromo);
        } else {
          addPromotionsArray.push(this.fb.group(addPromo));
        }
        counter++;
      });
    }
  }

  createForm() {
    this.fGroup = this.fb.group(
      {
        product_type: ['', [Validators.required]],
        name: ['', [Validators.required]],
        ctr: ['', [Validators.required]],
        description: null,
        brand: [null],
        model: null,
        par_level: 0,
        optimum_level: 0,
        qty_measure: ['', [Validators.required]],
        price: [0.00, [Validators.required, Validators.pattern(this.appConstant.CUSTOM_VALIDATIONS.PRICE)]],
        not_for_sale: [false],
        commission: [0.00, [Validators.pattern(this.appConstant.CUSTOM_VALIDATIONS.PRICE)]],
        product_category: [null, [Validators.required]],
        auto_stock_up: [false],
        promotions: this.fb.array([this.initPromotion()]),
      });
  }

  handlePrice() {
    if (this.fGroup.value.commission > this.fGroup.value.price) {
      this.fGroup.get('commission').setValue(0.00);
    }
  }

  handleCommission() {
    if (this.fGroup.value.commission > this.fGroup.value.price) {
      this.fGroup.get('commission').setValue(0.00);
    }
  }

  setPromoPrice(i): number {
    let n = null;
    if (this.fGroup.value.price < this.fGroup.value.promotions[i].price) {
      n = this.fGroup.value.price;
    } else {
      n = this.fGroup.value.promotions[i].price;
    }
    return n;
  }

  handlePromoPrice(i) {
    if (this.fGroup.value.promotions[i].price > this.fGroup.value.price) {
      this.promotions.controls[i].get('price').setValue(this.fGroup.value.price);
    }
  }
  maxPromoPrice(): number {
    return this.fGroup.value.price;
  }

  uploadImage(event: FileList) {
    if (event.length > 0) {
      this.picture = event.item(0);
      const reader = new FileReader();
      this.pictureUrl = event;
      reader.readAsDataURL(event[0]);
      reader.onload = (_event) => {
        this.pictureUrl = reader.result;
      };
      const id = null;
      // if (this.isEditMode) {
      //   const formData = new FormData();
      //   formData.append('picture', this.picture);
      //   const prdId = this.route.snapshot.params.id;
      //   this.inventoryService.post_addProductPicture(formData, prdId, this.pictureId).subscribe((res) => {
      //     console.log(res);
      //   });
      // }
    }
  }

  get ob() {
    return this.fGroup.value;
  }

  get myForm() {
    return this.fGroup.controls;
  }
  selectedProductType() {
    return 1;
  }
  onChangeProductType(ev) {
    console.log(ev);
  }

  searchBrand(term) {
    let t = term;
    this.fGroup.get('brand').setValue('');
    this.fGroup.patchValue({
      model: null
    });
    if (t == null) {
      t = '';
    } else {
      t = term.target.value;
    }
    this.inventoryService.get_autocompleteBrand(t).subscribe((res: any) => {
      this.brandList = res;
      this.modelList = [];
    });
  }
  selectBrand(ev) {
    // this.fGroup.value.brand = ev.id;
    this.fGroup.get('brand').setValue(ev.id);
    this.loadAutocompleteModel(ev.id);
  }

  searchCategory(ctr) {
    let term = ctr;
    this.fGroup.get('product_category').setValue('');
    if (ctr === null) {
      term = '';
    } else {
      term = ctr.target.value;
    }
    this.inventoryService.get_autocompleteProductCategory(term).subscribe((res: any) => {
      this.categoryList = res;
    });
  }
  selectCategory(ctr) {
    this.fGroup.get('product_category').setValue(ctr.id);
  }

  get hasBrandId() {
    let hasId = false;
    const id = this.fGroup.value.brand;
    if (_.isEmpty(id) && _.isNull(id)) {
      hasId = false;
    } else {
      hasId = true;
    }
    return hasId;
  }

  loadAutocompleteModel(id) {
    const term = '';
    this.inventoryService.get_autocompleteModel(id, term).subscribe((res: any) => {
      this.modelList = res;
    });
  }

  onChangeModel(ev) {
    this.fGroup.value.model = ev;
  }
  searchModel(ent) {
    const id = this.fGroup.value.brand;
    this.fGroup.get('model').setValue(null);
    let term = ent;
    if (ent === null) {
      term = '';
    } else {
      term = ent.target.value;
    }
    if (!_.isEmpty(id) && !_.isNull(id)) {
      return;
    } else {
      this.inventoryService.get_autocompleteModel(id, term).subscribe((res: any) => {
        this.modelList = res;
      });
    }
  }

  selectModel(mdl) {
    this.fGroup.get('model').setValue(mdl.id);
  }

  setModelName() {
    let vl = '';
    if (this.fGroup.value.brand !== '' || this.fGroup.value.brand !== '') {
      vl = '';
    }
    return vl;
  }

  loadQtyMeasure() {
    this.inventoryService.get_qtyMeasures().subscribe((res: any) => {
      this.quantityMeasureList = res;
    });
  }

  onChangeQtyMeasure(ev) {
    this.fGroup.value.qty_measure = ev;
  }
  maxCommission() {
    return this.fGroup.value.price;
  }
  submitForm(data) {
    this.spinnerService.show();
    const formData = new FormData();

    const o = {
      product_type: data.product_type,
      name: data.name,
      description: data.description,
      brand: data.brand,
      model: data.model,
      par_level: data.par_level,
      optimum_level: data.optimum_level,
      qty_measure: data.qty_measure,
      price: data.price,
      not_for_sale: data.not_for_sale,
      commission: data.commission,
      product_category: {
        id: data.product_category
      },
      auto_stock_up: data.auto_stock_up,
      promotions: data.promotions
    };
    formData.append('data', JSON.stringify(o));

    if (this.picture != null && !this.isEditMode) {
      /** @see to-add-new product */
      formData.append('pictures', this.picture);
      this.inventoryService.post_addProduct(formData).subscribe((res) => {
        this.router.navigate(['product-list']);
      });
    } else if (this.isEditMode) {
      /** @see to-update the product */
      const id = this.route.snapshot.params.id;
      this.inventoryService.put_product(id, formData).subscribe((res) => {
        this.spinnerService.hide();
        this.router.navigate(['product-list']);
      });
    } else {
      return;
    }
  }

  isValidStrInput(val) {
    let lb = null;
    const t = /^[a-z]/.test(val);
    if (t) {
      lb = AppConstant.VALIDATE_INPUT_BORDER.VALID;
    } else {
      lb = AppConstant.VALIDATE_INPUT_BORDER.IN_VALID;
    }
    return lb;
  }

  blankImage(img) {
    let im = null;
    if (_.isEmpty(img)) {
      im = this.appConstant.DEFAULT_ICONS.USER_ICON;
    } else {
      im = img;
    }
    return im;
  }

  addOptimumLevel() {
    this.fGroup.controls['optimum_level'].setValue(this.fGroup.controls['optimum_level'].value + 1);
  }

  rmOptimumLevel() {
    if (this.fGroup.value.optimum_level > 0) {
      if (this.fGroup.value.optimum_level > this.fGroup.value.par_level + 1
        && this.fGroup.value.optimum_level > 0) {
          this.fGroup.controls['optimum_level'].setValue(this.fGroup.controls['optimum_level'].value - 1);
      } else {
        return;
      }
    } else {
      return;
    }
  }

  addParLevel() {
    if (this.fGroup.value.par_level < this.fGroup.value.optimum_level - 1) {
      this.fGroup.controls['par_level'].setValue(this.fGroup.controls['par_level'].value + 1);
    } else {
      // let ob = this.fGroup.value.optimum_level + 1;
      this.fGroup.controls['optimum_level'].setValue(this.fGroup.controls['optimum_level'].value + 1);
      this.fGroup.controls['par_level'].setValue(this.fGroup.controls['par_level'].value + 1);
      return;
    }
  }
  rmParLevel() {
    if (this.fGroup.value.par_level >= 1) {
      this.fGroup.controls['par_level'].setValue(this.fGroup.controls['par_level'].value - 1);
    } else {
      return;
    }
  }

  addDiscount() {
    this.fGroup.value.price += 1;
  }

  rmDiscount() {
    if (this.fGroup.value.price >= 1) {
      this.fGroup.value.price -= 1;
    } else {
      return;
    }
  }

  addCommission() {
    this.fGroup.value.commission += 1;
  }
  rmCommission() {
    if (this.fGroup.value.commission >= 1) {
      this.fGroup.value.commission -= 1;
    } else {
      return;
    }
  }


  maxParLevel() {
    return this.fGroup.value.optimum_level - 1;
  }

  initPromotion() {
    return this.fGroup = this.fb.group({
      id: [0],
      from_date: [null, [Validators.required, Validators.pattern(this.appConstant.CUSTOM_VALIDATIONS.DATE)]],
      to_date: [null, [Validators.required, , Validators.pattern(this.appConstant.CUSTOM_VALIDATIONS.DATE)]],
      price: [null, [Validators.required, Validators.min(0.01), , Validators.pattern(this.appConstant.CUSTOM_VALIDATIONS.PRICE)]]
    });
  }

  setFromDate(i) {
    let d = null;
    if (i < 1) {
      d = new Date();
    } else {
      d = new Date(this.myForm.promotions.value[i - 1].to_date);
      // this.promotions.controls[i].get('from_date').setValue(d);
      d = d.setDate(d.getDate() + 1);
    }
    return d;
  }

  setToDate(i) {
    return new Date();
  }
  get promotions(): FormArray {
    return this.fGroup.get('promotions') as FormArray;
  }
  addNewPromo(): void {
    this.promotions.push(this.fb.group(new Promotion()));
  }
  removePromo(idx): void {
    this.promotions.removeAt(idx);
  }
  isValidDate(value) {
    return this.appConstant.CUSTOM_VALIDATIONS.DATE.test(value);
  }

  isValidPrice(value) {
    return this.appConstant.CUSTOM_VALIDATIONS.PRICE.test(value);
  }

  maxDate(dei, idx) {
    let d = null;
    if (idx < 1) {
      d = '';
    } else {
      d = '';
    }
    return d;
  }

  minFromDate(de, idx) {
    let d = null;
    if (idx < 1) {
      d = new Date();
    } else {
      d = new Date(this.myForm.promotions.value[idx - 1].to_date);
      d = d.setDate(d.getDate() + 1);
    }
    return d;
  }

  minToDate(de, idx) {
    let d = null;
    d = new Date(this.myForm.promotions.value[idx].from_date);
    d = d.setDate(d.getDate() + 1);
    // this.promotions.controls[idx].get('to_date').setValue(this.myForm.promotions.value[idx].from_date);
    return d;
  }
}
export enum ProductType {
  Rebranded = 0,
  Divided = 1,
  Repackaged = 2,
  Service = 3
}

export class SubmitModel {
  promotions: Promotions[];
  constructor () {
    this.promotions = [new Promotions()];
  }
}
export class Promotions {
  id: number;
  from_date: string;
  to_date: string;
  price: number;
}

export class Promotion {
  id = 0;
  from_date = '';
  to_date = '';
  price = null;
}
