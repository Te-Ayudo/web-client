// components/layout/Header.jsx
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams }   from "react-router-dom";
import { BiCart, BiLogOut, BiUser } from "react-icons/bi";

import Logo   from "@/components/atoms/Logo";
import { startLogout } from "@/store";     // ← usa tu thunk de logout
import { useState } from "react";
import CartSidebar from "./CartSidebar";
import Button from "./Button";
import ButtonLogin from "../atoms/Button";

export default function Header({ isSticky = false }) {
  const { providerid } = useParams();
  const { status }     = useSelector(s => s.auth);
  const dispatch       = useDispatch();
  const navigate       = useNavigate();
  const headerClass = isSticky
  ? "fixed top-0 inset-x-0 z-50 bg-white shadow-md bg-white/80 backdrop-blur-sm shadow"
  : "w-full bg-white shadow-md";
  const isAuth = status === "authenticated";
  const [showCart, setShowCart] = useState(false);
  const handleAuth = (e) => {
    e.preventDefault();
    if (isAuth) {
      dispatch(startLogout());
      navigate(`/${providerid}/`);
    } else {
      navigate(`/${providerid}/login/telefono`);
    }
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
        <Logo className="h-12 sm:h-16 cursor-pointer" />

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

      {/* Modal lateral del carrito */}
      <CartSidebar visible={showCart} onClose={() => setShowCart(false)} />
    </header>
  );
}
