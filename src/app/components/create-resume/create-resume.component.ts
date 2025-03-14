import { Component, OnInit } from '@angular/core';
import { ResumeService } from '../../services/resume.service';
import { Resume } from '../../Abstracts/resume.interface';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ResumeFormService } from '../../services/resume-form.service';
import { ResumeListComponent } from "../resume-list/resume-list.component";

@Component({
  selector: 'app-create-resume',
  imports: [ReactiveFormsModule, NgFor, NgIf, ResumeListComponent],
  templateUrl: './create-resume.component.html',
  styleUrl: './create-resume.component.css'
})
export class CreateResumeComponent implements OnInit {
  resumeForm: FormGroup;
  resumes: Resume[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private resumeFormService: ResumeFormService, private resumeService: ResumeService) {
    this.resumeForm = this.resumeFormService.createResumeForm();
  }

  ngOnInit(): void {
    // this.getResumes();
  }

  
  
  postResume() {
      if (this.resumeForm.valid) {
        const formValue = this.resumeForm.value;
  
          this.resumeFormService.createResume(formValue).subscribe({
            next: (response) => {
              const id = response;
              const newResume: Resume = {
                id: id,
                ...formValue
              }
              this.resumes.push(newResume);
              this.resetForm();
              this.successMessage = 'Resume created successfully!';
            },
            error: (error) => {
              console.log('Error updating resume:', error);
            }
          });
      } else {
        console.log('Form is invalid');
        this.errorMessage = 'Please fill in all required fields.';
      }
  }

  
  

  get certifications(): FormArray {
    return this.resumeForm.get('certifications') as FormArray;
  }

  get educations(): FormArray {
    return this.resumeFormService.getFormArray(this.resumeForm, 'educations');
  }
  get experiences(): FormArray {
    return this.resumeFormService.getFormArray(this.resumeForm, 'experiences');
  }
  get skills(): FormArray {
    return this.resumeFormService.getFormArray(this.resumeForm, 'skills');
  }

  addCertification() {
    this.resumeFormService.addItem(this.certifications);
  }

  removeCertification(index: number) {
    this.resumeFormService.removeItem(this.certifications, index);
  }


  addEducation() {
    this.resumeFormService.addItem(this.educations);
  }

  removeEducation(index: number) {
    this.resumeFormService.removeItem(this.educations, index);
  }


  addExperience() {
    this.resumeFormService.addItem(this.experiences);
  }

  removeExperience(index: number) {
    this.resumeFormService.removeItem(this.experiences, index);
  }


  addSkill() {
    this.resumeFormService.addItem(this.skills);
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
