import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {MessageService} from './message.service';
import {Lesson} from './lesson';
import {RecordActivityRequest} from './record-activity-request';
import {EnrollmentInfo} from './enrollment-info';
import {Transfer} from './transfer';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LrsService {
  private angularDev = false;
  private cordaUrl = this.angularDev ? 'http://localhost:10010/api/lrs/' : '/api/lrs/';
  private statementsUrl = this.angularDev ? 'http://localhost:10010/api/statements/' : '/api/statements/';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }


  getLesson (id: string): Observable<Lesson> {
    const urlWithID = this.cordaUrl + 'enrollment' + `/${id}`;
    return this.http.get<Lesson>(urlWithID, httpOptions)
      .pipe(
        tap(_ => this.log(`fetched lesson ${id}`)),
        catchError(this.handleError<Lesson>('getLessons'))
      );
  }

  getLessons (): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.cordaUrl + 'enrollments', httpOptions)
      .pipe(
        tap(lessons => this.log(`fetched lessons ${lessons.length}`)),
        catchError(this.handleError('getLessons', []))
      );
  }

  enrollStudent (lesson: Lesson): Observable<Lesson> {
    return this.http.post<Lesson>(this.cordaUrl + 'new-enrollment-request', lesson, httpOptions).pipe(
      tap((l: Lesson) => this.log(`added enrollment w/ id=${l.lessonName}`)),
      catchError(this.handleError<Lesson>('enrollStudent'))
    );
  }

  recordActivity (rar: RecordActivityRequest): Observable<EnrollmentInfo> {
    return this.http.post<RecordActivityRequest>(this.statementsUrl + 'record-activity-request', rar, httpOptions).pipe(
      tap((e: EnrollmentInfo) => this.log(`added activity to id=${e.enrollmentID}`)),
      catchError(this.handleError<Lesson>('recordActivity'))
    );
  }

  completeLesson (ei: RecordActivityRequest): Observable<EnrollmentInfo> {
    return this.http.post<RecordActivityRequest>(this.cordaUrl + 'lesson-complete-request', ei, httpOptions).pipe(
      tap((e: EnrollmentInfo) => this.log(`added activity to id=${e.enrollmentID} and marked lesson complete`)),
      catchError(this.handleError<Lesson>('completeLesson'))
    );
  }

  transfer (tr: Transfer): Observable<EnrollmentInfo> {
    return this.http.post<Transfer>(this.cordaUrl + 'transfer-lesson-request', tr, httpOptions).pipe(
      tap((e: EnrollmentInfo) => this.log(`transferred id=${e.enrollmentID}`)),
      catchError(this.handleError<Lesson>('transfer'))
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
