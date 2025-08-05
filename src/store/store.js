import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authSlice } from './auth';
import { serviciosSlice } from './servicios';
import { carritoSlice } from './carrito';
import { proveedorSlice } from './proveedor';
import { bookingSlice } from './booking';
import { branchSlice } from './branch/branchSlice';
import { categorySlice } from './category';

// Configuración de persistencia para booking - SOLO datos persistentes
const bookingPersistConfig = {
  key: 'booking',
  storage,
  whitelist: ['selected']
};

// Configuración de persistencia para proveedor
const proveedorPersistConfig = {
  key: 'proveedor',
  storage,
  whitelist: ['selected'], // Solo persistir el proveedor seleccionado
};

// Configuración de persistencia para servicios
const serviciosPersistConfig = {
  key: 'servicios',
  storage,
  whitelist: ['services', 'active'], // Persistir servicios y servicio activo
};

// Configuración de persistencia para carrito
const carritoPersistConfig = {
  key: 'carrito',
  storage,
  whitelist: ['services'], // Persistir servicios en carrito
};

// Configuración de persistencia para branch
const branchPersistConfig = {
  key: 'branch',
  storage,
  whitelist: ['selected'], // Persistir sucursal seleccionada
};

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    servicios: persistReducer(serviciosPersistConfig, serviciosSlice.reducer),
    carrito: persistReducer(carritoPersistConfig, carritoSlice.reducer),
    proveedor: persistReducer(proveedorPersistConfig, proveedorSlice.reducer),
    booking: persistReducer(bookingPersistConfig, bookingSlice.reducer),
    branch: persistReducer(branchPersistConfig, branchSlice.reducer),
    category: categorySlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
