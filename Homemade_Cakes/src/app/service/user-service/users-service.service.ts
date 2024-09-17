import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RequestModel } from 'src/app/models/request-model';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class UsersServiceService {
  constructor(private http : HttpClient) { 

  }

  public getOneAsync(id): Observable<any> {
    return this.http.get<any>(`${API_URL}/User/${id}`);
  }

  public getAllAsync(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + '/User');
  }

  public logInAsync(userID: string , password :string): Observable<any> {
    return this.http.post<any>(API_URL + '/User', userID);
  }

  exec(
    assemblyName: string,
    className: string,
    methodName: string,
    data: Array<any>
  ): Observable<any> {
    const host = API_URL + '/Base/invokers';
    let request = new RequestModel();
    request.assemblyName = assemblyName;
    request.className = className;
    request.methodName = methodName;
    request.data = data;
    
    return this.http.post<any>(host, request).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
  //Set Cookies
  setCookie(contentCookies , path?,shareNameDomain? , expires?,maxage?){
    let cookies = contentCookies ;
    if(path) cookies += "; path=" +path;  //duong dan noi lưu cookies - bắt đầu với mọi đường dẫn bắt đầu với

    if(shareNameDomain) cookies += `;domain=${shareNameDomain}`; //----Tao share tcook mien

    if(expires)cookies += `;expires =${expires}`;else if(maxage){
      `max-age=${maxage}` //thiet lap thoi gian dang nhap bang s-giaay
    }  //owr day la thoi gian toUSTString() - Thoi gian duy tri cookies

     //httpOnly - Tu BE sinh ra chu ko phai FE - Khi đặt cờ HTTPOnly, cookie sẽ không thể truy cập được thông qua JavaScript. Điều này giúp ngăn chặn các cuộc tấn công XSS (Cross-Site Scripting).
     //SameSite: Thuộc tính SameSite giúp kiểm soát việc gửi cookie cùng với các yêu cầu cross-site. Có các giá trị như Strict, Lax và None.

    //  Secure Cookies -một loại cookie đặc biệt chỉ có thể được gửi và nhận qua một kết nối HTTPS (Hypertext Transfer Protocol Secure) được mã hóa. Điều này có nghĩa là dữ liệu trong cookie sẽ được mã hóa trước khi được gửi từ trình duyệt đến máy chủ và chỉ có thể được giải mã bởi máy chủ đích.
    cookies += `;secure`  //-  bật lên thi https mới luu cookies - Localhost van doc dc - chỉ có trình duyệt là ko doc dc
    document.cookie = cookies  
  }
}

