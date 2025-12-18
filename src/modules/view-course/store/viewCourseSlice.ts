import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Section, Course } from "../types";

interface ViewCourseSliceState {
  courseSectionData: Section[];
  courseEntireData: Course | null;
  completedLectures: string[];
  totalNoOfLectures: number;
}

const initialState: ViewCourseSliceState = {
  courseSectionData: [],
  courseEntireData: null,
  completedLectures: [],
  totalNoOfLectures: 0,
};

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    setCourseSectionData: (state, action: PayloadAction<Section[]>) => {
      state.courseSectionData = action.payload;
    },
    setEntireCourseData: (state, action: PayloadAction<Course>) => {
      state.courseEntireData = action.payload;
    },
    setTotalNoOfLectures: (state, action: PayloadAction<number>) => {
      state.totalNoOfLectures = action.payload;
    },
    setCompletedLectures: (state, action: PayloadAction<string[]>) => {
      state.completedLectures = action.payload;
    },
    updateCompletedLectures: (state, action: PayloadAction<string>) => {
      if (!state.completedLectures.includes(action.payload)) {
        state.completedLectures = [...state.completedLectures, action.payload];
      }
    },
    removeCompletedLecture: (state, action: PayloadAction<string>) => {
      state.completedLectures = state.completedLectures.filter(
        (id) => id !== action.payload
      );
    },
    toggleCompletedLecture: (state, action: PayloadAction<string>) => {
      const lectureId = action.payload;
      if (state.completedLectures.includes(lectureId)) {
        state.completedLectures = state.completedLectures.filter(
          (id) => id !== lectureId
        );
      } else {
        state.completedLectures = [...state.completedLectures, lectureId];
      }
    },
  },
});

export const {
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
  setCompletedLectures,
  updateCompletedLectures,
  removeCompletedLecture,
  toggleCompletedLecture,
} = viewCourseSlice.actions;

export default viewCourseSlice.reducer;
