import { Component, OnInit } from '@angular/core';
import { ResumeService } from '../../services/resume.service';
import { Resume } from '../../Abstracts/resume.interface';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ResumeFormService } from '../../services/resume-form.service';
import { ResumeListComponent } from "../resume-list/resume-list.component";

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


  constructor(private resumeFormService: ResumeFormService) {
    this.resumeForm = this.resumeFormService.createResumeForm();
  }
  
  ngOnInit(): void {
    // this.getResumes();
  }  

  postResume() {
      if (this.resumeForm.valid) {
        const formValue = this.resumeForm.value;
        console.log('Before format', formValue);

        const formattedResume = {
          ...formValue,
          // educations: formValue.certifications.map((edu: any) => ({ 
          //   institution: edu
          // }))
        };

        console.log('Payload sent:', formattedResume);
  
          this.resumeFormService.createResume(formattedResume).subscribe({
            next: (response) => {
              const id = response;
              const newResume: Resume = { id, ...formattedResume, };
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
