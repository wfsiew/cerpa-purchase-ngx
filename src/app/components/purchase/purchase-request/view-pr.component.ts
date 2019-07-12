import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseRequestService } from './purchase-request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseWrapper } from '../../../shared';

@Component({
  selector: 'app-view-pr',
  templateUrl: './view-pr.component.html',
  styleUrls: ['./view-pr.component.css']
})

export class ViewPurchaseRequestComponent implements OnInit, OnDestroy {
  material_picture: string = 'assets/images/default-m-icon/default-m-icon.png';

  lists: ViewPR[]
  routeFrom: any;
  constructor(
    private translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private prService: PurchaseRequestService
  ) { }
  ngOnInit() {
    this.translateService.setDefaultLang('en');
    var x = this.route.snapshot.params.id;
    this.routeFrom = this.route.snapshot.params.p;
    this.isValidID(x)
  }

  isValidID(id) {
    this.viewPRDetails(id)
  }

  viewPRDetails(id) {
    this.prService.queryViewPR(id, this.routeFrom).subscribe(
      (res: ResponseWrapper) => this.onSuccess(res),
      (res: ResponseWrapper) => this.onError(res)
    )
  }

  back() {
    if (this.routeFrom == 'pr') this.router.navigate(['./purchase-request']);
    if (this.routeFrom == 'po') this.router.navigate(['./purchase-order']);
  }


  onSuccess(data) {
    this.lists = data;
  }

  onError(error) {
    console.log(error);
  }

  ngOnDestroy() { }
}

export class ViewPR {
  id?: number;
  material_name?: string;
  quantity?: string;
  desc?: string;
}


