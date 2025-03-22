import { Component, NgModule, OnInit } from '@angular/core';
import { ResumeService } from '../../services/resume.service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
// import { Resume, ResumeResponse } from '../../Abstracts/resume.interface';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, FormsModule],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css'
})
export class ResumeComponent implements OnInit{
  // resumes: Resume[] = [];
  // editingResumeId: string | null = null;
  // resumeForm: FormGroup;
  // successMessage: string = '';
  // errorMessage: string = '';


  // constructor(private resumeService: ResumeService, private fb: FormBuilder) { 
  //   this.resumeForm = this.fb.group({
  //     personalInfo: this.fb.group({
  //       name: ['', Validators.required],
  //       email: ['', [Validators.required, Validators.email]],
  //       phone: ['', Validators.required],
  //       address: [''],
  //       linkedIn: ['']
  //     }),
  //     certifications: this.fb.array([]),
  //     educations: this.fb.array([]),
  //     experiences: this.fb.array([]),
  //     skills: this.fb.array([]),
  //     templateStyle: ['']
  //   });
  // }
  
  ngOnInit(): void {
    // this.getResumes();
  }
  // getResumes() {
  //   this.resumeService.getResumes().subscribe((data) => {
  //     this.resumes = data.resumes;
  //     console.log('Resumes loaded:', this.resumes);
  //   });
  // }

  

  // deleteResume(id: string | null) {
  //   if (!id) return;

  // if (confirm('Are you sure you want to delete this resume?')) {
  //   this.resumeService.deleteResume(id).subscribe({
  //     next: () => {
  //       console.log('Resume deleted successfully');
  //       this.resumes = this.resumes.filter(resume => resume.id !== id);
  //     },
  //     error: (err) => console.error('Error deleting resume:', err)
  //   });
  // }
  // }

  // putResume(resume: Resume) {
  //   this.editingResumeId = resume.id;
  //   this.resumeForm.patchValue(resume);
  //   console.log('Updating resume with ID:', this.editingResumeId);
  
  //   console.log('Form populated with: ', resume);
  // }

  // updateResume() {
  //   if (this.resumeForm.valid && this.editingResumeId) {
  //     console.log('Saving updated resume:', this.editingResumeId);
  //     const updatedResume = { id: this.editingResumeId, ...this.resumeForm.value };
  
  
  //     this.resumeService.updateResume(updatedResume).subscribe({
  //       next: () => {
  //         console.log('Resume updated successfully');
  //         this.getResumes();
  //         this.editingResumeId = null;
  //         this.successMessage = 'Resume updated successfully!';
  //       },
  //       error: (error) => console.error('Error updating resume:', error)
  //     });
  //   }
  // }

  
}
