import { Component, OnInit } from '@angular/core';
import { ResumeService } from '../../services/resume.service';
import { Resume } from '../../Abstracts/resume.interface';
import {
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { FormService } from '../../services/form.service';
import { catchError, of, tap } from 'rxjs';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-create-resume',
  imports: [ReactiveFormsModule, NgFor, NgIf, FormsModule],
  templateUrl: './create-resume.component.html',
  styleUrl: './create-resume.component.css',
})
export class CreateResumeComponent implements OnInit {
  resumeForm: FormGroup;
  resumes: Resume[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  showForm = false;
  resumeId: string | null = null;
  currentResume: Resume | null = null;

  constructor(
    private formService: FormService,
    private resumeService: ResumeService,
    private errorHandleService: ErrorHandlerService // private location: Location
  ) {
    this.resumeForm = this.formService.createResumeForm();
  }

  ngOnInit(): void {
    this.resumeId = this.resumeService.getSavedResumeId();
    if (this.resumeId) {
      this.loadResumeData(this.resumeId);
    } else {
      this.showForm = true;
    }
  }

  onSubmit() {
    if (this.currentResume) {
      this.updateResume();
    } else {
      this.postResume();
    }
  }

  reloadPage() {
    console.log('Reloading...');
    window.location.reload();
  }

  loadResumeData(resumeId: string) {
    this.resumeService
      .getResumeById(resumeId)
      .pipe(
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
      )
      .subscribe();
  }

  populateForm(resume: Resume): void {
    this.resumeForm.patchValue({
      personalInfo: {
        name: resume.personalInfo.name || '',
        email: resume.personalInfo?.email || '',
        phone: resume.personalInfo?.phone || '',
        address: resume.personalInfo?.address || '',
        linkedIn: resume.personalInfo?.linkedIn || '',
      },
      templateStyle: resume.templateStyle || 'Modern',
    });

    this.formService.populateFormArray(
      this.certifications,
      resume.certifications || []
    );
    this.formService.populateFormArray(
      this.educations,
      resume.educations || []
    );
    this.formService.populateFormArray(
      this.experiences,
      resume.experiences || []
    );
    this.formService.populateFormArray(this.skills, resume.skills || []);
  }

  postResume() {
    if (this.resumeService.getSavedResumeId()) {
      this.errorMessage = 'You can only create one resume!';
      return;
    }
    if (!this.resumeForm.valid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const formValue = this.resumeForm.value as Resume;

    console.log('Testing');
    this.resumeService
      .createResume(formValue)
      .pipe(
        tap((response) => {
          this.resumes.push(response);
          this.resetForm();
          this.successMessage = 'Resume created successfully!';
          this.reloadPage();
        }),
        catchError((error) => {
          this.errorHandleService.handleError(error);
          return of(null);
        })
      )
      .subscribe();
  }

  deleteResume() {
    const resumeId = this.resumeService.getSavedResumeId();
    if (!resumeId) {
      this.errorMessage = 'Resume ID not found.';
      return;
    }

    this.resumeService.deleteResume(resumeId).pipe(
      tap(() => {
        this.resumes.filter((resume) => resume.id !== resumeId);
        this.successMessage = 'Resume deleted successfully!';
      }),
      catchError((error) => this.errorHandleService.handleError(error))
    );
  }

  updateResume(): void {
    const validationError = this.errorHandleService.validateUpdateResume(
      this.resumeForm,
      this.resumeId!
    );
    if (validationError) {
      this.errorHandleService.handleError(validationError);
      return;
    }

    const updatedResume: Resume = {
      id: this.resumeId,
      ...this.resumeForm.value,
    };

    this.resumeService
      .updateResume(this.resumeId!, updatedResume)
      .pipe(
        tap((response) => {
          this.successMessage = 'Resume updated successfully!';
          this.currentResume = response;
        }),
        catchError((error) => {
          return this.errorHandleService.handleError(error);
        })
      )
      .subscribe();
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.resumeForm = this.formService.createResumeForm();
    } else {
      this.resetForm();
    }
  }

  get certifications(): FormArray {
    return this.formService.getFormArray(
      this.resumeForm,
      'certifications'
    ) as FormArray;
  }

  get educations(): FormArray {
    return this.formService.getFormArray(
      this.resumeForm,
      'educations'
    ) as FormArray;
  }
  get experiences(): FormArray {
    return this.formService.getFormArray(
      this.resumeForm,
      'experiences'
    ) as FormArray;
  }
  get skills(): FormArray {
    return this.formService.getFormArray(
      this.resumeForm,
      'skills'
    ) as FormArray;
  }

  addCertification() {
    this.formService.addItem(this.certifications, 'certifications');
  }

  removeCertification(index: number) {
    this.formService.removeItem(this.certifications, index);
  }

  addEducation() {
    this.formService.addItem(this.educations, 'educations');
  }

  removeEducation(index: number) {
    this.formService.removeItem(this.educations, index);
  }

  addExperience() {
    this.formService.addItem(this.experiences, 'experiences');
  }

  removeExperience(index: number) {
    this.formService.removeItem(this.experiences, index);
  }

  addSkill() {
    this.formService.addItem(this.skills, 'skills');
  }

  removeSkill(index: number) {
    this.formService.removeItem(this.skills, index);
  }

  resetForm() {
    this.resumeForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }
}
