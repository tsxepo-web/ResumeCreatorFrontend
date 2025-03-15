import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { Resume } from '../../Abstracts/resume.interface';
import { NgFor, NgIf } from '@angular/common';
import { ResumeService } from '../../services/resume.service';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResumeFormService } from '../../services/resume-form.service';

@Component({
  selector: 'app-resume-list',
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './resume-list.component.html',
  styleUrl: './resume-list.component.css'
})
export class ResumeListComponent implements OnInit{
  resumes: Resume[] = [];
  editingResumeId: any;
  resumeForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private resumeService: ResumeService, private resumeFormService: ResumeFormService) { 
    this.resumeForm = this.resumeFormService.createResumeForm();
  }
  
  ngOnInit(): void {
    this.getResumes();
  }

  getResumes() {
    this.resumeService.getResumes().subscribe((data) => {
      this.resumes = data.resumes;
      console.log('Resumes loaded:', this.resumes);
    });
  }

  editResume(resume: Resume) {
    this.editingResumeId = resume.id;
  
    this.resumeForm.patchValue({
      personalInfo: resume.personalInfo,
      templateStyle: resume.templateStyle
    });
    this.resumeFormService.updateFormArray(this.certifications, resume.certifications, { name: '', authorizingBody: '', dateObtained: '' });
    this.resumeFormService.updateFormArray(this.educations, resume.educations, { institution: '', degree: '' });
    this.resumeFormService.updateFormArray(this.experiences, resume.experiences, { jobTitle: '', company: '', responsibility: '' });
    this.resumeFormService.updateFormArray(this.skills, resume.skills, { name: '' });
  }

  updateResume(resume: Resume) {
    if (!this.editingResumeId) return;

    const updatedResume = {
      id: this.editingResumeId,
      personalInfo: this.resumeForm.value.personalInfo,
      templateStyle: this.resumeForm.value.templateStyle,
      certifications: this.certifications.value,
      educations: this.educations.value,
      experiences: this.experiences.value,
      skills: this.skills.value
    }

    this.resumeService.updateResume(updatedResume).subscribe({
      next: () => {
        console.log('Resume updated successfully');
        this.getResumes();
        this.editingResumeId = null;
      },
      error: (error) => console.error('Error updating resume:', error)
    });
  }

  deleteResume(id: string) {
    if (confirm('Are you sure you want to delete this resume?')) {
      this.resumeService.deleteResume(id).subscribe({
        next: () => {
          console.log('Resume deleted successfully');
          this.resumes = this.resumes.filter(resume => resume.id !== id);
        },
        error: (err) => console.error('Error deleting resume:', err)
      });
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
