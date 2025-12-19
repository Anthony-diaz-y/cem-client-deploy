// Contact Module Types

export interface ContactFormData {
  firstname: string;
  lastname?: string;
  email: string;
  countrycode?: string;
  phoneNo?: string;
  subject?: string;
  message: string;
}

export interface ContactDetail {
  icon: string;
  heading: string;
  description: string;
  details: string;
}
