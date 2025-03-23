import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = `Error ${error.status}: ${
          error.error?.message || error.statusText
        }`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('Error occurred:', error);
    return throwError(() => new Error(errorMessage));
  }

  validateUpdateResume(resumeForm: FormGroup, resumeId: string): string | null {
    if (!resumeForm.valid) {
      return 'Please fill in all required fields.';
    }
    if (!resumeId) {
      return 'Resume ID is missing!';
    }
    return null;
  }
}
