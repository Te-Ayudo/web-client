import { useEffect } from "react";
import { startListProveedores} from '../../store';
import { useDispatch, useSelector } from "react-redux";

import Main from "../templates/Main";
import Modal from '../molecules/Modal';
import Service from '../organisms/Inicio';
import { useParams } from 'react-router-dom';
import LoginWhatsappPage from "../pages/LoginWhatsapp";
import Header from "../organisms/HeaderInit";
import TourFloatingButton from "../TourFloatingButton";
import useTour from "../../hooks/useTour";
const Home = () => {
  const {providerid} = useParams();
  const estado = useSelector((state) => state.auth.status);  
  const proveedor = useSelector((state) => state.proveedor.selected);
  const proveedorLoading = useSelector((state) => state.proveedor.loading);
  const { startHomeTour, checkAndStartTour, isActive, cleanupCurrentInstance } = useTour();
  useEffect(() => {
    return () => {
      cleanupCurrentInstance();
    };
  }, [cleanupCurrentInstance]);
  const is_logeado = (estado === "authenticated" )

  const user = localStorage.getItem("user");

  let userJson = null;

  if (user) {
    try {
      userJson = JSON.parse(user);
    } catch (error) {
      console.error("Error al parsear el usuario desde localStorage:", error);
    }
  }

  if (userJson) {
    console.log("Usuario parseado correctamente:", userJson);
  } else {
    console.log("No se pudo obtener o parsear el usuario desde localStorage.");
  }


  const dispatch = useDispatch();

  useEffect(() => {
     dispatch( startListProveedores(providerid) )
  }, [dispatch, providerid])

  // Efecto para iniciar automáticamente el tour si está activo y el usuario está logueado
  useEffect(() => {
    if (is_logeado && !proveedorLoading && proveedor && isActive) {
      setTimeout(() => {
        checkAndStartTour('home');
      }, 100);
    }
  }, [is_logeado, proveedorLoading, proveedor, isActive, checkAndStartTour]);
  
  // Mostrar loading mientras se carga el proveedor
  if (proveedorLoading || !proveedor) {
    return (
      <Main header={<Header/>}>
        <Modal>
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            </div>
            <h3 className="text-orange-500 text-lg font-semibold">
              Cargando proveedor<span className="animate-pulse">...</span>
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Por favor espera mientras verificamos la información
            </p>
          </div>
        </Modal>
      </Main>
    );
  }
  
  return (
    <>
      <Main
        header={<Header/>}
      >
        <Modal>
          {
            is_logeado
            ? ( !userJson?.status ? <Service /> : <Service /> )
            : ( <LoginWhatsappPage /> )
          }
        </Modal>
      </Main>
      
      {is_logeado && <TourFloatingButton onClick={startHomeTour} />}
    </>
  )
}

export default Home
