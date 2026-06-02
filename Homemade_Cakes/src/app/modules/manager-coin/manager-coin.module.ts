import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { ManagerCoinComponent } from './manager-coin.component';

// export const routes: Routes = [
//   {
//     path: 'managercoin',
//     component: LayoutComponent,
//     children: [
//       {
//         path: 'views',
//         component: ManagerCoinComponent,
//       },
//     ],
//   },
// ];

@NgModule({
  declarations: [ManagerCoinComponent],
  imports: [
    CommonModule
  ]
})
export class ManagerCoinModule { }
