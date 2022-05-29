import { Injectable } from '@angular/core';
import jsSHA from 'jssha';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyHeaderInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let newRes = request.clone({
      headers: new HttpHeaders(this.getAuthorizationHeader()),
    });
    return next.handle(newRes);
  }

  getAuthorizationHeader() {
    //  填入自己 ID、KEY 開始
    let AppID = 'ebd880f6fb324d499d6fb0f91a018ea6';
    let AppKey = 'owkbMldV9U6AplkfITINIlEp7Po';
    //  填入自己 ID、KEY 結束
    let GMTString = new Date().toUTCString();
    let ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    let HMAC = ShaObj.getHMAC('B64');
    let Authorization =
      'hmac username="' +
      AppID +
      '", algorithm="hmac-sha1", headers="x-date", signature="' +
      HMAC +
      '"';
    return { Authorization: Authorization, 'X-Date': GMTString };
  }
}
