// Student Module Types

export interface SubSection {
  _id: string;
  [key: string]: unknown;
}

export interface Section {
  _id: string;
  subSection: SubSection[];
  [key: string]: unknown;
}

export interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  thumbnail: string;
  totalDuration: string;
  progressPercentage: number;
  courseContent: Section[];
}
