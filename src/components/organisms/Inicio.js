import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../atoms/Button";
import { BOOKING_ISINBRANCH, BOOKING_NOTISINBRANCH, startListServicios } from "../../store";

export const Service = () => {
  const { providerid } = useParams();
  const [actDomicilio, setActDomicilio] = useState(false);
  const [actLocal, setActLocal] = useState(false);

  const { status } = useSelector((state) => state.auth);
  const provideSelect = useSelector((state) => state.proveedor.selected);
  const servicesList = useSelector((state) => state.servicios.services);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const onServicioLocal = (event) => {
    event.preventDefault();
    dispatch(BOOKING_ISINBRANCH());
    status === "authenticated" ? navigate(`/${providerid}/sucursales`) : navigate(`/${providerid}/login`);
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
      {/* <h3 className="h3 text-primary">
        Quieres tu servicio <br />
        en el local o a domicilio?
      </h3> */}
      {/* <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
        Bienvenido a <span className="text-orange-500">{capitalizedName}</span>
      </h1> */}
      {/* <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
        Hola,&nbsp;
        <span className="text-orange-500">{storageUser}</span>
        <span className="text-3xl">👋</span>
      </h1> */}
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
    </div>
  );
};

export default Service;
