import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { default as jwt_decode, jwtDecode } from 'jwt-decode';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  isLoggedIn() {
    let token = localStorage.getItem('token');
    if (token) {
      let info = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại tính bằng giây
      return info.exp > currentTime; // Nếu exp lớn hơn thời gian hiện tại thì vẫn còn hiệu lực
    }
    return false;
  }

  decodeToken(token: string) {
    try {
      const decoded = jwtDecode(token); //
      console.log(decoded); // Xem dữ liệu giải mã được từ token
      return decoded;
    } catch (error) {
      console.error('Token không hợp lệ:', error);
      return null;
    }
  }
}
