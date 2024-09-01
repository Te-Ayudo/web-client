
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

    const { data } = await providerApi();
    let error = data.error;
    if (error) {
      dispatch(provider_getall_failure(error.toString()));
      return;
    }

    dispatch(provider_getall_success(data));

    const myProvider = data.filter((e) => e.slugUrl === slug)[0];
    if (!myProvider) {
      dispatch(provider_getall_failure("Sin proveedor seleccionado"));
      return;
    }
    dispatch(provider_set(myProvider));
  };
};
