import type { CourseReview } from "./course.types";

export type { CourseReview };

export interface CreateReviewRequest {
  courseId: string;
  rating: number;
  review: string;
}

export interface UpdateReviewRequest {
  rating: number;
  review: string;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: CourseReview;
}

export interface DeleteReviewResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    rating: number;
    review: string;
    userId: string;
    courseId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}
