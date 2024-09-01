import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import {BiUser} from "react-icons/bi"
import Button from "../atoms/Button";
import { startLogout } from "../../store";
import { startListServicios } from "../../store/servicios";
import {  useNavigate, useParams } from "react-router-dom";
import { googleLogout } from '@react-oauth/google';
import Input from "../atoms/Input";
import _fetch from '../../wrappers/_fetch'

import { useForm } from "../../hooks/useForm";
import { setEmptySearch, updateListService } from "../../store/servicios/serviciosSlice";

  const formData = {
    search_head: '',
  }

export const Navbar = ({onClick}) => {
  const {providerid} = useParams();
  const { status } = useSelector( state => state.auth );
  const { services } = useSelector( state => state.servicios );
 
  const [online, setOnline] = useState(true)
  const [access, setAccess] = useState(true)
  const [token, setToken] = useState('')


  const { formState, search_head, onInputChange } =useForm(formData);

  const dispatch = useDispatch();

  useEffect(() => {
    setToken(localStorage.getItem("authToken"))
  }, [])
  
  useEffect(() => {
    setTimeout(async () => await autoLogin(), 500)
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
        const urlPath = `${urlApi}/auth`;
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
            .then(async (json) => {                
								if (json.user) {
									let user = await JSON.stringify(json['user'])
									await localStorage.setItem(
										'authToken',
										'Bearer ' + json['data']['token']
									)
									await localStorage.setItem('user', user)

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

  return (
  <nav className="flex justify-center sm:justify-between flex-col sm:flex-row w-full pt-6">

        <div className="flex justify-end flex-row-reverse sm:w-2/3 rounded-2xl  mb-3 sm:mb-0" >

          <Input
            type="text"
            label="Buscar Servicio"
            name="search_head"
            value={ search_head }
            className="w-full rounded-2xl text-secondary search"
             onChange={ onInputChange }
            // error={ !!first_nameValid && formSubmitedd }
            // helperText={ first_nameValid }
          />
        </div>

    <div className="text-center sm:text-right md:text-right">
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

    </div>
  </nav>
  )
};

export default Navbar
