import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import notify from 'devextreme/ui/notify';

const APIKEY = 'btcaqcf48v6rudsh60kg';

@Injectable()

export class TokenInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let sendReq = req.clone({ params: req.params.set('token', APIKEY) });  // { headers: req.headers.set('X-Finnhub-Secret', APIKEY)}
        let errMsg = '';

        return next.handle(sendReq).pipe(catchError((err) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 429) {
                    errMsg = 'Превышен лимит обращений к серверу!';
                } else {
                    errMsg = err.message;
                }
                notify(errMsg, 'info', 3000);

                return throwError(err);
            }
        }))
    }
}