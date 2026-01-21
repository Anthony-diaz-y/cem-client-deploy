export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface CourseCategory {
  id?: string;
  _id?: string;
  name: string;
}

export interface FullCourseDetailsResponse {
  courseDetails: {
    courseName: string;
    courseContent?: Array<{
      _id?: string;
      id?: string;
      sectionName: string;
      subSection?: Array<unknown>;
      subSections?: Array<unknown>;
      createdAt?: string;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  };
  completedVideos?: string[];
  [key: string]: unknown;
}

export interface InstructorCourse {
  id?: string;
  _id?: string;
  [key: string]: unknown;
}

