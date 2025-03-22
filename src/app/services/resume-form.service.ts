import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Resume } from '../Abstracts/resume.interface';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeFormService {
  private apiUrl = environment.apiUrl;
  private storageKey = 'resumeId';
  
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  createResumeForm(): FormGroup {
    return this.fb.group({
      personalInfo: this.fb.group({
        name: [''],
        email: [''],
        phone: [''],
        address: [''],
        linkedIn: ['']
      }),
      certifications: this.fb.array([]),
      educations: this.fb.array([]),
      experiences: this.fb.array([]),
      skills: this.fb.array([]),
      templateStyle: ['']
    });
  }

  populateFormArray(formArray: FormArray, items: any[] = []) {
    formArray.clear();
    items.forEach((item) => {
      formArray.push(this.fb.group(item));
    });
  }

  getFormArray(form: FormGroup, key: string): FormArray {
    return form.get(key) as FormArray;
  }

  addItem(formArray: FormArray, type: string) {
    let newItem;
  
    switch (type) {
      case 'certifications':
        newItem = this.fb.group({ name: '' });
        break;
      case 'educations':
        newItem = this.fb.group({
          institution: '',
          degree: '',
        });
        break;
      case 'experiences':
        newItem = this.fb.group({ jobTitle: '', company: '', responsibility: '' });
        break;
      case 'skills':
        newItem = this.fb.group({ name: ''});
        break;
      default:
        newItem = this.fb.control('');
    }

    formArray.push(newItem);
  }

  removeItem(formArray: FormArray, index: number) {
    if (formArray && formArray.length > index) {
      formArray.removeAt(index);
    }
  }

  updateFormArray(formArray: FormArray, values: any[], defaultValue: any) {
    formArray.clear();
    values.forEach(value => formArray.push(this.fb.group(value || defaultValue)));
  }
  
  createResume(resume: Resume): Observable<Resume> {
    const resumeId = this.getSavedResumeId();
    if (resumeId) {
      return new Observable(observer => {
        observer.error(new Error('User already has a resume'));
      });
    }

    return this.http.post<Resume>(this.apiUrl, { resume }).pipe(
      tap((response) => {
        if (response.id) {
          localStorage.setItem(this.storageKey, response.id);
        }
      })
    );
  }

  updateResume(resumeId: string, resume: Resume): Observable<Resume> {
    return this.http.put<Resume>(`${this.apiUrl}/${resumeId}`, resume);
  }

  getResumeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getSavedResumeId(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  deleteResume(resumeId: string): Observable<void> {
    return new Observable(observer => {
      this.http.delete<void>(`${this.apiUrl}/${resumeId}`).subscribe({
        next: () => {
          localStorage.removeItem(this.storageKey);
          observer.next();
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}
