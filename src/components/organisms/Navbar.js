import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ReactSearchAutocomplete } from "react-search-autocomplete";
import {BiUser} from "react-icons/bi"
import Button from "../atoms/Button";
import { startLogout } from "../../store";
import { startListServicios } from "../../store/servicios";
import {  useNavigate } from "react-router-dom";
import { googleLogout } from '@react-oauth/google';
import Input from "../atoms/Input";

import { useForm } from "../../hooks/useForm";
import { setEmptySearch, updateListService } from "../../store/servicios/serviciosSlice";

  const formData = {
    search_head: '',
  }


export const Navbar = ({onClick}) => {
  const { status } = useSelector( state => state.auth );
  const { services } = useSelector( state => state.servicios );

  const { formState, search_head, onInputChange } =useForm(formData);

  const dispatch = useDispatch();

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

  // const items = dispatch(startListServicios());
  // console.log(items);

  const onLogout = ( event ) => {
    event.preventDefault();
    dispatch( startLogout());
    googleLogout();
    navigate('/');
  }



  const handleOnSelect = (item) => {
    //console.log(item);
    // navigate('/carrito');
  };


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

          {/* <ReactSearchAutocomplete
            placeholder="Buscar Servicio"
            items={services}
             onSelect={handleOnSelect}
            styling={{ zIndex: 4 }} // To display it on top of the search box below
            autoFocus
            className="w-full rounded-2xl text-secondary search"
          /> */}
        </div>

    <div className="text-center sm:text-right md:text-right">
      <Button
        className = {`font-bold px-0 sm:pr-0 ${ isCheckingAuthentication?"hidden":"" } `}
        href = "/login"
        onClick = {onClick}
        decoration={<BiUser size="2rem" className="text-primary" />}>
        Iniciar Sesión
      </Button>
      <Button
        className = {`font-bold px-0 sm:pr-0 ${ !isCheckingAuthentication?"hidden":"" } `}
        href = "/logout"
        onClick = {onLogout}
        decoration={<BiUser size="2rem" className="text-primary" />}>
        Cerrar Sesión
      </Button>
    </div>
  </nav>
  )
};

export default Navbar
