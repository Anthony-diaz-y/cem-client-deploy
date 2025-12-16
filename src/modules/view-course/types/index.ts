// View Course Module Types

export interface CompletedLecture {
  courseId: string
  lectureId: string
}

export interface ViewCourseState {
  courseSectionData: Section[]
  courseEntireData: Course
  completedLectures: string[]
  totalNoOfLectures: number
}

export interface Section {
  _id: string
  sectionName: string
  subSection: SubSection[]
}

export interface SubSection {
  _id: string
  title: string
  description: string
  videoUrl: string
  timeDuration?: string
}

export interface Course {
  _id: string
  courseName: string
  courseDescription: string
  instructor: {
    _id: string
    firstName: string
    lastName: string
  }
  thumbnail: string
  price: number
  courseContent: Section[]
}

export interface VideoDetailsReviewModalProps {
  setReviewModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ReviewFormData {
  courseExperience: string;
  courseRating: number;
}