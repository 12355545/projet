/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';

import { MailBody } from '../models/mail-body';

@Injectable({ providedIn: 'root' })
export class EmailService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `sendEmailSendEmailPost()` */
  static readonly SendEmailSendEmailPostPath = '/send-email';

  /**
   * Send Email.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `sendEmailSendEmailPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  sendEmailSendEmailPost$Response(
    params: {
      body: MailBody
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<any>> {
    const rb = new RequestBuilder(this.rootUrl, EmailService.SendEmailSendEmailPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<any>;
      })
    );
  }

  /**
   * Send Email.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `sendEmailSendEmailPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  sendEmailSendEmailPost(
    params: {
      body: MailBody
    },
    context?: HttpContext
  ): Observable<any> {
    return this.sendEmailSendEmailPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<any>): any => r.body)
    );
  }

}
