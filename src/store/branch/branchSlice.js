import { createSlice } from "@reduxjs/toolkit";

export const branchSlice = createSlice({
  name: "branch",
  initialState: {
    loading: false,
    error: null,
    item: [],
    selected: [],
  },
  reducers: {
    branch_getall_request: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    branch_getall_success: (state, { payload }) => {
      state.item = payload.data;
      state.loading = false;
    },
    branch_getall_failure: (state, { payload }) => {
      state.loading = false;
      state.error = payload.error;
    },
    branch_getone_request: (state) => {
      state.loading = true;
      state.error = null;
    },
    branch_getone_success: (state, { payload }) => {
      state.loading = false;
      state.selected = payload.branch.data;
    },
    branch_getone_failure: (state, { payload }) => {
      state.loading = false;
      state.error = payload.error;
    },
  },
});

export const {
  branch_getall_failure,
  branch_getall_request,
  branch_getall_success,
  branch_getone_failure,
  branch_getone_request,
  branch_getone_success,
} = branchSlice.actions;
