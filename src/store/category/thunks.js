import { category_getall_failure, category_getall_request, category_getall_success } from "./categorySlice";
import { categoryApi } from "./helpers/categoryApi";

export const startListCategoria = () => {
  return async (dispatch) => {
    dispatch(category_getall_request());

    const { data } = await categoryApi();
    const error = data.error;
    if (error) {
      dispatch(category_getall_failure(error.toString()));
      return;
    }

    dispatch(category_getall_success(data));
  };
};
