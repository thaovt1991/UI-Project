import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http : HttpClient) { 

  }
  
  public logIn(userID: string , password :string): Observable<any> {
    return this.http.post<any>(API_URL + '/Login', userID);
  }

  
}
