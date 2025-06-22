import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../atoms/Button";
import { BOOKING_ISINBRANCH, BOOKING_NOTISINBRANCH, BOOKING_SET_BRANCH, startListServicios, startListSucursales } from "../../store";

export const Service = () => {
  const { providerid } = useParams();
  const [actDomicilio, setActDomicilio] = useState(false);
  const [actLocal, setActLocal] = useState(false);

  const { status } = useSelector((state) => state.auth);
  const provideSelect = useSelector((state) => state.proveedor.selected);
  const servicesList = useSelector((state) => state.servicios.services);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, selected } = useSelector((state) => state.proveedor);
  const accesoBloqueado =
    Boolean(error?.message) || selected?.providerEnabledForWeb === false;

  useEffect(() => {
    if (provideSelect._id !== "63aca8f96eeafc6f83a943f9") {
      dispatch(startListServicios(provideSelect));
    }
  }, [dispatch, provideSelect]);

  const contAmbos = useMemo(() => {
    if (servicesList.length > 0) {
      return servicesList.reduce(
        (acount, item) => {
          if (item.method === "Ambos") acount.ambos++;
          if (item.method === "En sucursal") acount.local++;
          if (item.method === "A domicilio") acount.domicilio++;
          return acount;
        },
        { ambos: 0, local: 0, domicilio: 0 }
      );
    }
  }, [servicesList]);

  useEffect(() => {
    if (servicesList.length > 0) {
      setActLocal(contAmbos.ambos > 0 || contAmbos.local > 0);
      setActDomicilio(contAmbos.ambos > 0 || contAmbos.domicilio > 0);
    }
  }, [servicesList, contAmbos]);

  const onServicioDomicilio = (event) => {
    event.preventDefault();
    dispatch(BOOKING_NOTISINBRANCH());
    status === "authenticated" ? navigate(`/${providerid}/servicios`) : navigate(`/${providerid}/login`);
  };

  const branches = useSelector(state => state.branch.item);
  useEffect(() => {
    if (!branches || branches.length === 0) dispatch(startListSucursales());
  }, []);

  const sucursalesProveedor = useMemo(
    () => branches.filter(b => b.providerId === provideSelect._id),
    [branches, provideSelect._id]
  );
  const onServicioLocal = (e) => {
    e.preventDefault();
    dispatch(BOOKING_ISINBRANCH());

    if (sucursalesProveedor.length === 1) {
      dispatch(BOOKING_SET_BRANCH(sucursalesProveedor[0]));
      if (status === "authenticated") {
        navigate(`/${providerid}/empresa`);
      } else {
        navigate(`/${providerid}/`);
      }
    } else {
      status === "authenticated"
        ? navigate(`/${providerid}/sucursales`)
        : navigate(`/${providerid}/`);
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

  if (provideSelect._id === "63aca8f96eeafc6f83a943f9") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <h3 className="mt-3 text-orange-500 text-lg font-semibold">
          Cargando<span className="animate-pulse">...</span>
        </h3>
      </div>
    );
  }
  return provideSelect._id === "63aca8f96eeafc6f83a943f9" ? (
      <div className="flex flex-col items-center justify-center min-h-[200px]">        
        <h3 className="mt-3 text-orange-500 text-lg font-semibold">
          Cargando<span className="animate-pulse">...</span>
        </h3>
      </div>
    ) : (
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
              <Button disabled={!actDomicilio || !isProviedor} bg="btn-transparent" tc="text-secondary hover:text-white" onClick={onServicioDomicilio} className="sm:h-[80px] lg-text-[26px] sm bordered">
                Servicio a domicilio
              </Button>
            </div>
          </div>
          <div className="col-span-full">
            <div className="mb-3 sm:mb-6">
              <Button disabled={!actLocal || !isProviedor} bg="btn-transparent" tc="text-secondary hover:text-white" onClick={onServicioLocal} className="sm:h-[80px] lg-text-[26px] bordered">
                Servicio en el local
              </Button>
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default Service;
