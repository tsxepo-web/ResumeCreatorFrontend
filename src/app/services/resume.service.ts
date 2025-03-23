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

  constructor(private http: HttpClient) { }

  getResumes(): Observable<Resume> {
    return this.http.get<Resume>(this.apiUrl);
  }

}
