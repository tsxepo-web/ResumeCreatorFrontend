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
    certifications: any[];  // You can define a more specific type here if needed
    educations: any[];      // Same as above
    experiences: any[];     // Same as above
    skills: any[];          // Same as above
    templateStyle: string | null;
  }
  
  export interface ResumeResponse {
    resumes: Resume[];
  }
  