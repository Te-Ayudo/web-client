import { createSlice } from '@reduxjs/toolkit';

export const proveedorSlice = createSlice({
  name: 'proveedor',
  initialState: {
    loading: false,
    error: {
      message:null,
      code:null
    },
    item:[],
    selected:{
        _id:'63aca8f96eeafc6f83a943f9',
        name:'Armadillo',
        logoURL:'https://te-ayudo-img.s3.us-east-2.amazonaws.com/production/users/63aca8f96eeafc6f83a943f9@1672259925112',
      }
  },
  reducers: {
    setGetProv:(state) => {
      state.loading = false;
    },
    provider_getall_request:(state) => {
      state.loading = true;
      state.error= {
        message:null,
        code:null,
      }
    },
    provider_getall_success:(state, {payload}) => {
      state.item = payload;
      state.loading = false;
    },
    provider_getall_failure:(state, {payload}) => {
      state.loading = false;
      state.error = {
        message:payload.error?.message,
        code:payload.error?.code,
      }
    },
    provider_getone_request:(state) => {
      state.loading=true;
      state.error = {
         message:null,
        code:null,
      }
    },
    provider_getone_success:(state, {payload}) => {
      state.loading = false;
      state.selected = payload.response.data;
    },
    provider_getone_failure:(state, {payload}) => {
      state.loading = false;
      state.error = {
        message:payload.error.message,
        code:payload.error.code,
      }
    },
    provider_set:(state,{payload}) => {
      state.selected = payload
    }

  }
});

// Action creators are generated for each case reducer function
export const {
  setGetProv,
  provider_getall_failure,
  provider_getall_request,
  provider_getall_success,
  provider_getone_failure,
  provider_getone_request,
  provider_getone_success,
  provider_set
} = proveedorSlice.actions;
