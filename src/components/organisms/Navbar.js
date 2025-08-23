import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { BiCart, BiUser } from "react-icons/bi";
import Button from "../atoms/Button";
import { login, startLogout } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import Input from "../atoms/Input";
import _fetch from "../../wrappers/_fetch";
import ButtonCarrito from "./Button";

import { useForm } from "../../hooks/useForm";
import { setEmptySearch, updateListService } from "../../store/servicios/serviciosSlice";
import CartSidebar from "./CartSidebar";
import { createPortal } from "react-dom";

const formData = {
  search_head: "",
};

export const Navbar = ({ onClick, hideUI = false, services = null }) => {
  const { providerid } = useParams();
  const { status } = useSelector((state) => state.auth);
  const { selected } = useSelector((state) => state.booking);
  const [showCart, setShowCart] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [online, setOnline] = useState(true);
  const [, setAccess] = useState(true);
  const [token, setToken] = useState("");
  const [, setFilteredServices] = useState([]);

  const { search_head, onInputChange } = useForm(formData);

  const dispatch = useDispatch();

  useEffect(() => {
    const storageToken = localStorage.getItem("authToken");
    const userStorage = localStorage.getItem("user");
    if (storageToken) {
      setToken(storageToken);
      if (userStorage) {
        dispatch(login(JSON.parse(userStorage)));
      }
    }
    setToken(localStorage.getItem("authToken"));
  }, []);

  useEffect(() => {
    setTimeout(async () => await autoLogin(), 0);
  }, [token]);

  // Nuevo useEffect para filtrar servicios locales cuando cambia el search_head
  useEffect(() => {
    if (search_head.length > 2) {
      if (services) {
        // Si hay servicios pasados como prop, filtrar esos servicios
        const filtered = services.filter((service) => service.name.toLowerCase().includes(search_head.toLowerCase()));
        setFilteredServices(filtered);
        // Actualizar Redux con los servicios filtrados locales
        dispatch(updateListService({ searchTerm: search_head, services: services }));
      } else {
        // Comportamiento original: usar servicios del Redux global
        dispatch(updateListService(search_head));
      }
    } else if (search_head.length <= 2) {
      setFilteredServices([]);
      dispatch(setEmptySearch());
    }
  }, [search_head, services, dispatch]);

  //const
  const navigate = useNavigate();

  const isCheckingAuthentication = useMemo(() => status === "authenticated", [status]);

  const onLogout = (event) => {
    event.preventDefault();
    dispatch(startLogout());
    googleLogout();
    navigate(`/${providerid}/`);
    setShowLogoutConfirm(false);
  };
  const isProviedor = !!providerid;

  // Calcular el número total de servicios en el carrito
  const cartItemsCount = selected?.serviceCart?.reduce((total, item) => total + item.quantity, 0) || 0;

  const isAvailable = async () => {
    const timeout = new Promise((resolve, reject) => {
      setTimeout(reject, 5000, "Request timed out");
    });
    const urlApi = process.env.REACT_APP_API_URL;
    const urlPath = `${urlApi}/test?version=10-c`;
    const request = await fetch(urlPath);

    return await Promise.race([timeout, request])
      .then(async (response) => {
        if (response) {
          response.json().then((json) => {
            if (json.access) {
              setOnline(true);
              setAccess(true);
            } else {
              setAccess(false);
            }
          });
        }
      })
      .catch((error) => {
        setOnline(false);
        setTimeout(() => Swal.fire("Tiempo de espera superado... Revisa tu conexión a internet"), 500);
      });
  };
  const autoLogin = async () => {
    if (!!token) {
      await isAvailable();
      if (online) {
        const urlApi = process.env.REACT_APP_API_URL;
        const urlPath = `${urlApi}/authLogin`;
        await _fetch(urlPath, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }).then(async (response) => {
          if (response) {
            response
              .json()
              .then(async (data) => {
                if (data.data.user) {
                  const user = await JSON.stringify(data.data.user);
                  await localStorage.setItem("authToken", "Bearer " + data.data.token);
                  await localStorage.setItem("user", user);
                  dispatch(login(user));
                } else {
                  setToken("");
                  await localStorage.removeItem("authToken");
                  await localStorage.removeItem("user");
                }
              })
              .catch((error) => Swal.fire("Servidor offline"));
          } else {
            return Swal.fire("Servidor offline");
          }
        });
      }
    }
  };
  if (hideUI) return null;
  return (
    // return (
    <nav className="flex justify-center sm:justify-between flex-col sm:flex-row w-full pt-6">
      <div className="flex justify-end flex-row-reverse sm:w-2/3 rounded-2xl  mb-3 sm:mb-0">
        <Input
          type="text"
          label="Buscar Servicio"
          name="search_head"
          value={search_head}
          className="w-full rounded-2xl text-secondary search"
          onChange={onInputChange}
          data-tour="buscador-servicio"
        />
      </div>

      <div className="text-center flex justify-between gap-4 sm:text-right md:text-right">
        <div className="relative">
          <ButtonCarrito
            onClick={() => setShowCart(true)}
            className="font-bold px-0 sm:pr-0 relative group"
            decoration={
              <div className="relative">
                <BiCart
                  size="2rem"
                  className="text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-orange-600"
                />
                {/* Contador de servicios */}
                {cartItemsCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center cart-badge shadow-lg">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </div>
                )}
              </div>
            }
          >
            <span className="inline transition-all duration-300 group-hover:text-orange-600">Carrito</span>
          </ButtonCarrito>
        </div>
        {isProviedor ? (
          <div>
            <Button
              className={`font-bold px-0 sm:pr-0 ${isCheckingAuthentication ? "hidden" : ""} `}
              href={`/${providerid}/`}
              onClick={onClick}
              decoration={<BiUser size="2rem" className="text-primary" />}
            >
              Iniciar Sesión
            </Button>
            <Button
              className={`font-bold px-0 sm:pr-0 ${!isCheckingAuthentication ? "hidden" : ""} `}
              href={`/${providerid}/logout`}
              onClick={(e) => {
                e.preventDefault();
                setShowLogoutConfirm(true);
              }}
              decoration={<BiUser size="2rem" className="text-primary" />}
            >
              Cerrar Sesión
            </Button>
          </div>
        ) : (
          ""
        )}
        {showLogoutConfirm &&
          createPortal(
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl max-w-sm w-[90%] p-6 shadow-xl animate-modal-pop">
                <div className="flex flex-col justify-start">
                  <h3 className="text-lg flex flex-start font-semibold text-gray-900 mb-4">¿Cerrar sesión?</h3>
                  <p className="text-sm flex flex-start text-gray-600 mb-6">
                    Se cerrará tu sesión actual y volverás al inicio.
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>

                  <button onClick={onLogout} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90">
                    Sí, cerrar
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
        <CartSidebar visible={showCart} onClose={() => setShowCart(false)} />
      </div>
    </nav>
  );
};

export default Navbar;
