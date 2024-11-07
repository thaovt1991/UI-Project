import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RequestModel } from 'src/app/models/request-model';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class UsersServiceService {
  //#region  dùng axios
  // private axiosClient: AxiosInstance;

  // constructor() {
  //   this.axiosClient = axios.create({
  //     baseURL: 'https://example.com/api', // Thay bằng URL API của bạn
  //     timeout: 10000, // Thời gian timeout
  //     headers: {
  //       'Content-Type': 'application/json',
  //     }
  //   });
  // }

  // // GET request
  // async getUsers(): Promise<any> {
  //   try {
  //     const response = await this.axiosClient.get('/users');
  //     return response.data;
  //   } catch (error) {
  //     this.handleError(error);
  //   }
  // }

  // // POST request
  // async createUser(data: any): Promise<any> {
  //   try {
  //     const response = await this.axiosClient.post('/users', data);
  //     return response.data;
  //   } catch (error) {
  //     this.handleError(error);
  //   }
  // }

  // // PUT request
  // async updateUser(userId: string, data: any): Promise<any> {
  //   try {
  //     const response = await this.axiosClient.put(`/users/${userId}`, data);
  //     return response.data;
  //   } catch (error) {
  //     this.handleError(error);
  //   }
  // }

  // // DELETE request
  // async deleteUser(userId: string): Promise<any> {
  //   try {
  //     const response = await this.axiosClient.delete(`/users/${userId}`);
  //     return response.data;
  //   } catch (error) {
  //     this.handleError(error);
  //   }
  // }

  // // Xử lý lỗi
  // private handleError(error: any): void {
  //   console.error('API Error:', error);
  //   throw error;
  // }

  //Dung HTTP clear
  constructor(private http: HttpClient) {}
  getOneAsync(id): Observable<any> {
    return this.http.get<any>(`${API_URL}/User/${id}`);
  }

  getAllAsync(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + '/User');
  }
  // POST request với JSON body
  logInAsync(data): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${API_URL}/Login/login`, JSON.stringify(data), { headers });

    // return this.http.post<any>(API_URL + '/Login/login', data);
  }

  // POST request
  logInAsync2(data: any): Promise<any> {
  return fetch(`${API_URL}/Login/login`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  })
  .then((response) => {
      // Kiểm tra xem phản hồi có thành công hay không
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Chuyển đổi phản hồi thành JSON nếu thành công
  })
  .catch((error) => {
      console.error('Error:', error);
      throw error; // Bắt và ném lỗi
  });
  }

  //Gọi apio convert
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
  setCookie(contentCookies, path?, shareNameDomain?, expires?, maxage?) {
    let cookies = contentCookies;
    if (path) cookies += '; path=' + path; //duong dan noi lưu cookies - bắt đầu với mọi đường dẫn bắt đầu với

    if (shareNameDomain) cookies += `;domain=${shareNameDomain}`; //----Tao share tcook mien

    if (expires) cookies += `;expires =${expires}`;
    else if (maxage) {
      `max-age=${maxage}`; //thiet lap thoi gian dang nhap bang s-giaay
    } //owr day la thoi gian toUSTString() - Thoi gian duy tri cookies

    //httpOnly - Tu BE sinh ra chu ko phai FE - Khi đặt cờ HTTPOnly, cookie sẽ không thể truy cập được thông qua JavaScript. Điều này giúp ngăn chặn các cuộc tấn công XSS (Cross-Site Scripting).
    //SameSite: Thuộc tính SameSite giúp kiểm soát việc gửi cookie cùng với các yêu cầu cross-site. Có các giá trị như Strict, Lax và None.

    //  Secure Cookies -một loại cookie đặc biệt chỉ có thể được gửi và nhận qua một kết nối HTTPS (Hypertext Transfer Protocol Secure) được mã hóa. Điều này có nghĩa là dữ liệu trong cookie sẽ được mã hóa trước khi được gửi từ trình duyệt đến máy chủ và chỉ có thể được giải mã bởi máy chủ đích.
    cookies += `;secure`; //-  bật lên thi https mới luu cookies - Localhost van doc dc - chỉ có trình duyệt là ko doc dc
    document.cookie = cookies;
  }
}
