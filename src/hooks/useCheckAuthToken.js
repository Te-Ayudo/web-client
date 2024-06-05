import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/auth";
import { useEffect, useState } from "react";
import { startListServicios } from "../store/servicios";
import { BOOKING_SET_CART, provider_set, startListCategoria, startListProveedores } from "../store";



export const useCheckAuthToken = () => {
 var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    var crd = pos.coords;
    localStorage.setItem("latitude", crd.latitude);
    localStorage.setItem("longitude", crd.longitude);

  }

  function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }


  const getUserLocation = () => {

    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          console.log(result);
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
      console.log("Geolocation is not supported by this browser.");
    }

  }
  getUserLocation();


  const { status } = useSelector( state => state.auth );
	const providerList = useSelector((state) => state.proveedor.item)
	const providerSelect = useSelector((state) => state.proveedor.selected)

  const dispatch = useDispatch();

  // const initialCart = () => {
  //   console.log('loadin ....');
  //   console.log(  JSON.parse( localStorage.getItem('carrito') ) );
  //   return JSON.parse( localStorage.getItem('carrito') );
  //   const localStorageCart = localStorage.getItem('carrito');
  //   return localStorageCart ? JSON.parse(localStorageCart):[]
  // }

  const [items, setItems] = useState([]);

  const { selected } = useSelector( state => state.booking );

  useEffect(() => {
    // console.log('update cart ....');
    // console.log(selected.serviceCart);
    localStorage.setItem('carrito', JSON.stringify(selected.serviceCart)  );
  }, [items,selected]);

  useEffect(() => {
    dispatch( startListCategoria() )
    const items = JSON.parse(localStorage.getItem('carrito'));
    // console.log(items);
    if (items) {
    setItems(items);
    }

     const token = localStorage.getItem("authToken");
     if (!token) {
       dispatch(logout());
       return ;
     }

    dispatch( startListProveedores() );
     const user = JSON.parse(localStorage.getItem("user"));
     const email =user.email;
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
    console.log('provider loading...');
  /* loading proveedores y servicios */

      const idProveedor = process.env.REACT_APP_ID_PROVIDER_EXAMPLE;

      const myProvider=providerList.filter((e) => e._id === idProveedor)[0]

      dispatch( provider_set(myProvider));

      dispatch( startListServicios(providerSelect) );

  /* fin loading proveedores y servicios*/


  }, [providerList])


  return {
    status
  }

}
