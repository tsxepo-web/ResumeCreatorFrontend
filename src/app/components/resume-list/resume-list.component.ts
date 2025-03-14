import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { Resume } from '../../Abstracts/resume.interface';
import { NgFor, NgIf } from '@angular/common';
import { ResumeService } from '../../services/resume.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resume-list',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './resume-list.component.html',
  styleUrl: './resume-list.component.css'
})
export class ResumeListComponent implements OnInit{
  resumes: Resume[] = [];
editingResumeId: any;

  constructor(private resumeService: ResumeService) { }
  
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

}
