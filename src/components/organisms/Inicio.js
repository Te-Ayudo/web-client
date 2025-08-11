import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../atoms/Button";
import { BOOKING_ISINBRANCH, BOOKING_NOTISINBRANCH, BOOKING_SET_BRANCH, BOOKING_CLEAR_SERVICES } from "../../store";
import { getAllServicesByProvider, getBranchesByProvider } from "../../wrappers/api";

export const Service = () => {
  const { providerid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [actDomicilio, setActDomicilio] = useState(false);
  const [actLocal, setActLocal] = useState(false);
  const [providerBranches, setProviderBranches] = useState([]);

  const { status } = useSelector((state) => state.auth);
  const provideSelect = useSelector((state) => state.proveedor.selected);
  const { error, selected } = useSelector((state) => state.proveedor);
  const booking = useSelector((state) => state.booking.selected);
  const accesoBloqueado =
    Boolean(error?.message) || selected?.providerEnabledForWeb === false;

  // Verificar servicios disponibles cuando el proveedor cambie
  useEffect(() => {
    const checkAvailableServices = async () => {
      if (provideSelect?._id && provideSelect._id !== "63aca8f96eeafc6f83a943f9") {
        try {
          setLoadingServices(true);
          
          const servicesResponse = await getAllServicesByProvider(provideSelect._id);
          const services = servicesResponse.data;
          
          // Verificar servicios a domicilio
          const serviciosDomicilio = services.filter(service => 
            service.method === "A domicilio" || service.method === "Ambos"
          );

          // Verificar servicios en local
          const serviciosLocal = services.filter(service => 
            service.method === "En sucursal" || service.method === "Ambos"
          );
          
          setActDomicilio(serviciosDomicilio.length > 0);
          setActLocal(serviciosLocal.length > 0);
          
        } catch (error) {
          console.error('❌ Error verificando servicios disponibles:', error);
          setActDomicilio(false);
          setActLocal(false);
        } finally {
          setLoadingServices(false);
        }
      } else {
        setActDomicilio(false);
        setActLocal(false);
      }
    };

    checkAvailableServices();
  }, [provideSelect?._id]);

  // Cargar sucursales del proveedor cuando el proveedor cambie
  useEffect(() => {
    const loadProviderBranches = async () => {
      if (provideSelect?._id && provideSelect._id !== "63aca8f96eeafc6f83a943f9") {
        try {
          setLoadingBranches(true);
          
          const branchesResponse = await getBranchesByProvider(provideSelect._id);
          setProviderBranches(branchesResponse);
          
        } catch (error) {
          console.error('❌ Error cargando sucursales:', error);
          setProviderBranches([]);
        } finally {
          setLoadingBranches(false);
        }
      } else {
        setProviderBranches([]);
      }
    };

    loadProviderBranches();
  }, [provideSelect?._id]);

  const onServicioDomicilio = (event) => {
    event.preventDefault();
    
    // Solo limpiar servicios si estaba en modo local antes
    if (booking.serviceType === 'local') {
      dispatch(BOOKING_CLEAR_SERVICES());
    } else {
    }
    
    dispatch(BOOKING_NOTISINBRANCH());
    status === "authenticated" ? navigate(`/${providerid}/servicios`) : navigate(`/${providerid}/login`);
  };

  const onServicioLocal = (e) => {
    e.preventDefault();
    
    // Solo limpiar servicios si estaba en modo domicilio antes
    if (booking.serviceType === 'domicilio') {
      dispatch(BOOKING_CLEAR_SERVICES());
    } else {
    }
    
    dispatch(BOOKING_ISINBRANCH());

    // Si solo tiene una sucursal, ir directamente a esa sucursal
    if (providerBranches.length === 1) {
      const singleBranch = providerBranches[0];
      dispatch(BOOKING_SET_BRANCH(singleBranch));
      if (status === "authenticated") {
        navigate(`/${providerid}/empresa/${singleBranch._id}`);
      } else {
        navigate(`/${providerid}/login`);
      }
    } else if (providerBranches.length > 1) {
      // Si tiene múltiples sucursales, ir a la página de selección
      status === "authenticated"
        ? navigate(`/${providerid}/sucursales`)
        : navigate(`/${providerid}/login`);
    } else {
      if (status === "authenticated") {
        // Podrías mostrar un mensaje de error aquí
        navigate(`/${providerid}/`);
      } else {
        navigate(`/${providerid}/login`);
      }
    }
  };
  const generarLinkWhatsapp = (telefono, codeCountry = '591') => {
    const numero = `${codeCountry}${telefono}`;
    const mensaje = encodeURIComponent(
      'Hola, estoy intentando acceder a su sitio web de clientes pero me aparece una restricción. ¿Podría ayudarme?'
    );
    return `https://wa.me/${numero}?text=${mensaje}`;
  };
  const isProviedor = !!providerid;
  const storageUser = JSON.parse(localStorage.getItem("user"));
  const capitalizedName = providerid
    ? providerid.charAt(0).toUpperCase() + providerid.slice(1)
    : "Proveedor";

  // Validar que el proveedor sea válido y no sea el por defecto
  if (!provideSelect || provideSelect._id === "63aca8f96eeafc6f83a943f9") {
    return (
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
    );
  }

  // Mostrar loading mientras se verifican los servicios y sucursales
  if (loadingServices || loadingBranches) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        </div>
        <h3 className="text-orange-500 text-lg font-semibold">
          {loadingServices ? 'Verificando servicios disponibles' : 'Cargando sucursales'}<span className="animate-pulse">...</span>
        </h3>
        <p className="text-gray-500 text-sm mt-2">
          Por favor espera mientras verificamos qué opciones están disponibles
        </p>
      </div>
    );
  }
  
  return (
    <div className="text-center">
      {accesoBloqueado ?
        <>
          <div className="mb-6">
            <h1 className="text-orange-500 font-bold text-3xl">
              Bienvenido a {selected?.first_name || 'Tu Proveedor'}
            </h1>

            {selected?.picture && (
              <img
                src={selected.picture}
                alt="Logo del proveedor"
                className="w-30 h-28 object-contain mx-auto mt-4 rounded-md border border-gray-200 shadow"
              />
            )}
          </div>
          <div className="max-w-sm text-center mx-auto text-black font-semibold flex flex-col items-center">
            <div className="text-gray-700 font-medium text-base mb-4">
              {error?.message ? (
                <p>
                  <span className="text-orange-500">{error.message}</span>
                  <br />
                  Contacta con tu proveedor para activar esta funcionalidad.
                </p>
              ) : (
                <p>
                  El proveedor tiene habilitado el{' '}
                  <span className="text-orange-500 font-semibold">
                    plan gratuito
                  </span>
                  , el cual no incluye acceso web para clientes.
                  <br />
                  Contacta con el proveedor para actualizar su plan.
                </p>
              )}
            </div>

            {selected?.phone && (
              <Button
                onClick={() => {
                  const link = generarLinkWhatsapp(
                    selected.phone,
                    selected.codeCountry || '591'
                  );
                  window.open(link, '_blank');
                }}
                bg="bg-orange-500 hover:bg-orange-500/90"
                tc="text-white"
                className="rounded-full px-6 w-full py-3 mt-4"
              >
                Contactar por WhatsApp
              </Button>
            )}
          </div>
        </>
        : 
        <>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 text-center">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              Hola,&nbsp;
              <span className="text-orange-500">{storageUser.first_name}</span>
              <span className="text-3xl">👋</span>
            </div>
            <div className="mt-2">
              Bienvenido a <span className="text-orange-500">{capitalizedName}</span>
            </div>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            ¿Dónde deseas realizar tu servicio?
          </p>
          <div className="col-span-full">
            <div className="mb-3 sm:mb-12">
              <Button 
                disabled={!isProviedor || !actDomicilio} 
                bg="btn-transparent" 
                tc="text-secondary hover:text-white" 
                onClick={onServicioDomicilio} 
                className="sm:h-[80px] lg-text-[26px] sm bordered"
              >
                Servicio a domicilio
                {!actDomicilio && actDomicilio !== undefined && (
                  <span className="block text-xs text-gray-400 mt-1">No disponible</span>
                )}
              </Button>
            </div>
          </div>
          <div className="col-span-full">
            <div className="mb-3 sm:mb-6">
              <Button 
                disabled={!isProviedor || !actLocal || providerBranches.length === 0} 
                bg="btn-transparent" 
                tc="text-secondary hover:text-white" 
                onClick={onServicioLocal} 
                className="sm:h-[80px] lg-text-[26px] bordered"
              >
                Servicio en el local
                {(!actLocal || providerBranches.length === 0) && (actLocal !== undefined || providerBranches.length !== undefined) && (
                  <span className="block text-xs text-gray-400 mt-1">
                    {!actLocal ? 'No disponible' : 'Sin sucursales'}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default Service;
