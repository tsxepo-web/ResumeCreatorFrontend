import { Component, OnInit } from '@angular/core';
import { ResumeService } from '../../services/resume.service';
import { Resume } from '../../Abstracts/resume.interface';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ResumeFormService } from '../../services/resume-form.service';
import { ResumeListComponent } from "../resume-list/resume-list.component";
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-create-resume',
  imports: [ReactiveFormsModule, NgFor, NgIf, ResumeListComponent, FormsModule],
  templateUrl: './create-resume.component.html',
  styleUrl: './create-resume.component.css'
})
export class CreateResumeComponent implements OnInit {
  resumeForm: FormGroup;
  resumes: Resume[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  showForm = false;
  resumeId: string | null = null
  currentResume: Resume | null = null;


  constructor(private resumeFormService: ResumeFormService) {
    this.resumeForm = this.resumeFormService.createResumeForm();
  }

  ngOnInit(): void {
    this.resumeId = this.resumeFormService.getSavedResumeId();
    if (this.resumeId) {
      this.loadResumeData(this.resumeId);
    } else {
      this.showForm = true;
    }
  }

  loadResumeData(resumeId: string) {
    this.resumeFormService.getResumeById(resumeId).pipe(
      tap((response) => {
        this.currentResume = response.resume;
        this.populateForm(this.currentResume!);
        this.showForm = true;
      }),
      catchError((error) => {
        this.errorMessage = 'Failed to load resume data.';
        console.log(error);
        return of(null);
      })
    ).subscribe();
  }

  populateForm(resume: Resume): void {
    this.resumeForm.patchValue({
      personalInfo: {
        name: resume.personalInfo.name || '',
        email: resume.personalInfo?.email || '',
        phone: resume.personalInfo?.phone || '',
        address: resume.personalInfo?.address || '',
        linkedIn: resume.personalInfo?.linkedIn || ''
      },
      templateStyle: resume.templateStyle || 'Modern',
    });

    this.resumeFormService.populateFormArray(this.certifications, resume.certifications || []);
    this.resumeFormService.populateFormArray(this.educations, resume.educations || []);
    this.resumeFormService.populateFormArray(this.experiences, resume.experiences || []);
    this.resumeFormService.populateFormArray(this.skills, resume.skills || []);
  }

  onSubmit() {
    if (this.currentResume) {
      this.updateResume();
    } else {
      this.postResume();
    }
  }

  postResume() {
    if (this.resumeFormService.getSavedResumeId()) {
      this.errorMessage = 'You can only create one resume!';
      return;
    }
    if (this.resumeForm.valid) {
      const formValue = this.resumeForm.value as Resume

      console.log('Payload sent:', formValue);

      this.resumeFormService.createResume(formValue).subscribe({
        next: (response) => {
          this.resumes.push(response);
          this.resetForm();
          this.successMessage = 'Resume created successfully!';
        },
        error: (error) => {
          console.log('Error updating resume:', error);
          this.errorMessage = error.error?.message || 'An unexpected error occurred. Please try again later.';

        }
      });
    } else {
      console.log('Form is invalid');
      this.errorMessage = 'Please fill in all required fields.';
    }
  }

  deleteResume() {
    const resumeId = this.resumeFormService.getSavedResumeId();
    if (!resumeId) {
      this.errorMessage = 'Resume ID not found.';
      return;
    }
  
    this.resumeFormService.deleteResume(resumeId).pipe(
      tap(() => {
        this.resumes.filter(resume => resume.id !== resumeId);
        this.successMessage = 'Resume deleted successfully!';
      }),
      catchError((error) => {
        this.errorMessage = 'Failed to delete resume';
        console.error('Error deleting resume:', error);
        return of(null);
      })
    ).subscribe();
  }

  updateResume(): void {
    if (this.resumeForm.valid && this.resumeId) {
      const updatedResume: Resume = { 
        id: this.resumeId, ...this.resumeForm.value, 
      };

      this.resumeFormService.updateResume(this.resumeId, updatedResume).subscribe({
        next: (response) => {
          this.successMessage = 'Resume updated successfully!';
          this.currentResume = response;
        },
        error: (error) => {
          console.error('Error updating resume:', error);
          this.errorMessage = 'Failed to update resume';
        }
        });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }
  
  toggleForm() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.resumeForm = this.resumeFormService.createResumeForm();
    } else {
      this.resetForm();
    }
  }

  get certifications(): FormArray {
    return this.resumeFormService.getFormArray(this.resumeForm, 'certifications') as FormArray;
  }

  get educations(): FormArray {
    return this.resumeFormService.getFormArray(this.resumeForm, 'educations') as FormArray;
  }
  get experiences(): FormArray {
    return this.resumeFormService.getFormArray(this.resumeForm, 'experiences') as FormArray;
  }
  get skills(): FormArray {
    return this.resumeFormService.getFormArray(this.resumeForm, 'skills') as FormArray;
  }

  addCertification() {
    this.resumeFormService.addItem(this.certifications, 'certifications');
  }

  removeCertification(index: number) {
    this.resumeFormService.removeItem(this.certifications, index);
  }


  addEducation() {
    this.resumeFormService.addItem(this.educations, 'educations');
  }

  removeEducation(index: number) {
    this.resumeFormService.removeItem(this.educations, index);
  }


  addExperience() {
    this.resumeFormService.addItem(this.experiences, 'experiences');
  }

  removeExperience(index: number) {
    this.resumeFormService.removeItem(this.experiences, index);
  }


  addSkill() {
    this.resumeFormService.addItem(this.skills, 'skills');
  }

  removeSkill(index: number) {
    this.resumeFormService.removeItem(this.skills, index);
  }

  resetForm() {
    this.resumeForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }
  
}
