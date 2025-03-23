import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private fb: FormBuilder) {}

  createResumeForm(): FormGroup {
    return this.fb.group({
      personalInfo: this.fb.group({
        name: [''],
        email: [''],
        phone: [''],
        address: [''],
        linkedIn: [''],
      }),
      certifications: this.fb.array([]),
      educations: this.fb.array([]),
      experiences: this.fb.array([]),
      skills: this.fb.array([]),
      templateStyle: [''],
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
        newItem = this.fb.group({
          name: '',
          authorizingBody: '',
          dateObtained: '',
        });
        break;
      case 'educations':
        newItem = this.fb.group({
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
        });
        break;
      case 'experiences':
        newItem = this.fb.group({
          jobTitle: '',
          company: '',
          responsibilities: '',
          startDate: '',
          endDate: '',
        });
        break;
      case 'skills':
        newItem = this.fb.group({ name: '', proficiencyLevel: '' });
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
    values.forEach((value) =>
      formArray.push(this.fb.group(value || defaultValue))
    );
  }
}
