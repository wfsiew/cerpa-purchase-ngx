import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../inventory.service';
import { AppConstant } from '../../../shared';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
    private translateService: TranslateService,
    private inventoryService: InventoryService
  ) {
    this.translateService.setDefaultLang('en');
  }

  ngOnInit() {
    this.craeteForm();
    this.loadQtyMeasure();
    this.searchCategory(null);
    this.searchBrand(null);
    this.fGroup.get('product_type').setValue(0);
    const id = this.route.snapshot.params.id;
    if (_.isEmpty(id)) {
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
    this.inventoryService.get_product(id).subscribe((res) => {
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
  }

  craeteForm() {
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
        price: 0,
        not_for_sale: [false],
        commission: 0,
        product_category: [null, [Validators.required]],
        auto_stock_up: [false],
        promotions: []
      });
  }

  uploadImage(evet: FileList) {
    if (evet.length > 0) {
      this.picture = evet.item(0);
      const reader = new FileReader();
      this.pictureUrl = evet;
      reader.readAsDataURL(evet[0]);
      reader.onload = (_event) => {
        this.pictureUrl = reader.result;
      };
      const id = null;
      if (this.isEditMode) {
        const formData = new FormData();
        formData.append('picture', this.picture);
        const prdId = this.route.snapshot.params.id;
        this.inventoryService.post_addProductPicture(formData, prdId, this.pictureId).subscribe((res) => {
          console.log(res);
        });
      }
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

  submitForm(data) {
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
      // commission: data.commission,
      product_category: {
        id: data.product_category
      },
      auto_stock_up: data.auto_stock_up,
      promotions: []
    };
    formData.append('data', JSON.stringify(o));
    if (!this.isEditMode && this.picture != null) {
      /** @see to-add-new product */
      formData.append('pictures', this.picture);
      this.inventoryService.post_addProduct(formData).subscribe((res) => {
        this.router.navigate(['product-list']);
      });
    } else if (this.isEditMode) {
      /** @see to-update the product */
      const id  = this.route.snapshot.params.id;
      this.inventoryService.put_product(id, formData).subscribe((res) => {
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
    this.fGroup.value.optimum_level += 1;
  }
  rmOptimumLevel() {
    if (this.fGroup.value.optimum_level > 1) {
      this.fGroup.value.optimum_level -= 1;
    } else {
      return;
    }
  }

  addParLevel() {
    if (this.fGroup.value.par_level < this.fGroup.value.optimum_level - 1) {
      this.fGroup.value.par_level += 1;
    } else {
      return;
    }
  }
  rmParLevel() {
    if (this.fGroup.value.par_level >= 1) {
      this.fGroup.value.par_level -= 1;
    } else {
      return;
    }
  }

  addDiscount() {
    this.fGroup.value.price += 1;
    console.log(this.fGroup.value.price);
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
}
export enum ProductType {
  Rebranded = 0,
  Divided = 1,
  Repackaged = 2,
  Service = 3
}
