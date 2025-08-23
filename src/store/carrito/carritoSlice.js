import { createSlice } from "@reduxjs/toolkit";

export const carritoSlice = createSlice({
  name: "carrito",
  initialState: {
    isLoading: true,
    isSaving: false,
    messageSaved: "",
    services: [],
    active: null,
  },
  reducers: {
    setDesactiveLoading: (state, action) => {
      state.isLoading = false;
    },
    addNewItem: (state, action) => {
      state.services.push(action.payload);
      state.isSaving = false;
    },
    setItems: (state, action) => {
      state.services = action.payload;
    },
    setActiveItem: (state, action) => {
      state.active = action.payload;
      state.messageSaved = "";
    },
    updateItem: (state, action) => {
      // payload: service
      state.isSaving = false;
      state.services = state.services.map((service) => {
        if (service._id === action.payload._id) {
          return action.payload;
        }

        return service;
      });

      state.messageSaved = `${action.payload.name}, actualizada correctamente`;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addNewItem, updateItem, setActiveItem, setItems, setDesactiveLoading } = carritoSlice.actions;
