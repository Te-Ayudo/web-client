import { createSlice } from '@reduxjs/toolkit';
import { loginWhatsappApi } from './helpers/loginWhatsappApi';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'not-authenticated', //checking, email-confirmation , not-authenticated authenticated
    uid: null,
    email: null,
    phone: null,
    codePhone: null,
    displayName: null,
    photoURL: null,
    error: null
  },
  reducers: {
    login: (state, {payload}) => {
        state.status = 'authenticated';
        state.uid = payload.uid;
        state.email = payload.email;
        state.phone = payload.phone;
        state.codePhone = payload.codePhone;
        state.displayName = payload.displayName;
        state.photoURL = payload.photoURL;
        state.error = null

    },
    loginWhatsapp: (state, {payload}) => {
        state.status = 'authenticated';
        state.uid = payload.uid;
        state.email = payload.email;
        state.phone = payload.phone;
        state.codePhone = payload.codePhone;
        state.displayName = payload.displayName;
        state.photoURL = payload.photoURL;
        state.error = null

    },
    logout: (state, { payload }) => {
        state.status = 'not-authenticated';
        state.uid = null;
        state.email = null;
        state.displayName = null;
        state.photoURL = null;
        state.error = payload?.error
    },
    confirmation: (state, { payload }) => {
        state.status = 'email-confirmation';
        state.uid = null;
        state.email = payload.email;
        state.displayName = null;
        state.photoURL = null;
        state.error = null
    },
    checkingCredentials: (state, /* action */) => {
      state.status='checking';
    },
    clearErrorMessage:(state) => {
      state.error = null
    }

  }
});


// Action creators are generated for each case reducer function
export const { login, loginWhatsapp, logout,checkingCredentials,confirmation,clearErrorMessage } = authSlice.actions;
