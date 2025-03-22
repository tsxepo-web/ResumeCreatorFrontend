import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Resume } from '../Abstracts/resume.interface';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = environment.apiUrl;
  private readonly resumeKey = 'resume_uuid';

  constructor(private http: HttpClient) { }

  getResumes(): Observable<Resume> {
    return this.http.get<Resume>(this.apiUrl);
  }

 

  // deleteResume(id: string): Observable<void> {
  //   return this.http.delete<any>(`${this.apiUrl}/${id}`);
  // }
}
