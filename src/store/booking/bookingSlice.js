import { createSlice } from "@reduxjs/toolkit";

// SOLO datos persistentes - estos son los únicos que se guardan
const PERSISTENT_BOOKING = Object.freeze({
  serviceCart: [],
  isInBranch: false,
  branch: null,
  serviceType: null, // 'local' o 'domicilio'
  selectedServices: [], // IDs de servicios seleccionados
  totalEstimatedWorkMinutes: null,
  paymentInfo: {
    totalPrice: 0,
  },
  coupon: null, // Cupón aplicado
  couponData: null, // Respuesta completa del servidor
});

export const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    loading: false,
    error: null,
    success: null,
    items: [],
    isOpenModalAddress: false,
    selected: PERSISTENT_BOOKING,
  },
  reducers: {
    BOOKING_SET_ERROR: (state, { payload }) => {
      state.error = payload;
    },
    BOOKING_SET_SUCESS: (state, { payload }) => {
      state.success = payload;
    },
    BOOKING_CLEAR_SUCCESS: (state) => {
      state.success = null;
    },
    BOOKING_CLEAR_ERROR: (state) => {
      state.error = null;
    },
    BOOKING_SET_PROVIDER: (state, { payload }) => {
      state.selected.provider = payload;
    },
    BOOKING_ISINBRANCH: (state) => {
      // Solo limpiar si estaba en modo domicilio antes
      if (state.selected.serviceType === "domicilio") {
        state.selected.serviceCart = [];
        state.selected.selectedServices = [];
      }
      state.selected.isInBranch = true;
      state.selected.serviceType = "local";
    },
    BOOKING_NOTISINBRANCH: (state) => {
      // Solo limpiar si estaba en modo local antes
      if (state.selected.serviceType === "local") {
        state.selected.serviceCart = [];
        state.selected.selectedServices = [];
      }
      state.selected.isInBranch = false;
      state.selected.serviceType = "domicilio";
    },
    BOOKING_CREATE_REQUEST: (state) => {
      state.loading = true;
      state.error = null;
    },
    BOOKING_GET_BY_CUSTOMER_REQUEST: (state, { payload }) => {
      state.loading = true;
      state.error = null;
    },
    BOOKING_CLEAR: (state) => {
      state.selected = {
        ...PERSISTENT_BOOKING,
        serviceCart: [],
      };
    },
    BOOKING_SET_CART: (state, { payload }) => {
      state.selected.serviceCart = payload;
    },
    BOOKING_ADD_TO_CART: (state, action) => {
      let mserviceCart = [];
      let serviceOrder;
      mserviceCart = state.selected.serviceCart;
      if (state.selected.serviceCart.length > 0) {
        serviceOrder = state.selected.serviceCart.find((e) => e.service._id == action.payload.service._id);
      }
      if (!!serviceOrder) {
        state.selected.serviceCart = state.selected.serviceCart.map((e) =>
          e.service._id === action.payload.service._id ? action.payload : e
        );
      } else {
        state.selected.serviceCart.push(action.payload);
      }

      mserviceCart = state.selected.serviceCart;
      state.selected.totalEstimatedWorkMinutes = mserviceCart.reduce((a, b) => a + b.estimatedWorkMinutes, 0);
      state.selected.paymentInfo.totalPrice = mserviceCart.reduce((a, b) => a + b.price, 0);
    },
    BOOKING_REMOVE_FROM_CART: (state, action) => {
      let serviceOrder;
      if (state.selected.serviceCart.length > 0) {
        serviceOrder = state.selected.serviceCart.find((e) => e.service._id == action.payload);
      }

      if (!!serviceOrder) {
        state.selected.serviceCart = state.selected.serviceCart.filter((e) => e.service._id !== action.payload);
      }
    },
    BOOKING_SET_BRANCH: (state, { payload }) => {
      state.selected.branch = payload;
    },
    setActiveModalAddress: (state) => {
      state.isOpenModalAddress = true;
    },
    setNotActiveModalAddress: (state) => {
      state.isOpenModalAddress = false;
    },
    // Reducers para datos persistentes
    BOOKING_SET_SERVICE_TYPE: (state, { payload }) => {
      state.selected.serviceType = payload;
      state.selected.isInBranch = payload === "local";
    },
    BOOKING_SET_SELECTED_SERVICES: (state, { payload }) => {
      state.selected.selectedServices = payload;
    },
    BOOKING_CLEAR_SERVICES: (state) => {
      state.selected.serviceCart = [];
      state.selected.selectedServices = [];
      state.selected.totalEstimatedWorkMinutes = null;
      state.selected.paymentInfo.totalPrice = 0;
    },
    BOOKING_RESET_TO_INITIAL: (state) => {
      state.selected = { ...PERSISTENT_BOOKING };
    },
    BOOKING_SET_COUPON: (state, { payload }) => {
      state.selected.coupon = payload;
    },
    BOOKING_SET_COUPON_DATA: (state, { payload }) => {
      state.selected.couponData = payload;
    },
  },
});

// Action creators
export const {
  BOOKING_SET_ERROR,
  BOOKING_SET_SUCESS,
  BOOKING_CLEAR_SUCCESS,
  BOOKING_CLEAR_ERROR,
  BOOKING_SET_PROVIDER,
  BOOKING_ISINBRANCH,
  BOOKING_NOTISINBRANCH,
  BOOKING_CREATE_REQUEST,
  BOOKING_GET_BY_CUSTOMER_REQUEST,
  BOOKING_CLEAR,
  BOOKING_SET_CART,
  BOOKING_ADD_TO_CART,
  BOOKING_REMOVE_FROM_CART,
  BOOKING_SET_BRANCH,
  setActiveModalAddress,
  setNotActiveModalAddress,
  BOOKING_SET_SERVICE_TYPE,
  BOOKING_SET_SELECTED_SERVICES,
  BOOKING_CLEAR_SERVICES,
  BOOKING_RESET_TO_INITIAL,
  BOOKING_SET_COUPON,
  BOOKING_SET_COUPON_DATA,
} = bookingSlice.actions;
