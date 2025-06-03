// components/layout/Header.jsx
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams }   from "react-router-dom";
import { BiArrowBack, BiCart, BiLogOut, BiUser } from "react-icons/bi";

import Logo   from "@/components/atoms/Logo";
import { startLogout } from "@/store";     // ← usa tu thunk de logout
import { useState } from "react";
import CartSidebar from "./CartSidebar";
import Button from "./Button";
import ButtonLogin from "../atoms/Button";
import { createPortal } from "react-dom";

export default function Header({ isSticky = false, back = false }) {
  const { providerid } = useParams();
  const { status }     = useSelector(s => s.auth);
  const dispatch       = useDispatch();
  const navigate       = useNavigate();
  const headerClass = isSticky
  ? "fixed top-0 inset-x-0 z-50 bg-white shadow-md bg-white/80 backdrop-blur-sm shadow"
  : "sticky top-0 w-full bg-white shadow-md z-50";
  const isAuth = status === "authenticated";
  const [showCart, setShowCart] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const handleAuth = (e) => {
    e.preventDefault();
    if (isAuth) {
      setShowLogoutConfirm(true);  
    }else {
      navigate(`/${providerid}/login/telefono`);
    }
  };
  const confirmLogout = () => {
    dispatch(startLogout());
    navigate(`/${providerid}/`);
    setShowLogoutConfirm(false);
  };
  const location = useLocation();
  const isProgramar = location.pathname.includes("/programar");
  return (
    // <header className="
    //   fixed top-0 inset-x-0 z-50
    // bg-white/80 backdrop-blur-sm shadow
    //   "
    // >
    <header className={headerClass}>
      <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:py-8">
        {/* Grupo: botón atrás + logo */}
        <div className="flex items-center gap-4">
          {back && (
            <button
              onClick={() => navigate(-1)}
              className="
                bg-[#FF770F] hover:bg-orange-600
                text-white text-xl sm:text-2xl
                rounded-[12px] sm:rounded-[14px]
                w-9 h-9 sm:w-10 sm:h-10
                flex items-center justify-center
                shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                transition duration-300
              "
            >
              ❮
            </button>
          )}
          <Logo className="h-12 sm:h-16 cursor-pointer" />
        </div>

        {/* Botones del lado derecho */}
        <div className="flex gap-4 items-center">
          {isAuth && !isProgramar && (
            <Button
              onClick={() => setShowCart(true)}
              className="font-bold px-0 sm:pr-0"
              decoration={<BiCart size="2rem" className="text-primary" />}
            >
              <span className="hidden sm:inline">Carrito</span>
            </Button>
          )}

          <ButtonLogin
            onClick={handleAuth}
            className="font-bold px-0 sm:pr-0"
            href={`/${providerid}/logout`}
            decoration={
              isAuth
                ? <BiLogOut size="2rem" className="text-primary" />
                : <BiUser size="2rem" className="text-primary" />
            }
          >
            <span className="hidden sm:inline">
              {isAuth ? "Cerrar sesión" : "Iniciar sesión"}
            </span>
          </ButtonLogin>
        </div>
      </div>
      {showLogoutConfirm &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center
                          bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-sm w-[90%] p-6 shadow-xl animate-modal-pop">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ¿Cerrar sesión?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Se cerrará tu sesión actual y volverás al inicio.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>

                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
                >
                  Sí, cerrar
                </button>
              </div>
            </div>
          </div>,
          document.body         // ⬅️ portal en el root del DOM
        )
      }

      {/* Modal lateral del carrito */}
      <CartSidebar visible={showCart} onClose={() => setShowCart(false)} />
    </header>
  );
}
