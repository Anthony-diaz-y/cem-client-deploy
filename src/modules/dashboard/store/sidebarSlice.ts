import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openSideMenu: false,
  screenSize: undefined,

  // course view side bar
  courseViewSidebar: false,
  
  // discussion sidebar
  discussionSidebarOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setOpenSideMenu: (state, action) => {
      // console.log('action.payload == ', action.payload)
      state.openSideMenu = action.payload;
    },
    setScreenSize: (state, action) => {
      state.screenSize = action.payload;
    },
    setCourseViewSidebar: (state, action) => {
      state.courseViewSidebar = action.payload;
    },
    setDiscussionSidebarOpen: (state, action) => {
      state.discussionSidebarOpen = action.payload;
    },
  },
});

export const { setOpenSideMenu, setScreenSize, setCourseViewSidebar, setDiscussionSidebarOpen } =
  sidebarSlice.actions;

export default sidebarSlice.reducer;
