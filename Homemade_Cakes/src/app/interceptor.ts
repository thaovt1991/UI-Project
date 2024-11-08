import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
//thiet lap - dan nhan lên api
@Injectable()
export class Interceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('token');
    if(token){
        const authToken = 'Bearer ' + localStorage.getItem('token') //'Bearer YOUR_TOKEN';
        debugger
        const clonedRequest = req.clone({
          setHeaders: { Authorization: authToken }
        });
        return next.handle(clonedRequest).pipe(
          catchError((error) => {
            console.error('Error occurred:', error);
            throw error;
          })
        );
    }else{
        window.navigator['/login']
        return next.handle(req);
    }
   
  }
}
