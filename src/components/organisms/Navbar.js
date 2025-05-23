import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import {BiCart, BiUser} from "react-icons/bi"
import Button from "../atoms/Button";
import { login, startLogout } from "../../store";
import { startListServicios } from "../../store/servicios";
import {  useNavigate, useParams } from "react-router-dom";
import { googleLogout } from '@react-oauth/google';
import Input from "../atoms/Input";
import _fetch from '../../wrappers/_fetch'
import ButtonCarrito from "./Button";

import { useForm } from "../../hooks/useForm";
import { setEmptySearch, updateListService } from "../../store/servicios/serviciosSlice";
import CartSidebar from "./CartSidebar";

  const formData = {
    search_head: '',
  }

export const Navbar = ({ onClick, hideUI = false }) => {
  const {providerid} = useParams();
  const { status } = useSelector( state => state.auth );
  const { services } = useSelector( state => state.servicios );
  const [showCart, setShowCart] = useState(false);
 
  const [online, setOnline] = useState(true)
  const [access, setAccess] = useState(true)
  const [token, setToken] = useState('')


  const { formState, search_head, onInputChange } =useForm(formData);

  const dispatch = useDispatch();

  useEffect(() => {
    let storageToken = localStorage.getItem("authToken");
    let userStorage = localStorage.getItem("user");
    if (storageToken) {
      setToken(storageToken)
      if (userStorage) {
        dispatch(login(JSON.parse(userStorage)));
      }
    }
    setToken(localStorage.getItem("authToken"))
  }, [])
  
  useEffect(() => {
    setTimeout(async () => await autoLogin(), 0)
  }, [token])
  
   useEffect(() => {
      if(search_head.length > 2){
        dispatch( updateListService(search_head) )
      }else{
        dispatch( setEmptySearch() )
      }
   }, [formState])

  //const
  const navigate = useNavigate();

  const isCheckingAuthentication =  useMemo( () => status === 'authenticated',[status] );

  const onLogout = ( event ) => {
    event.preventDefault();
    dispatch( startLogout());
    googleLogout();
    navigate(`/${providerid}/`);
  }
  const isProviedor=!!providerid;


  const isAvailable = async () => {
		const timeout = new Promise((resolve, reject) => {
			setTimeout(reject, 5000, 'Request timed out')
		})
    const urlApi = process.env.REACT_APP_API_URL;
    const urlPath = `${urlApi}/test?version=10-c`;
    const request = await fetch(urlPath)

		return await Promise.race([timeout, request])
			.then(async (response) => {
				if (response) {
					response.json().then((json) => {
						if (json.access) {
              setOnline(true)
              setAccess(true)
						} else {
              setAccess(false)
						}
					})
				}
			})
			.catch((error) => {
        setOnline(false)
				setTimeout(
					() =>
            Swal.fire('Tiempo de espera superado... Revisa tu conexión a internet'),
					500
				)
			})
	}
	const autoLogin = async () => {
    
    if (!!token) {
      await isAvailable()
			if (online) {
        const urlApi = process.env.REACT_APP_API_URL;
        const urlPath = `${urlApi}/authLogin`;
        await _fetch(urlPath, {
          method: 'GET',
					headers: {
            Accept: 'application/json',
						'Content-Type': 'application/json',
					},
          
				}).then(async (response) => {
          if (response) {
            response     
            .json()
            .then(async (data) => {                     
								if (data.data.user) {
                  let user = await JSON.stringify(data.data.user)
									await localStorage.setItem(
                    	'authToken',
                    	'Bearer ' + data.data.token
                    )
                  await localStorage.setItem('user', user)
                  dispatch(login(user));

								} else {
                  setToken('')
									await localStorage.removeItem('authToken')
									await localStorage.removeItem('user')
								
								}
							})
							.catch((error) => Swal.fire('Servidor offline'))
					} else {
						return Swal.fire('Servidor offline')
					}
				})
			}
		}
	}
  if (hideUI) return null;
  return (
  // return (
  <nav className="flex justify-center sm:justify-between flex-col sm:flex-row w-full pt-6">

        <div className="flex justify-end flex-row-reverse sm:w-2/3 rounded-2xl  mb-3 sm:mb-0" >

          <Input
            type="text"
            label="Buscar Servicio"
            name="search_head"
            value={ search_head }
            className="w-full rounded-2xl text-secondary search"
             onChange={ onInputChange }
          />
        </div>

    <div className="text-center flex justify-between gap-4 sm:text-right md:text-right">
    <ButtonCarrito
      onClick={() => setShowCart(true)}
      className="font-bold px-0 sm:pr-0"
      decoration={<BiCart size="2rem" className="text-primary" />}
    >
      <span className="inline">Carrito</span>
    </ButtonCarrito>
      {
        isProviedor?(
          <div>
            <Button
              className = {`font-bold px-0 sm:pr-0 ${ isCheckingAuthentication?"hidden":"" } `}
              href = {`/${providerid}/`}
              onClick = {onClick}
              decoration={<BiUser size="2rem" className="text-primary" />}>
              Iniciar Sesión
            </Button>
            <Button
              className = {`font-bold px-0 sm:pr-0 ${ !isCheckingAuthentication?"hidden":"" } `}
              href = {`/${providerid}/logout`}
              onClick = {onLogout}
              decoration={<BiUser size="2rem" className="text-primary" />}>
              Cerrar Sesión
            </Button>
          </div>
        ):''
      }
      <CartSidebar visible={showCart} onClose={() => setShowCart(false)} />
    </div>
  </nav>
  )
};

export default Navbar
