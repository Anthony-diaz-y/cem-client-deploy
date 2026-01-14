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

// Subsection Discussion Types
export interface DiscussionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'Admin' | 'Instructor' | 'Student';
  image: string;
  additionalDetails?: Record<string, unknown>;
}

export interface SubsectionDiscussionReply {
  id: string;
  reply: string;
  discussionId: string;
  userId: string;
  user: DiscussionUser;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SubsectionDiscussion {
  id: string;
  question: string;
  subSectionId: string;
  userId: string;
  user: DiscussionUser;
  replies: SubsectionDiscussionReply[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DiscussionApiResponse {
  success: boolean;
  data: SubsectionDiscussion | SubsectionDiscussion[] | SubsectionDiscussionReply;
  message: string;
}