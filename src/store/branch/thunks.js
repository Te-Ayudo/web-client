import { branch_getall_failure, branch_getall_request, branch_getall_success } from "./branchSlice";
import { branchApi } from "./helpers";
import { getBranchById } from "../../wrappers/api";

export const startListSucursales = (filter = {}) => {
  return async (dispatch) => {
    dispatch(branch_getall_request());

    const { data } = await branchApi(filter);
    const error = data.error;

    if (error) {
      dispatch(branch_getall_failure(error.toString()));
      return;
    }

    dispatch(branch_getall_success({ data }));
  };
};

export const startGetBranchById = (branchId) => {
  return async (dispatch) => {
    try {
      const { data } = await getBranchById(branchId);
      return data;
    } catch (error) {
      console.error("Error al obtener sucursal:", error);
      throw error;
    }
  };
};
