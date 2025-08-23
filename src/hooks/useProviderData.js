import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { startListProveedores } from "../store/proveedor/thunks";

/**
 * Hook personalizado para cargar y mantener actualizada la información del proveedor
 * Utilizado para asegurar que los meta tags dinámicos tengan la información correcta
 */
export const useProviderData = () => {
  const dispatch = useDispatch();
  const { providerid } = useParams();

  const providerSelected = useSelector((state) => state.proveedor.selected);
  const isLoading = useSelector((state) => state.proveedor.loading);
  const error = useSelector((state) => state.proveedor.error);

  // Cargar datos del proveedor si tenemos un providerid y no hay datos cargados
  useEffect(() => {
    if (providerid && !providerSelected) {
      dispatch(startListProveedores(providerid));
    }
  }, [providerid, providerSelected, dispatch]);

  // Recargar si cambia el providerid
  useEffect(() => {
    if (providerid && providerSelected && providerSelected.slugUrl !== providerid) {
      dispatch(startListProveedores(providerid));
    }
  }, [providerid, providerSelected, dispatch]);

  return {
    provider: providerSelected,
    isLoading,
    error,
    hasProvider: !!providerSelected,
    providerId: providerid,
  };
};
