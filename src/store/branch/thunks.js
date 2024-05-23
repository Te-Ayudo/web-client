import { branch_getall_failure, branch_getall_request, branch_getall_success } from "./branchSlice";
import { branchApi } from "./helpers";

export const startListSucursales = (filter = {}) => {
  return async (dispatch) => {
    dispatch( branch_getall_request() )
    const idProveedor = process.env.REACT_APP_ID_PROVIDER_EXAMPLE;
    if (!idProveedor) throw new Error("El ID del proveedor no existe");
    const {data} = await branchApi(filter);

		let error = data.error;

    if( error  ) {
      dispatch( branch_getall_failure(error.toString()) );
      return;
    }

    dispatch( branch_getall_success({data}) )
  };
};
