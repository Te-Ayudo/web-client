import { useNavigate } from 'react-router-dom';
import Logo from '../atoms/Logo';
import Navbar from './Navbar';
import { useSelector } from "react-redux";
import { BiArrowBack } from 'react-icons/bi';
export const Header = ({onClick, isAuthentication = true, back = false}) => {
  const { status } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const isAuth     = status === "authenticated";
  const headerClass = isAuthentication
     ? "sticky top-0 z-40 bg-white/95 backdrop-blur border-b-4 shadow-[0_6px_12px_-4px_rgba(0,0,0,0.15)] py-4 sm:py-6 flex justify-center"
     : "";
  return(
    <header className={headerClass}>
      <div className="container flexCenter flex-col">

        {/* ▲ BACK BUTTON ───────────────────────────────────────── */}
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="
              absolute left-6 sm:left-20 top-11 sm:top-20 -translate-y-1/2
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
                {/* LOGO solo si está logeado */}
        {isAuth && <Logo className="h-12 sm:h-24" />}

        {/* NAVBAR (se puede ocultar con hideUI) */}
        <Navbar onClick={onClick} hideUI={!isAuth} />
      </div>
    </header>
)};

export default Header