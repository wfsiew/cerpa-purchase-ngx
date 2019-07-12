import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { AppConstant, Pager } from '../../../shared';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-notifications-details',
  templateUrl: './notifications-details.component.html',
  styleUrls: ['./notifications-details.component.css']
})
export class NotificationsDetailsComponent implements OnInit {
  token: string = null;
  tokenList = [];
  pager:number;
  message
  notificationDetails: any;
  notificationModul = [
    {key:0,url:'vendor', des: "Invite Vendor failed of pstaff"},
    {key:1,url:'delivery-status', des: "view delivery order for pstaff"},
    {key:2,url:'view-po', des: "view purchase order for vendor"},
    {key:3,url:'view-po', des: "cancel purchase order"}
    // view-po/70/po
  ]
  @Input() showApp: string = '';
  constructor(
    private notificationServices: NotificationService,
    private spinner: Ng4LoadingSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.notificationServices.getPermission();
    
    this.message = this.notificationServices.currentMessage;
    this.notificationServices.receiveMessage();
    this.displayNotification();

    this.notificationServices.currentRefresher.subscribe((res)=>{
      this.displayNotification();
    })
  }
 
  displayNotification(){
    this.spinner.show();
    var id = this.route.snapshot.params.id;
    this.notificationServices.getNotificationsDetails(id).subscribe(
      (res)=>{
        this.onSuccess(res);
      },
      (err)=>{
        this.onError(err);
      }
    )
  }

  

  onSuccess(res){
    this.notificationDetails = res.body;
    this.spinner.hide();
  }

  onError(error){
    this.spinner.hide();
    console.log(error);
  }
  
  back(){
    this.location.back();
  }

  navigateModuls(data){
    for (let i = 0; i < this.notificationModul.length; i++) {
      if (data.module === 0) {
        this.router.navigate(['vendor'])
      }
      else if(data.module === 2 || data.module === 3){
        this.router.navigate([this.notificationModul[i].url, data.id,'po'])
      }
      else if (data.module === this.notificationModul[i].key){
        this.router.navigate([this.notificationModul[i].url, data.id])
      }else{
       console.log('');
      }
    }
  } 
}