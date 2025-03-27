import { Component, OnInit } from '@angular/core';
import { ResumeService } from '../../services/resume.service';
import {
  IAward,
  ICertificate,
  IEducation,
  IInterest,
  ILanguage,
  IProject,
  IPublication,
  IReference,
  IResume,
  ISkill,
  IVolunteerExperience,
  IWorkExperience,
} from '../../Abstracts/resume.interface';
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
  selector: 'app-resume',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, FormsModule],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css',
})
export class ResumeComponent implements OnInit {
  resumeForm: FormGroup;
  resumes: IResume[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  showForm = false;
  resumeId: string | null = null;
  currentResume: IResume | null = null;

  constructor(
    private formService: FormService,
    private resumeService: ResumeService,
    private errorHandleService: ErrorHandlerService
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
    console.log('Reloading page...');
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

  populateForm(resume: IResume): void {
    this.resumeForm.patchValue({
      basics: {
        name: resume.basics?.name || '',
        label: resume.basics?.label || '',
        image: resume.basics?.image || '',
        email: resume.basics?.email || '',
        phone: resume.basics?.phone || '',
        url: resume.basics?.url || '',
        summary: resume.basics?.summary || '',
        location: {
          address: resume.basics?.location?.address || '',
          postalCode: resume.basics?.location?.postalCode || '',
          city: resume.basics?.location?.city || '',
          countryCode: resume.basics?.location?.countryCode || '',
          region: resume.basics?.location?.region || '',
        },
      },
      renderLatex: resume.renderLatex || '',
    });

    this.formService.populateFormArray(this.work, resume.work || []);
    this.formService.populateFormArray(this.volunteer, resume.volunteer || []);
    this.formService.populateFormArray(this.education, resume.education || []);
    this.formService.populateFormArray(this.awards, resume.awards || []);
    this.formService.populateFormArray(
      this.certificates,
      resume.certificates || []
    );
    this.formService.populateFormArray(
      this.publications,
      resume.publications || []
    );
    this.formService.populateFormArray(this.skills, resume.skills || []);
    this.formService.populateFormArray(this.languages, resume.languages || []);
    this.formService.populateFormArray(this.interests, resume.interests || []);
    this.formService.populateFormArray(
      this.references,
      resume.references || []
    );
    this.formService.populateFormArray(this.projects, resume.projects || []);
    this.formService.populateFormArray(
      this.profiles,
      resume.basics?.profiles || []
    );
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

    const formValue = this.resumeForm.value as IResume;

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

    this.resumeService
      .deleteResume(resumeId)
      .pipe(
        tap(() => {
          this.resumes.filter((resume) => resume.id !== resumeId);
          this.successMessage = 'Resume deleted successfully!';
        }),
        catchError((error) => {
          this.errorHandleService.handleError(error);
          return of(null);
        })
      )
      .subscribe();
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

    const updatedResume: IResume = {
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

  get education(): FormArray {
    return this.formService.getFormArray(
      this.resumeForm,
      'education'
    ) as FormArray;
  }

  get work(): FormArray {
    return this.formService.getFormArray(this.resumeForm, 'work') as FormArray;
  }

  get volunteer(): FormArray {
    return this.formService.getFormArray(
      this.resumeForm,
      'volunteer'
    ) as FormArray;
  }

  get skills(): FormArray {
    return this.formService.getFormArray(
      this.resumeForm,
      'skills'
    ) as FormArray;
  }

  get languages(): FormArray {
    return this.formService.getFormArray(
      this.resumeForm,
      'languages'
    ) as FormArray;
  }

  get interests(): FormArray {
    return this.formService.getFormArray(
      this.resumeForm,
      'interests'
    ) as FormArray;
  }

  get references(): FormArray {
    return this.formService.getFormArray(
      this.resumeForm,
      'references'
    ) as FormArray;
  }

  get projects(): FormArray {
    return this.formService.getFormArray(
      this.resumeForm,
      'projects'
    ) as FormArray;
  }

  addCertificate() {
    this.formService.addItem(this.certificates, 'certificates');
  }

  removeCertificate(index: number) {
    this.formService.removeItem(this.certificates, index);
  }

  get certificates(): FormArray {
    return this.formService.getFormArray(
      this.resumeForm,
      'certificates'
    ) as FormArray;
  }

  addEducation() {
    this.formService.addItem(this.education, 'education');
  }

  removeEducation(index: number) {
    this.formService.removeItem(this.education, index);
  }

  addWorkExperience() {
    this.formService.addItem(this.work, 'work');
  }

  removeWorkExperience(index: number) {
    this.formService.removeItem(this.work, index);
  }

  addVolunteerExperience() {
    this.formService.addItem(this.volunteer, 'volunteer');
  }

  removeVolunteerExperience(index: number) {
    this.formService.removeItem(this.volunteer, index);
  }

  addAward() {
    this.formService.addItem(this.awards, 'awards');
  }

  removeAward(index: number) {
    this.formService.removeItem(this.awards, index);
  }

  get awards(): FormArray {
    return this.formService.getFormArray(
      this.resumeForm,
      'awards'
    ) as FormArray;
  }

  addPublication() {
    this.formService.addItem(this.publications, 'publications');
  }

  removePublication(index: number) {
    this.formService.removeItem(this.publications, index);
  }
  get publications(): FormArray {
    return this.formService.getFormArray(
      this.resumeForm,
      'publications'
    ) as FormArray;
  }

  addSkill() {
    this.formService.addItem(this.skills, 'skills');
  }

  removeSkill(index: number) {
    this.formService.removeItem(this.skills, index);
  }

  addLanguage() {
    this.formService.addItem(this.languages, 'languages');
  }

  removeLanguage(index: number) {
    this.formService.removeItem(this.languages, index);
  }

  addInterest() {
    this.formService.addItem(this.interests, 'interest');
  }

  removeInterest(index: number) {
    this.formService.removeItem(this.interests, index);
  }

  addReference() {
    this.formService.addItem(this.references, 'references');
  }

  removeReference(index: number) {
    this.formService.removeItem(this.references, index);
  }

  addProject() {
    this.formService.addItem(this.projects, 'projects');
  }

  removeProject(index: number) {
    this.formService.removeItem(this.projects, index);
  }

  addProfile() {
    const basics = this.resumeForm.get('basics') as FormGroup;
    const profilesArray = basics?.get('profiles') as FormArray;
    if (!profilesArray) {
      return;
    }
    this.formService.addItem(profilesArray, 'profiles');
  }

  removeProfile(index: number) {
    this.formService.removeItem(this.profiles, index);
  }

  get profiles(): FormArray {
    const profileArray = (this.resumeForm.get('basics') as FormGroup).get(
      'profiles'
    ) as FormArray;
    return profileArray;
  }

  addWork() {
    this.formService.addItem(this.work, 'work');
  }

  removeWork(index: number) {
    this.formService.removeItem(this.work, index);
  }

  resetForm() {
    this.resumeForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }
}
