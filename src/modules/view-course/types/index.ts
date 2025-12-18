// View Course Module Types

export interface SidebarHeaderProps {
  courseName?: string;
  completedLectures: string[];
  totalNoOfLectures: number;
  onReviewClick: () => void;
}

export interface SidebarSectionListProps {
  courseSectionData: Section[];
  courseId?: string;
  activeStatus: string;
  videoBarActive: string;
  completedLectures: string[];
  onSectionClick: (sectionId: string) => void;
  onSubSectionClick: (sectionId: string, subSectionId: string) => void;
}

export interface CompletedLecture {
  courseId: string;
  lectureId: string;
}

export interface ViewCourseState {
  courseSectionData: Section[];
  courseEntireData: Course;
  completedLectures: string[];
  totalNoOfLectures: number;
}

export interface Section {
  _id: string;
  sectionName: string;
  subSection: SubSection[];
}

export interface SubSection {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  timeDuration?: string;
}

export interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  instructor: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  thumbnail: string;
  price: number;
  courseContent: Section[];
}

export interface VideoDetailsReviewModalProps {
  setReviewModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface VideoDetailsSidebarProps {
  setReviewModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface VideoPlayerProps {
  videoData: SubSection | null;
  previewSource: string;
  videoEnded: boolean;
  playerRef: React.RefObject<{ seek: (time: number) => void } | null>;
  onVideoEnd: () => void;
  onMarkComplete: () => void;
  onRewatch: () => void;
  onNext: () => void;
  onPrev: () => void;
  loading: boolean;
  isCompleted: boolean;
  isFirst: boolean;
  isLast: boolean;
  nextVideoInfo?: { 
    nextSectionName?: string; 
    nextLectureTitle?: string; 
    isNextSection: boolean;
  } | null;
}

export interface ReviewFormData {
  courseExperience: string;
  courseRating: number;
}
