import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/auth";
import { useEffect, useState } from "react";
import { startListServicios } from "../store/servicios";
import { provider_set, startListCategoria, startListProveedores } from "../store";

export const useCheckAuthToken = () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    const crd = pos.coords;
    localStorage.setItem("latitude", crd.latitude);
    localStorage.setItem("longitude", crd.longitude);
  }

  function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then(function (result) {
        if (result.state === "granted") {
          //If granted then you can directly call your function here
          navigator.geolocation.getCurrentPosition(success, errors, options);
        } else if (result.state === "prompt") {
          //If prompt then the user will be asked to give permission
          navigator.geolocation.getCurrentPosition(success, errors, options);
        } else if (result.state === "denied") {
          //If denied then you have to show instructions to enable location
        }
      });
    } else {
    }
  };
  getUserLocation();

  const { status } = useSelector((state) => state.auth);
  const providerList = useSelector((state) => state.proveedor.item);
  const providerSelect = useSelector((state) => state.proveedor.selected);

  const dispatch = useDispatch();

  // const [items, setItems] = useState([]);

  const { selected } = useSelector((state) => state.booking);

  // useEffect(() => {
  //   // console.log('update cart ....');
  //   // console.log(selected.serviceCart);
  //   localStorage.setItem('carrito', JSON.stringify(selected.serviceCart)  );
  // }, [items,selected]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      dispatch(logout());
      return;
    }

    dispatch(startListCategoria());
    // const currentSlug = window.location.pathname.split('/')[1];
    // dispatch( startListProveedores(currentSlug) );
    // const items = JSON.parse(localStorage.getItem('carrito'));
    // if (items) {
    // setItems(items);
    // }

    const user = JSON.parse(localStorage.getItem("user"));
    const email = user.email;
    const first_name = user.first_name;
    const last_name = user.last_name;
    const _id = user.id;
    const formData = {
      uid: _id,
      email: email,
      displayName: first_name + " " + last_name,
      photoURL: "",
    };
    dispatch(login(formData));
  }, []);

  useEffect(() => {
    /* loading proveedores y servicios */

    const currentSlug = window.location.pathname.split("/")[1];
    const myProvider = providerList.filter((e) => e.slugUrl === currentSlug)[0];
    if (!myProvider) {
      return;
    }
    dispatch(provider_set(myProvider));
    // Eliminamos la llamada innecesaria a startListServicios
    // dispatch( startListServicios(providerSelect) );

    /* fin loading proveedores y servicios*/
  }, [providerList]);

  return {
    status,
  };
};
