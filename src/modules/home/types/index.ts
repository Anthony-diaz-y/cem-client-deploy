// Home Module Types

export interface Course {
  _id: string;
  courseName: string;
  price: number;
  thumbnail: string;
  instructor: {
    firstName: string;
    lastName: string;
  };
  firstName: string;
  lastName: string;
  ratingAndReviews: unknown[];
  studentsEnrolled: unknown[];
}

export interface CategoryWithCourses {
  name: string;
  description?: string;
  courses: Course[];
}

export interface CatalogPageData {
  selectedCategory?: CategoryWithCourses;
  differentCategory?: CategoryWithCourses;
  mostSellingCourses?: Course[];
}

export interface HomeProps {
  backgroundImg: string | null;
  catalogPageData: CatalogPageData | null;
  token: string | null;
}

export interface CTAButtonType {
  active: boolean;
  linkto?: string;
  link?: string;
  btnText: string;
}

export interface CodeBlocksProps {
  position: string;
  heading: React.ReactNode;
  subheading: string;
  ctabtn1: CTAButtonType;
  ctabtn2: CTAButtonType;
  codeblock: string;
  backgroundGradient: string;
  codeColor: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  active?: boolean;
  linkto?: string;
}

export interface HighlightTextProps {
  text: string;
}

export interface ExploreCourseCard {
  heading: string;
  description: string;
  level: string;
  lessionNumber: number;
}

export interface HomePageExploreItem {
  tag: string;
  courses: ExploreCourseCard[];
}

export interface CourseCardProps {
  cardData: ExploreCourseCard;
  currentCard: string;
  setCurrentCard: (heading: string) => void;
}

export interface TimelineItem {
  Logo: string;
  heading: string;
  Description: string;
}
