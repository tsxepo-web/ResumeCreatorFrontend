export interface IResume {
  id?: string;
  renderLatex: string;
  basics: IBasics;
  work: IWorkExperience[];
  volunteer: IVolunteerExperience[];
  education: IEducation[];
  awards: IAward[];
  certificates: ICertificate[];
  publications: IPublication[];
  skills: ISkill[];
  languages: ILanguage[];
  interests: IInterest[];
  references: IReference[];
  projects: IProject[];
}

export interface IBasics {
  name?: string;
  label?: string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: ILocation;
  profiles?: IProfile[];
}

export interface ILocation {
  address?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
  region?: string;
}

export interface IProfile {
  network?: string;
  username?: string;
  url?: string;
}

export interface IWorkExperience {
  name?: string;
  position?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface IVolunteerExperience {
  organization?: string;
  position?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface IEducation {
  institution?: string;
  url?: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  score?: number;
  courses?: string[];
}

export interface IAward {
  title?: string;
  date?: string;
  awarder?: string;
  summary?: string;
}

export interface ICertificate {
  name?: string;
  date?: string;
  issuer?: string;
  url?: string;
}

export interface IPublication {
  name?: string;
  publisher?: string;
  releaseDate?: string;
  url?: string;
  summary?: string;
}

export interface ISkill {
  name?: string;
  level?: string;
  keywords?: string[];
}

export interface ILanguage {
  language?: string;
  fluency?: string;
}

export interface IInterest {
  name?: string;
  keywords?: string[];
}

export interface IReference {
  name?: string;
  reference?: string;
}

export interface IProject {
  name?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  highlights?: string[];
  url?: string;
}
