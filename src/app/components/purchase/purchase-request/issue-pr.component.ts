import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PurchaseRequestService } from './purchase-request.service';
import { MatDialog, DialogPosition } from '@angular/material';
import { LookUpComponent } from './look-up';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmDialogComponent } from '../../../shared/components';
import * as _ from "lodash";
@Component({
  selector: 'app-issue-pr',
  templateUrl: './issue-pr.component.html',
  styleUrls: ['./issue-pr.component.css']
})
@Output()

export class IssuePurchaseRequestComponent implements OnInit, OnDestroy {
  material_name: string = '';
  qty = 0;
  dialogPosition: DialogPosition
  pr_materials = [];
  purchaseRequest = [];

  material_picture: string = 'assets/images/default-m-icon/default-m-icon.png';
  formgroup: FormGroup;

  constructor(
    public dialog: MatDialog,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pService: PurchaseRequestService,
    private location: Location,
    private spinnerService: Ng4LoadingSpinnerService
  ) { }


  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.createForm();
    var prId = this.route.snapshot.params.id;
    if (/^\d+$/.test(prId)) {
      console.log('yes');
      this.setResissedData(prId);
    } else {
      console.log('no')
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(LookUpComponent, {
      width: '600px',
      height: '600px',
      data: {},
      closeOnNavigation: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.formgroup.patchValue(
          {
            material_name: result.name,
            material_id: result.id,
            material_picture: result.material_picture,
            desc: result.desc
          }
        )
        if (result.material_picture != null) {
          this.material_picture = result.material_picture;
        }
      } else {
        return
      }
    });
  }

  addQyt() {
    this.qty = this.qty + 1;
  }
  lessQyt() {
    if (this.qty < 1) {
      return this.formgroup;
    } else {
      this.qty -= 1;
    }
  }

  clearQyt(){
    this.qty = 0;
  }
  createForm() {
    this.formgroup = this.fb.group(
      {
        material_id: ['', [Validators.required]],
        material_picture: [''],
        material_name: [''],
        desc: [''],
        qty: [this.qty, [Validators.required, Validators.min(1), Validators.maxLength]],
      }
    )
  }

  addNewProduct(){
   var mID = this.formgroup.value.material_id;
    this.pService.queryGetQ(mID).subscribe((res:any)=>{
      if (_.isEmpty(res)) {
        this.conformation();
      }else{
        this.onUpdateList(this.formgroup.value);
        this.resetForm();
      }
    })
  }
    
  
  conformation(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '10%',
      minHeight: '10%',
      data: {
        message: 'No vendor found for the requested item(s).',
        name: '*',
        title: 'Verifications',
        button_yes: 'OK',
        button_no: ''
      },
      closeOnNavigation: false
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(this.formgroup.value);
      // this.VerifyProduct();
    })
  }
  // addNewProduct() { // } 

  setResissedData(id: number) {
    this.spinnerService.show();
    this.pService.queryReissuePR(id).subscribe(
      (res: any) => {
        this.spinnerService.hide();
        var o = res.pr_materials
        o.forEach(element => {
          var rs = element.material;
          let body = {
            material_id: rs.id,
            material_name: rs.name,
            material_picture: rs.picture,
            qty: element.quantity
          }
          this.purchaseRequest.push(body);
        });
      },
      (err) => {
        this.spinnerService.hide();
      })
  }

  patchDefaultValue() {
    return this.formgroup.patchValue(
      {

      }
    )
  }

  onUpdateList(data) {
    let element = null;
    let idx = -1;
    if (this.purchaseRequest.length > 0) {
      for (let i = 0; i < this.purchaseRequest.length; i++) {
        if (data.material_id === this.purchaseRequest[i].material_id) {
          element = this.purchaseRequest[i];
          idx = i;
          break;
        }
      }
      if (element != null) {
        this.purchaseRequest[idx].qty = data.qty + element.qty;
      }

      else {
        this.purchaseRequest.push(data);
      }
    } else {
      this.purchaseRequest.push(data);
    }
  }

  back() {
    this.router.navigate(['./purchase-request'])
  }

  onSuccess(data) {
    this.spinnerService.show();
    this.location.back()
  }

  deleteItem(it) {
    this.purchaseRequest.forEach((item, index) => {
      if (item.material_id === it.material_id) this.purchaseRequest.splice(index, 1);
    });
  }

  addP(itm){
    this.purchaseRequest.forEach((item, index) => {
      if (item.material_id === itm.material_id) item.qty +=1;
    });
  }

  lessP(itm){
    this.purchaseRequest.forEach((item, index) => {
      if (item.material_id === itm.material_id){
        if (item.qty>1) {
          item.qty -=1;
        }else{
          return
        }
      }
    });
  }

  submitRequestes() {
    var prm = this.route.snapshot.params.id;
    this.spinnerService.show();
    var o = { pr_materials: [] };
    this.purchaseRequest.forEach(element => {
      o.pr_materials.push({ material: { id: element.material_id }, quantity: element.qty })
    });
    if (o.pr_materials.length < 1) {
      this.spinnerService.hide();
      return
    } else {
      if (prm) {
        this.pService.queryUpdateIssuePurchesReqouste(o, prm).subscribe(
          (res) => {
            this.onSuccess(res)
          })
      } else {
        this.pService.queryIssuePurchesReqouste(o).subscribe(
          (res) => {
            this.onSuccess(res)
          })
      }
    }
  }

  onError() {}

  resetForm() {
    this.formgroup.reset();
    this.qty = 0;
    this.material_picture = 'assets/images/default-m-icon/default-m-icon.png'
  }

  ngOnDestroy() { }
}


