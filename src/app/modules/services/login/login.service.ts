import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, retryWhen } from 'rxjs/operators';
import { ApiService, } from '../api.service';
import { environment as env } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  loading = false;
  constructor(private api: ApiService) {

  }

  loginWithUserNameandPassword(requestObj): any {
    return this.api.post(env.ADMIN_LOGIN_URL, requestObj).pipe(
      tap(data => {
        this.loading = false;
      }),
      catchError(err => err)
    );
  }
  

  sendOtp(requestObj): any {
    return this.api.get('https://reqres.in/api/users/2').pipe(
      tap(data => {
        this.loading = false;
      }),
      catchError(err => err)
    );
  }

  verifyotp(requestObj): any {
    return this.api.get('https://reqres.in/api/users/2').pipe(
      tap(data => {
        this.loading = false;
      }),
      catchError(err => err)
    );
  }
}
