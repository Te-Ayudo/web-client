import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth';
import { serviciosSlice } from './servicios';
import { carritoSlice } from './carrito';
import { proveedorSlice } from './proveedor';
import { bookingSlice } from './booking';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    servicios: serviciosSlice.reducer,
    carrito: carritoSlice.reducer ,
    proveedor: proveedorSlice.reducer,
    booking: bookingSlice.reducer,
  },
})
