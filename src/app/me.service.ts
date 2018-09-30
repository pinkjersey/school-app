import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {MessageService} from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
};

@Injectable({
  providedIn: 'root'
})
export class MeService {
  private angularDev = false;
  private cordaUrl = this.angularDev ? 'http://localhost:10010/api/lrs/me' : '/api/lrs/me';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

    getMe(): Observable<string> {
      return this.http.get<string>(this.cordaUrl)
        .pipe(
          map(me => me.substring(2, me.indexOf(','))), // return up to the first comma
          tap(h => {
            const outcome = h ? `fetched` : `did not find`;
            this.log(`${outcome} identity`);
          }),
          catchError(this.handleError<string>(`getMe`))
        );
    }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
  }
}
