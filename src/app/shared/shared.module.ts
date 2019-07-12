import { NgModule } from '@angular/core';
import { SharedLibsModule } from './shared-libs.module';
// import { SpinnerComponent } from './spinner/spinner';
import {
  AppConstant,
  AuthInterceptor,
  Pager,
  Pagination,
  ResponseWrapper,
  Sort,
  createRequestParams,
  parsePagination,
} from '.';
@NgModule({
    declarations: [], 
    imports: [
      // SharedLibsModule
    ],
    exports: [
      SharedLibsModule,
    ]
})
export class SharedModule {}
