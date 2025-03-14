import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Resume, ResumeResponse } from '../Abstracts/resume.interface';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getResumes(): Observable<ResumeResponse> {
    return this.http.get<ResumeResponse>(this.apiUrl);
  }

  getResumeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateResume(resume: Resume): Observable<Resume> {
    console.log('Sending update request for ID:', resume.id);
    return this.http.put<Resume>(`${this.apiUrl}/${resume.id}`, resume);
  }

  deleteResume(id: string): Observable<void> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
