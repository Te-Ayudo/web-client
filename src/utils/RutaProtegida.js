import { startListProveedores } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Navigate } from "react-router-dom";

export const RutaProtegida = ({ children }) => {
  const { providerid } = useParams();
  const dispatch = useDispatch();

  const { error, selected } = useSelector((state) => state.proveedor);
  const accesoBloqueado = Boolean(error?.message) || selected?.providerEnabledForWeb === false;

  // Cargar proveedor si no tiene slugUrl (ya fue seteado)
  useEffect(() => {
    if (providerid && (!selected?.slugUrl || selected?.slugUrl !== providerid)) {
      dispatch(startListProveedores(providerid));
    }
  }, [providerid, selected, dispatch]);

  if (accesoBloqueado) {
    return <Navigate to={`/${providerid}`} replace />;
  }

  return children;
};
