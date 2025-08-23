import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_CATEGORIES = [
  {
    name: "Agua de Mesa",
    state: true,
    _id: -2,
    // source: require(`../../assets/elemental.png`),
    customNavigation: "Elemental",
  },
  {
    name: "Emergencias",
    state: true,
    _id: -1,
    // source: require(`../../assets/sos.png`),
    customNavigation: "SOS",
  },
];

const INIT_STATE = {
  loading: false,
  error: {
    message: null,
    code: null,
  },
  items: DEFAULT_CATEGORIES,
  selected: {
    name: "Hogar",
    _id: "5dfaa6624deb3b2b4ccb96ce",
    state: true,
    type: "Normal",
    subCategory: [],
    __v: 124,
    logo: "https://te-ayudo-img.s3.us-east-2.amazonaws.com/test/categories/5dfaa6624deb3b2b4ccb96ce@1693442634974",
    id: "5dfaa6624deb3b2b4ccb96ce",
  },
};

export const categorySlice = createSlice({
  name: "category",
  initialState: INIT_STATE,
  reducers: {
    category_getall_request: (state) => {
      state.loading = true;
      state.error = {
        message: null,
        code: null,
      };
    },
    category_getall_success: (state, { payload }) => {
      state.items = [...payload, ...DEFAULT_CATEGORIES];
      state.loading = false;
    },
    category_getall_failure: (state, { payload }) => {
      state.loading = false;
      state.error = {
        message: payload.error.message,
        code: payload.error.code,
      };
    },
    category_getone_request: (state) => {
      state.loading = true;
      state.error = {
        message: null,
        code: null,
      };
    },
    category_getone_success: (state, { payload }) => {
      state.loading = false;
      state.selected = payload.response.data;
    },
    category_getone_failure: (state, { payload }) => {
      state.loading = false;
      state.error = {
        message: payload.error.message,
        code: payload.error.code,
      };
    },
    category_set: (state, { payload }) => {
      state.selected = {
        ...state.selected,
        ...payload.object,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  category_getall_failure,
  category_getall_request,
  category_getall_success,
  category_getone_failure,
  category_getone_request,
  category_getone_success,
  category_set,
} = categorySlice.actions;
