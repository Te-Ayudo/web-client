
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
import { ProveedoresPage } from "./components/pages/ProveedoresPage";
import { Rating } from "./components/pages/Rating";
import LoginWhatsapp from "./components/pages/LoginWhatsapp";
import { Ubication } from "./components/pages/Ubication";
import PhoneInputPage from "./components/organisms/PhoneInputPage";
import OtpInputPage from "./components/organisms/OtpInputPage";
import OtpRegisterPage from "./components/organisms/OtpRegisterPage";
import LoginHome from "./components/pages/LoginHome";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path=":providerid" element={ <Home /> } />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path=":providerid/loginWhatsapp" element={<LoginHome />} />
          <Route path=":providerid/login" element={<LoginHome />} />
          <Route path=":providerid/login/telefono" element={<PhoneInputPage />} />
          <Route path=":providerid/login/codigo" element={<OtpInputPage />} />
          <Route path=":providerid/registrarse/codigo" element={<OtpRegisterPage />} />
          <Route path=":providerid/registrarse" element={<Registrarse />} />
          <Route path=":providerid/rating" element={<Rating />} />
          <Route path=":providerid/servicios" element={<Servicios />} />
          <Route path=":providerid/programar" element={<ServiceAppointment />} />
          <Route path=":providerid/gracias/:bookingId" element={<Thanks />} />
          <Route path=":providerid/ubicacion" element={<RegistrarUbicacion />} />
          <Route path="*" element={<NotFound />} />
          <Route path=":providerid/carrito" element={<Cart />} />
          <Route path=":providerid/empresa" element={<Empresa />} />
          <Route path=":providerid/proveedores" element={<ProveedoresPage />} />
          <Route path=":providerid/sucursales" element={<SucursalesPage />} />
          <Route path=":providerid/sucursales/:sucursalid" element={<Ubication />} />
          <Route path=":providerid/confirmacion" element={<ConfirmacionPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
