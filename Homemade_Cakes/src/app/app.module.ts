import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceModule } from './page-layout/service.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './service/login/login.component';

import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './service/auth/auth.component';
import {
  NgxUiLoaderModule,
  SPINNER,
  NgxUiLoaderConfig,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule,
} from 'ngx-ui-loader';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ManagerCakesComponent } from './modules/manager-cakes/manager-cakes.component';



const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: '#187DE4',
  // bgsOpacity: 0.5,
  // bgsPosition: POSITION.bottomLeft,
  // bgsSize: 60,
  bgsType: SPINNER.pulse,
  // blur: 5,
  // delay: 0,
  fastFadeOut: true,
  fgsColor: '#187DE4',
  // fgsPosition: POSITION.centerCenter,
  fgsSize: 60,
  fgsType: SPINNER.cubeGrid,
  // gap: -65,
  // logoPosition: POSITION.centerCenter,
  // logoSize: 32,
  // logoUrl: 'assets/media/logos/logo-1.svg',
  // overlayBorderRadius: '0',
  overlayColor: 'rgba(255,255,255,0)',
  pbColor: '#187DE4',
  // pbDirection: PB_DIRECTION.leftToRight,
  // pbThickness: 5,
  // hasProgressBar: true,
  // text: 'Welcome to ngx-ui-loader',
  // textColor: '#FFFFFF',
  // textPosition: POSITION.centerCenter,
  // maxTime: -1,
  minTime: 100,
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthComponent,
   // ManagerNumberComponent,
    ManagerCakesComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ServiceModule,
    FormsModule ,
    ReactiveFormsModule, //de nhan gia tri form
    BrowserAnimationsModule, //Thay đổi trạng thái mượt mà
    CommonModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),//caì đặt loadder (cái nháy nháy ở góc)
    // NgxSkeletonLoaderModule.forRoot({
    //   animation: 'pulse',
    //   loadingText: 'This item is actually loading...', //là một module Angular chuyên dụng để tạo các hiệu ứng placeholder
    // }),
  ],
  
  providers:[
  // {
  //   provide: APP_INITIALIZER,
  //   useFactory: APP_INITIALIZER,
  //   multi: true,
  //  // deps: [AuthService, AppConfigService],
  // },
  // { provide: RouteReuseStrategy}
  ///{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, - xem lại chỗ chặn quuyeefn này
  //{ provide: RouteReuseStrategy, useClass: CacheRouteReuseStrategy }, //--core dx có xem nó làm gì
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, //schema trong Angular có vai trò cho phép chúng ta sử dụng các phần tử tùy chỉnh (custom elements) trong template của component mà không bị Angular báo lỗi.
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
