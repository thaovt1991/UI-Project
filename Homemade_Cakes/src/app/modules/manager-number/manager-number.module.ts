import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ManagerNumberComponent } from './manager-number.component';
import { LayoutComponent } from './layout/layout.component';
import { ButtonComponent, ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { NumericTextBoxComponent, NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { FilterService, GridModule, GroupService, PageService, SortService } from '@syncfusion/ej2-angular-grids';


export const routes: Routes = [
  {
    path: 'managernumbers',
    component: LayoutComponent,
    children: [
      {
        path: 'views',
        component: ManagerNumberComponent,
      },
    ],
  },
];
const T_Component: Type<any>[] = [
  LayoutComponent,
  ManagerNumberComponent
];

@NgModule({
  declarations: T_Component, //Khai báo 1 mảng component hoặc  1 mang pipe
  imports: [
    NumericTextBoxModule,
    ButtonModule, 
    GridModule, 
    CommonModule,
    RouterModule.forChild(routes), //forchild cho con //sử dụng cho module con
  ],
  providers: [  //kahi báo các service hệ thống
    PageService,
    SortService,
    FilterService,
    GroupService],
})
export class ManagerNumberModule {}
