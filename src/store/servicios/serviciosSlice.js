import { createSlice } from "@reduxjs/toolkit";

export const serviciosSlice = createSlice({
  name: "servicios",
  initialState: {
    isSaving: false,
    isOpenModal: false,
    messageSaved: "",
    services: [],
    search: [],
    active: null,
  },
  reducers: {
    updateListService: (state, action) => {
      state.isSaving = false;

      // Si se pasa un array de servicios específicos, usarlos para filtrar
      if (action.payload.services) {
        state.search = action.payload.services.filter((service) =>
          service.name.toLowerCase().includes(action.payload.searchTerm.toLowerCase())
        );
      } else {
        // Comportamiento original: filtrar desde state.services
        state.search = state.services.filter((dato) => dato.name.toLowerCase().includes(action.payload.toLowerCase()));
      }

      state.messageSaved = `${action.payload.searchTerm || action.payload}, actualizada correctamente`;
    },
    setEmptySearch: (state) => {
      state.isSaving = false;
      state.search = [];
    },
    savingNewService: (state) => {
      state.isSaving = true;
    },
    addNewEmptyService: (state, action) => {
      state.notes.push(action.payload);
      state.isSaving = false;
    },
    setActiveService: (state, action) => {
      state.active = action.payload;
      state.messageSaved = "";
    },
    setServices: (state, action) => {
      state.services = action.payload;
    },
    setActiveModal: (state) => {
      state.isOpenModal = true;
    },
    setNotActiveModal: (state) => {
      state.isOpenModal = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setEmptySearch,
  updateListService,
  savingNewService,
  addNewEmptyService,
  setActiveService,
  setServices,
  setActiveModal,
  setNotActiveModal,
} = serviciosSlice.actions;
