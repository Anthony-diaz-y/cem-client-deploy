// Courses Module Types

export interface Review {
  rating?: number;
  ratingValue?: number;
  [key: string]: unknown;
}

export interface Course {
  id?: string;
  courseName: string;
  courseDescription: string;
  price: number;
  priceUSD?: number;
  thumbnail: string;
  instructor: {
    name: string;
    image?: string;
    additionalDetails: {
      professional_title?: string | null;
    };
  };
  instructors?: {
    name: string;
    image?: string;
    additionalDetails: {
      professional_title?: string | null;
    };
  }[];
  category: {
    id: string;
    name: string;
  }[];
  ratingAndReviews?: Review[] | unknown[];
  studentsEnrolled?: unknown[];
  totalDuration?: number;
  averageRating?: number;
  totalReviews?: number;
  totalStudentsEnrolled?: number;
  reviews?: Review[];
  ratings?: Review[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id?: string;
  _id?: string;
  name: string;
}
