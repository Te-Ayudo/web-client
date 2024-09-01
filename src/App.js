import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/pages/Login";
import Registrarse from "./components/pages/Registrarse";
import RegistrarUbicacion from "./components/pages/RegistrarUbicacion";
import Home from "./components/pages/Home";
import Servicios from "./components/pages/Servicios";
import NotFound from "./components/pages/NotFound"
import ServiceAppointment from "./components/pages/ServiceAppointment";
import { Thanks } from "./components/pages/Thanks";
import { Cart } from "./components/pages/Cart";
import { Empresa } from "./components/pages/Empresa";
import { SucursalesPage } from "./components/pages/SucursalesPage";
import { ConfirmacionPage } from "./components/pages/ConfirmacionPage";
import { useCheckAuthToken } from "./hooks/useCheckAuthToken";
import { ProveedoresPage } from "./components/pages/ProveedoresPage";

function App() {

  const { status } = useCheckAuthToken();
  const { services,isLoading} = useSelector( state => state.carrito );
  const { selected } = useSelector( state => state.booking );
  const serviceCart = selected.serviceCart

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path=":providerid" element={ <Home /> } />
        {/* <Route path="/" element={<Home />} /> */}

        <Route path=":providerid/login" element={<Login />} />
        <Route path=":providerid/registrarse" element={<Registrarse />} />
        
        <Route path=":providerid/servicios" element={<Servicios />} />
        <Route path=":providerid/programar" element={<ServiceAppointment />} />
        <Route path=":providerid/gracias" element={<Thanks />} />
        <Route path=":providerid/ubicacion" element={<RegistrarUbicacion />} />
        <Route path="*" element={<NotFound />} />
        <Route path=":providerid/carrito" element={<Cart />} />
        <Route path=":providerid/empresa" element={<Empresa />} />
        <Route path=":providerid/proveedores" element={<ProveedoresPage />} />
        <Route path=":providerid/sucursales" element={<SucursalesPage />} />
        <Route path=":providerid/confirmacion" element={<ConfirmacionPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
