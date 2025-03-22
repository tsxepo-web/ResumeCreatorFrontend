interface PersonalInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  linkedIn: string | null;
}

interface Education {
  institution: string | null;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
}

interface Experience {
  company: string | null;
  jobTitle: string | null;
  startDate: string | null;
  endDate: string | null;
  responsibilities: string | null;
}

interface Skill {
  name: string | null;
  proficiencyLevel: string | null;
}

interface Certification {
  name: string | null;
  authorizingBody: string | null;
  dateObtained: string | null;
}

export interface Resume {
  id?: string;
  personalInfo: PersonalInfo;
  educations: Education[];
  experiences: Experience[];
  skills: Skill[];
  certifications: Certification[];
  templateStyle: string;
}
