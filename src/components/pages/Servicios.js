import {  useDispatch, useSelector } from "react-redux";
import Main from "../templates/Main";
import Header from "../organisms/Header";
import List from "../molecules/List";
import Item from "../atoms/Item";
import { ServModal } from "../ServModal";

import { startListProveedores } from '../../store';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CartSidebar from "../organisms/CartSidebar";
import { getServicesFilteredByMethod } from '../../wrappers/api';
import { BOOKING_SET_SERVICE_TYPE } from "../../store/booking";
import TourFloatingButton from "../TourFloatingButton";
import useTour from "../../hooks/useTour";

// Componente Skeleton para el header (título y subtítulo)
const ServiciosHeaderSkeleton = () => (
  <div className="mb-6 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

// Componente Skeleton para la card del proveedor
const ProveedorCardSkeleton = () => (
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 animate-pulse">
    <div className="flex-1 rounded-2xl border border-gray-200 bg-white shadow-md p-4 sm:p-6 flex items-start gap-4">
      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-xl flex-shrink-0"></div>
      <div className="flex flex-col justify-between h-full w-full">
        <div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="flex items-center mt-1">
            <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Componente Skeleton para recomendados (2 cards)
const RecomendadosSkeleton = () => (
  <div className="col-span-full animate-pulse mb-6">
    <div className="mb-3 sm:mb-6">
      <div className="h-6 bg-gray-200 rounded w-32 mb-5" />
      <div className="flex flex-row items-start gap-4">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="flex flex-col w-1/3 h-fit">
            <div className="w-24 h-24 md:w-32 md:h-32 lg:w-32 lg:h-32 bg-gray-200 rounded-md mb-2" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Componente Skeleton para la lista de servicios (3 cards)
const ServiciosListSkeleton = () => (
  <div className="col-span-full animate-pulse">
    <div className="mb-3 sm:mb-6">
      <ul className="">
        {[...Array(3)].map((_, index) => (
          <li key={index} className="mb-4">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="text-right">
                  <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="mt-4">
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Servicios = (props) => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const proveedor = useSelector((state) => state.proveedor.selected);

  // Hook del tour
  const { startServiciosTour, checkAndStartTour, cleanupCurrentInstance } = useTour();

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      cleanupCurrentInstance();
    };
  }, [cleanupCurrentInstance]);
  

  // Efecto único para cargar proveedor y servicios
  useEffect(() => {
    const loadProviderAndServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Configurar el tipo de servicio como "A domicilio"
        dispatch(BOOKING_SET_SERVICE_TYPE('home'));
        
        // Cargar proveedor si no está cargado o es diferente
        if (!proveedor || proveedor.slugUrl !== params.providerid) {
          await dispatch(startListProveedores(params.providerid));
          return; // Salir aquí para que el efecto se ejecute de nuevo cuando el proveedor cambie
        }
        
        // Cargar servicios solo si el proveedor es válido
        if (proveedor && proveedor._id && proveedor._id !== "63aca8f96eeafc6f83a943f9") {
          const servicesResponse = await getServicesFilteredByMethod(proveedor._id, "A domicilio");
          setServices(servicesResponse.data);
        } else {
          setServices([]);
        }
      } catch (error) {
        setError(error.message);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadProviderAndServices();
  }, [dispatch, params.providerid, proveedor?.slugUrl, proveedor?._id, proveedor]);

  // Efecto para iniciar automáticamente el tour si está activo
  useEffect(() => {
    if (!loading && services.length > 0 && proveedor) {
      setTimeout(() => {
        checkAndStartTour('servicios', services);
      }, 100);
    }
  }, [loading, services.length, proveedor, checkAndStartTour, services]);

  const { isOpenModal, active } = useSelector( state => state.servicios );
  const [cartOpen, setCartOpen] = useState(false);

  const openCart  = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  
  return (
    <Main
      header={<Header back={true} services={services}/>}
      // footer={<Footer />}
    >
      <ServModal isOpen={ isOpenModal } {...active} openCart={openCart}/>
    
      <List>
        {loading ? (
          <>
            <ServiciosHeaderSkeleton />
            <ProveedorCardSkeleton />
            <RecomendadosSkeleton />
            <ServiciosListSkeleton />
          </>
        ) : error ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar servicios</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-semibold"
            >
              Reintentar
            </button>
          </div>
        ) : !proveedor ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            </div>
            <h3 className="text-orange-500 text-lg font-semibold">
              Cargando proveedor<span className="animate-pulse">...</span>
            </h3>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay servicios disponibles</h3>
            <p className="text-gray-500 mb-4">Este proveedor no tiene servicios a domicilio disponibles en este momento.</p>
            <button 
              onClick={() => navigate(`/${params.providerid}/`)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-semibold"
            >
              Volver al inicio
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary mb-1">Servicios</h2>
              <p className="text-sm text-gray-600">Elija el servicio de su preferencia para continuar con su reserva</p>
            </div>
            <Item
              key= {proveedor._id}
              id= {proveedor._id}
              empresa= {proveedor.first_name}
              puntaje= {proveedor.avgRating}
              image= {proveedor.picture}
              categoria = {null}
              servicios= {services}
              recomendado={proveedor.recommendedServices}
            />
          </>
        )}
      </List>
      <CartSidebar visible={cartOpen} onClose={closeCart} />
      
      {/* Botón flotante del tour - solo cuando el usuario tenga servicios disponibles */}
      {!loading && services.length > 0 && <TourFloatingButton onClick={() => startServiciosTour(services)} />}
    </Main>
  )
}

export default Servicios
