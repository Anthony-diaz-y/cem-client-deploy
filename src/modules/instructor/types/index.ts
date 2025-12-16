// Instructor Module Types

export interface InstructorCoursesGridProps {
  courses: Course[];
}

export interface InstructorDataType {
  _id: string;
  courseName: string;
  courseDescription: string;
  totalStudentsEnrolled: number;
  totalAmountGenerated: number;
}

export interface Course {
  _id: string;
  thumbnail: string;
  courseName: string;
  courseDescription: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  price: number;
  totalStudentsEnrolled?: number;
  totalAmountGenerated?: number;
  studentsEnrolled?: string[]; // Array of student IDs
}

export interface CoursesTableProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface InstructorChartProps {
  courses: {
    courseName: string;
    totalStudentsEnrolled: number;
    totalAmountGenerated: number;
  }[];
}

export type ConfirmationModalData = {
  text1: string;
  text2: string;
  btn1Text: string;
  btn2Text: string;
  btn1Handler: () => void;
  btn2Handler: () => void;
};

export interface InstructorStatsProps {
  totalCourses: number;
  totalStudents: number;
  totalAmount: number;
}
