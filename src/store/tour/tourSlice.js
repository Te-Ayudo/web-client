import { createSlice } from "@reduxjs/toolkit";

export const tourSlice = createSlice({
  name: "tour",
  initialState: {
    isActive: false,
    currentStep: 0,
    currentPage: null,
    continueTour: false, // Nueva propiedad para controlar la continuación
  },
  reducers: {
    startTour: (state, action) => {
      state.isActive = true;
      state.currentStep = 0;
      state.currentPage = action.payload || null;
      state.continueTour = true;
    },
    endTour: (state) => {
      state.isActive = false;
      state.currentStep = 0;
      state.currentPage = null;
      state.continueTour = false;
    },
    setTourStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setContinueTour: (state, action) => {
      state.continueTour = action.payload;
    },
  },
});

export const { startTour, endTour, setTourStep, setCurrentPage, setContinueTour } = tourSlice.actions;

export default tourSlice.reducer;
