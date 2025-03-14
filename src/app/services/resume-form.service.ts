import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Resume } from '../Abstracts/resume.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeFormService {
  private apiUrl = environment.apiUrl;
  
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  createResumeForm(): FormGroup {
    return this.fb.group({
      personalInfo: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
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
        newItem = this.fb.group({ jobitle: '', company: '', responsibility: '' });
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

  resetForm(form: FormGroup) {
    form.reset();
  }
  
  createResume(newResume: Resume): Observable<Resume> {
    return this.http.post<Resume>(this.apiUrl, newResume);
  }
}
