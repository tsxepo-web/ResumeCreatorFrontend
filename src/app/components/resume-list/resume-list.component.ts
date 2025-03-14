import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { Resume } from '../../Abstracts/resume.interface';
import { NgFor, NgIf } from '@angular/common';
import { ResumeService } from '../../services/resume.service';
import { FormArray, FormGroup, FormsModule } from '@angular/forms';
import { ResumeFormService } from '../../services/resume-form.service';

@Component({
  selector: 'app-resume-list',
  imports: [NgFor, NgIf, FormsModule],
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

  updateResume(resume: Resume) {
    this.resumeService.updateResume(resume).subscribe({
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
    return this.resumeFormService.getFormArray(this.resumeForm, 'educations');
  }
  get experiences(): FormArray {
    return this.resumeFormService.getFormArray(this.resumeForm, 'experiences');
  }
  get skills(): FormArray {
    return this.resumeFormService.getFormArray(this.resumeForm, 'skills');
  }

  addCertification(resume: Resume) {
    // this.resumeFormService.addItem(this.certifications);
    resume.certifications.push('');
  }

  removeCertification(index: number) {
    this.resumeFormService.removeItem(this.certifications, index);
  }


  addEducation(resume: Resume) {
    // this.resumeFormService.addItem(this.educations);
    resume.educations.push('');

  }

  removeEducation(index: number) {
    this.resumeFormService.removeItem(this.educations, index);
  }


  addExperience(resume: Resume) {
    // this.resumeFormService.addItem(this.experiences);
    resume.experiences.push('');

  }

  removeExperience(index: number) {
    this.resumeFormService.removeItem(this.experiences, index);
  }


  addSkill(resume: Resume) {
    // this.resumeFormService.addItem(this.skills);
    resume.skills.push('');

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
