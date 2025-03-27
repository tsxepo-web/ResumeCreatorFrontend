import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private fb: FormBuilder) {}

  createResumeForm(): FormGroup {
    return this.fb.group({
      basics: this.fb.group({
        name: [''],
        label: [''],
        image: [''],
        email: [''],
        phone: [''],
        url: [''],
        summary: [''],
        location: this.fb.group({
          address: [''],
          postalCode: [''],
          city: [''],
          countryCode: [''],
          region: [''],
        }),
        profiles: this.fb.array([]),
      }),
      work: this.fb.array([]),
      volunteer: this.fb.array([]),
      education: this.fb.array([]),
      awards: this.fb.array([]),
      certificates: this.fb.array([]),
      publications: this.fb.array([]),
      skills: this.fb.array([]),
      languages: this.fb.array([]),
      interests: this.fb.array([]),
      references: this.fb.array([]),
      projects: this.fb.array([]),
      renderLatex: [''],
    });
  }

  addItem(formArray: FormArray, type: string) {
    let newItem;
    switch (type) {
      case 'work':
        newItem = this.fb.group({
          name: [''],
          position: [''],
          url: [''],
          startDate: [''],
          endDate: [''],
          summary: [''],
          highlights: this.fb.array([]),
        });
        break;
      case 'volunteer':
        newItem = this.fb.group({
          organization: [''],
          position: [''],
          url: [''],
          startDate: [''],
          endDate: [''],
          summary: [''],
          highlights: this.fb.array([]),
        });
        break;
      case 'education':
        newItem = this.fb.group({
          institution: [''],
          url: [''],
          area: [''],
          studyType: [''],
          startDate: [''],
          endDate: [''],
          score: [null],
          courses: this.fb.array([]),
        });
        break;
      case 'awards':
        newItem = this.fb.group({
          title: [''],
          date: [''],
          awarder: [''],
          summary: [''],
        });
        break;
      case 'certificates':
        newItem = this.fb.group({
          name: [''],
          date: [''],
          issuer: [''],
          url: [''],
        });
        break;
      case 'publications':
        newItem = this.fb.group({
          name: [''],
          publisher: [''],
          releaseDate: [''],
          url: [''],
          summary: [''],
        });
        break;
      case 'skills':
        newItem = this.fb.group({
          name: [''],
          level: [''],
          keywords: this.fb.array([]),
        });
        break;
      case 'languages':
        newItem = this.fb.group({
          language: [''],
          fluency: [''],
        });
        break;
      case 'interests':
        newItem = this.fb.group({
          name: [''],
          keywords: this.fb.array([]),
        });
        break;
      case 'references':
        newItem = this.fb.group({
          name: [''],
          reference: [''],
        });
        break;
      case 'projects':
        newItem = this.fb.group({
          name: [''],
          startDate: [''],
          endDate: [''],
          description: [''],
          highlights: this.fb.array([]),
          url: [''],
        });
        break;
      case 'profiles':
        newItem = this.fb.group({
          network: [''],
          username: [''],
          url: [''],
        });
        break;
      default:
        newItem = this.fb.control('');
    }
    formArray.push(newItem);
  }

  getFormArray(form: FormGroup, key: string): FormArray {
    return form.get(key) as FormArray;
  }

  populateFormArray(formArray: FormArray, items: any[] = []) {
    formArray.clear();
    items.forEach((item) => {
      formArray.push(this.fb.group(item));
    });
  }

  removeItem(formArray: FormArray, index: number) {
    if (formArray.length > index) {
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
