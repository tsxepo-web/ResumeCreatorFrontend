import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { IResume } from '../Abstracts/resume.interface';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private apiUrl = environment.apiUrl;
  private storageKey = 'resumeId';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getResumes(): Observable<IResume> {
    return this.http
      .get<IResume>(this.apiUrl)
      .pipe(catchError(this.errorHandler.handleError));
  }

  createResume(resume: IResume): Observable<IResume> {
    const resumeId = this.getSavedResumeId();
    if (resumeId) {
      return of({ error: 'User already has a resume' } as any);
    }

    return this.http.post<IResume>(this.apiUrl, { resume }).pipe(
      tap((response) => {
        if (response.id) {
          localStorage.setItem(this.storageKey, response.id);
        }
      }),
      catchError(this.errorHandler.handleError)
    );
  }

  updateResume(resumeId: string, resume: IResume): Observable<IResume> {
    return this.http
      .put<IResume>(`${this.apiUrl}/${resumeId}`, resume)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getResumeById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getSavedResumeId(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  deleteResume(resumeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${resumeId}`).pipe(
      tap(() => localStorage.removeItem(this.storageKey)),
      catchError(this.errorHandler.handleError)
    );
  }
}
