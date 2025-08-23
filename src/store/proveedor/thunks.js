import { providerApi } from "./helpers";
import {
  provider_getall_failure,
  provider_getall_request,
  provider_getall_success,
  provider_set,
} from "./proveedorSlice";

export const startListProveedores = (slug) => {
  return async (dispatch) => {
    dispatch(provider_getall_request());

    try {
      const { data } = await providerApi(slug); // ← ya es un solo proveedor

      if (!data || !data.slugUrl || data.slugUrl !== slug) {
        // proveedor inválido o slug no coincide
        dispatch(
          provider_getall_failure({
            message: "Este proveedor aún no tiene activada su web para clientes",
            code: 404,
          })
        );
        return;
      }

      dispatch(provider_getall_success([data])); // aún puedes guardar como array
      dispatch(provider_set(data)); // este es el proveedor actual
    } catch (error) {
      dispatch(
        provider_getall_failure({
          message: error.message || "Error al cargar el proveedor",
          code: 500,
        })
      );
    }
  };
};
