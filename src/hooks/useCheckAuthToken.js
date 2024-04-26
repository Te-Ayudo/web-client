import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/auth";
import { useEffect } from "react";
import { startListServicios } from "../store/servicios";
import { setDesactiveLoading, setItems } from "../store/carrito/carritoSlice";


export const useCheckAuthToken = () => {

  const { status } = useSelector( state => state.auth );
  const dispatch = useDispatch();

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('carrito');
    return localStorageCart ? JSON.parse(localStorageCart):[]
  }

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.clear();
      dispatch(logout());
      dispatch( startListServicios() );
      return ;
    }

    const email = localStorage.getItem("email");
    const first_name = localStorage.getItem("first_name");
    const last_name = localStorage.getItem("last_name");
    const _id = localStorage.getItem("uid");

    const formData = {
      uid: _id,
      email: email,
      displayName: first_name + " " + last_name,
      photoURL: "",
    };

    dispatch(login(formData));
    dispatch( startListServicios() );
    dispatch( setDesactiveLoading() );
    dispatch( setItems(initialCart()) );
  }, []);


  return {
    status
  }

}
