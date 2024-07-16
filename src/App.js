import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <Route path="/:slug" element={<Home />} />
        <Route path="/:slug/login" element={<Login />} />
        <Route path="/:slug/registrarse" element={<Registrarse />} />
        <Route path="/:slug/servicios" element={<Servicios />} />
        <Route path="/:slug/programar" element={<ServiceAppointment />} />
        <Route path="/:slug/gracias" element={<Thanks />} />
        <Route path="/:slug/ubicacion" element={<RegistrarUbicacion />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/:slug/carrito" element={<Cart />} />
        <Route path="/:slug/empresa" element={<Empresa />} />
        <Route path="/:slug/proveedores" element={<ProveedoresPage />} />
        <Route path="/:slug/sucursales" element={<SucursalesPage />} />
        <Route path="/:slug/confirmacion" element={<ConfirmacionPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
