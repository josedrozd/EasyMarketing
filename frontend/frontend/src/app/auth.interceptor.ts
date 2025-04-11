import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 400) {
          this.router.navigate(['/bad-request']);
        } else if (error.status === 401) {
          this.router.navigate(['/unauthorized']);
        } else if (error.status === 404) {
          this.router.navigate(['/404']);
        }
        return throwError(() => error);
      })
    );
  }
}
