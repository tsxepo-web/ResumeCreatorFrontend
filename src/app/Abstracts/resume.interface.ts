export interface PersonalInfo {
    name: string | null;
    email: string | null;
    address?: string | null;
    phone?: string | null;
    linkedIn?: string | null;
  }
  
  export interface Resume {
    id: string;
    personalInfo: PersonalInfo;
    certifications: [];
    educations: [];
    experiences: [];
    skills: [];
    templateStyle: string | null;
  }
  
  export interface ResumeResponse {
    resumes: Resume[];
  }
  