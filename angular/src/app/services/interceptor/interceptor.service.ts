import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import { TokenServiceService } from '../token-service/token-service.service';
import { LoaderService } from '../loader/loader.service';



@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private tokenService: TokenServiceService,
    private loaderService: LoaderService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    const token = this.tokenService.getToken;
      console.log(token);  
    if (token) {
      const authReq = req.clone({
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token
        })
      });
      return this.handleRequest(authReq, next);
    }

    return this.handleRequest(req, next);
  }

  private handleRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(tap((event) => {
            if (event instanceof HttpResponse) {
              this.loaderService.hide();
            }
          },
          (err: any) => {
            this.loaderService.hide();

          })
      );
  }
}
