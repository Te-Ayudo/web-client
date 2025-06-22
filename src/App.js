
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
import { RutaProtegida } from "./utils/RutaProtegida";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path=":providerid" element={ <Home /> } />
          {/* <Route path="/" element={<Home />} /> */}
          <Route
            path=":providerid/loginWhatsapp"
            element={
              <RutaProtegida>
                <LoginHome />
              </RutaProtegida>
            }
          />
          <Route
            path=":providerid/login"
            element={
              <RutaProtegida>
                <LoginHome />
              </RutaProtegida>
            }
          />
          <Route
            path=":providerid/login/telefono"
            element={
              <RutaProtegida>
                <PhoneInputPage />
              </RutaProtegida>
            }
          />
          <Route 
            path=":providerid/login/codigo" 
            element={
              <RutaProtegida>
                <OtpInputPage />
              </RutaProtegida>
            } 
          />
          <Route 
            path=":providerid/registrarse/codigo" 
            element={
              <RutaProtegida>
                <OtpRegisterPage />
              </RutaProtegida>
            } 
          />
          <Route 
            path=":providerid/registrarse" 
            element={
              <RutaProtegida>
                <Registrarse />
              </RutaProtegida>
            } 
          />
          <Route 
            path=":providerid/rating" 
            element={
              <RutaProtegida>
                <Rating />
              </RutaProtegida>
            } 
          />
          <Route 
            path=":providerid/servicios" 
            element={
              <RutaProtegida>
                <Servicios />
              </RutaProtegida>
            } 
          />
          <Route 
            path=":providerid/programar" 
            element={
              <RutaProtegida>
                <ServiceAppointment />
              </RutaProtegida>
            } 
          />
          <Route 
            path=":providerid/gracias/:bookingId" 
            element={
              <RutaProtegida>
                <Thanks />
              </RutaProtegida>
            }
          />
          <Route 
            path=":providerid/ubicacion" 
            element={
              <RutaProtegida>
                <RegistrarUbicacion />
              </RutaProtegida>
            } 
          />
          <Route path="*" element={<NotFound />} />
          <Route 
            path=":providerid/carrito" 
            element={
              <RutaProtegida>
                <Cart />
              </RutaProtegida>
            }
          />
          <Route 
            path=":providerid/empresa" 
            element={
              <RutaProtegida>
                <Empresa />
              </RutaProtegida>
            }
          />
          <Route 
            path=":providerid/proveedores" 
            element={
              <RutaProtegida>
                <ProveedoresPage />
              </RutaProtegida>
            }
          />
          <Route 
            path=":providerid/sucursales" 
            element={
              <RutaProtegida>
                <SucursalesPage />
              </RutaProtegida>
            } 
          />
          <Route 
            path=":providerid/sucursales/:sucursalid" 
            element={
              <RutaProtegida>
                <Ubication />
              </RutaProtegida>
            }
          />
          <Route 
            path=":providerid/confirmacion" 
            element={
              <RutaProtegida>
                <ConfirmacionPage />
              </RutaProtegida>
            } 
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
