import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage } from "../../../shared/utils/localStorage";

const getInitialToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  const token = getLocalStorage("token");
  return token ? JSON.parse(token) : null;
};

const initialState = {
  signupData: null,
  loading: false,
  token: getInitialToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;