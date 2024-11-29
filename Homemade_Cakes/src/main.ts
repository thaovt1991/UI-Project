import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


import { enableProdMode } from '@angular/core';
//key
// import { registerLicense } from '@syncfusion/ej2-base';
// registerLicense('ORg4AjUWIQA/Gnt2U1hiQlFad19JXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxXdkxiWX5fcHRWRWVUWUM=');
//Trong chế độ sản xuất, Angular sẽ tắt các kiểm tra, log debug, và các thông báo không cần thiết để cải thiện hiệu năng.
//Đoạn mã trên có vai trò tối ưu hóa ứng dụng Angular khi chạy trong môi trường sản xuất, đảm bảo hiệu năng tốt nhất cho người dùng cuối.
if (environment.production) {
  enableProdMode(); 
  ///Khi gọi enableProdMode(), Angular sẽ tắt tất cả các kiểm tra và tối ưu hóa ứng dụng để chạy nhanh hơn.
////  environment.production = true: Ứng dụng đang chạy trên môi trường sản xuất.
///environment.production = false: Ứng dụng đang chạy trong môi trường phát triển.
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
