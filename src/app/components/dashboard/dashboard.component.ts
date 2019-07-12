import { Component, OnInit, Directive, HostListener, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, Routes, RouterModule } from '@angular/router';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppConstant, ModuleServices } from '../../shared';
import { ErrorStateMatcher } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createTranslateLoader } from '../common';
import { HttpClient } from '@angular/common/http'
import { AuthGuardService } from '../../account/services/auth-guard.service';
import { AccountService } from '../account/service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  user: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private moduleService: ModuleServices,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    console.log('dashboard');
    this.translateService.setDefaultLang('en');
    this.getUserDetails();
  }

  getUserDetails(){
    this.accountService.queryGetUserDetails().subscribe((res:any)=>{
      var fname = res.first_name;
      var lname = res.last_name;
      var email = res.email;
      if (fname!=null || fname != undefined) {
        this.user = `${fname} ${lname}`
      }else{
        this.user = email;
      }
    })
  }
}





export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,canActivate: [AuthGuardService],
  },
] 


const ENTITY_STATES = [
  ...DASHBOARD_ROUTES
];

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ENTITY_STATES),
    TranslateModule.forRoot({ loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })
  ],
  declarations: [ DashboardComponent ],
  entryComponents: [ DashboardComponent ],
  providers: [],
  exports: [ DashboardComponent ], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule {}