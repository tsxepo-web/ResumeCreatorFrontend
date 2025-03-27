import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private apiUrl = `${environment.apiUrl}/templates`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  /**
   * Fetches a list of available resume templates from the backend.
   * @returns An observable containing an array of template names.
   */
  getTemplates(): Observable<string[]> {
    return this.http
      .get<string[]>(this.apiUrl)
      .pipe(catchError(this.errorHandler.handleError));
  }

  /**
   * Fetches a preview URL for a given template.
   * @param templateName - The name of the template to preview.
   * @returns An observable containing the preview image or PDF URL.
   */
  getTemplatePreview(templateName: string): Observable<string> {
    return this.http
      .get<string>(`${this.apiUrl}/preview/${templateName}`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  /**
   * Applies a selected template to a resume.
   * @param resumeId - The ID of the resume.
   * @param templateName - The template name to apply.
   * @returns An observable confirming the template application.
   */
  applyTemplate(resumeId: string, templateName: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/apply`, { resumeId, templateName })
      .pipe(catchError(this.errorHandler.handleError));
  }
}
