import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { LoginComponent } from './service/login/login.component';

const routes: Routes = [
  {
    path :'home' ,
    component : PageLayoutComponent ,
     pathMatch:'full'
  },
  {
    path :'login' ,
    component : LoginComponent ,
     pathMatch:'full'
  },
  {
    path: '',
    redirectTo: 'login', //chuyển hướng người dùng từ một đường dẫn (URL) này sang một đường dẫn khác một cách tự động
    pathMatch: 'full', //Nó xác định cách một URL được khớp với một route cụ thể.
    //'full':Đường dẫn phải khớp đúng và đầy đủ với đường dẫn được cấu hình. Nếu có bất kỳ phần nào khác nhau, route sẽ không được kích hoạt.
    //'prefix': Đường dẫn chỉ cần khớp với tiền tố của đường dẫn được cấu hình. Nếu phần còn lại của đường dẫn khớp với các route con, chúng sẽ được kích hoạt.
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppRoutingModule { }
