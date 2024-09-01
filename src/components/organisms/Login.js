import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { startLoginGoogle, startLoginWithEmailPassword } from "../../store/auth";

import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Logo from "../atoms/Logo";
import { useForm } from "../../hooks/useForm";
import Swal from "sweetalert2";
import { startListServicios } from "../../store";
import { useGoogleLogin  } from '@react-oauth/google';
import axios from "axios";
import SVGComponent from "../atoms/Gmail";

const formData = {
  email: '',
  password: '',
  role: 'cliente'
}

export const Login = () => {
  const {providerid} = useParams();

  const [formSubmitedd, setFormSubmitedd] = useState(false)
  const { error } = useSelector( state => state.auth );
  const {selected} = useSelector( state => state.booking );
  const myprov = useSelector( state => state.proveedor.selected );
  
  const [ userg, setUserg ] = useState([]);

  useEffect(() => {

    if (userg) {

    axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${userg.access_token}`, {
      headers: {
          Authorization: `Bearer ${userg.access_token}`,
          Accept: 'application/json'
      }
  })
  .then((res) => {
    dispatch(startLoginGoogle(res.data,onInicio))
  })
  .catch((err) => console.log(err));
    }

  }, [userg])


  useEffect(() => {
    if( error !== null && formSubmitedd ){
      Swal.fire('Error en la authentificacion',error,'error')
    }

  }, [error])

  const { email, password,role, onInputChange, formState } = useForm( formData ) ;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onInicio = () => {
    navigate(`/${providerid}/`)
  }
  const onServicios = () => {
    navigate(`/${providerid}/`)
  }

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUserg(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });
  const onSubmit = (event) => {
    event.preventDefault();
    setFormSubmitedd(true);

    dispatch( startListServicios() );
    dispatch(startLoginWithEmailPassword({email,password,role},onServicios));
  }

  const isProviedor=!!providerid;

  return (
<>
  {
    myprov===undefined?('Error en el proveedor'):(
      <div>

   <form className="text-center" method="POST" onSubmit={ onSubmit } >
    <Logo className="h-8 sm:h-14 mb-6 sm:mb-14 " />
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Input
          type="email"
          label="Email"
          name= "email"
          value={email}
          onChange={ onInputChange }
        />
      </div>
    </div>
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Input
          type="password"
          label="Contraseña"
          name= "password"
          value={password}
          onChange={ onInputChange }
        />
      </div>
    </div>
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6 text-right">
        <Button
          bg = "bg-transparent"
          tc= "text-primary"
          className = "font-[400] !p-0 !text-[14px] !sm:text-[13px]"
          href = "https://app.teayudo.com.bo/#/forgotPassword?role=cliente"
        >
          Olvidaste tu contraseña?
        </Button>
      </div>
    </div>
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Button
          //href={"/empresa"}
          disabled={ !isProviedor }
          type="submit"
          bg="bg-primary w-[250px] sm:w-[270px] mx-auto hover:bg-white "
          tc="text-white hover:text-secondary"
          className="sm:h-[48px] !text-[14px] bordered">
          Ingresar
        </Button>
      </div>
    </div>
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Button
          href={`/${providerid}/registrarse`}
          bg="btn-transparent w-[250px] sm:w-[270px] mx-auto"
          tc="text-secondary hover:text-white "
          className="sm:h-[48px] !text-[14px] bordered">
          Registrarse
        </Button>
      </div>
    </div>
  </form>
    <div className="text-center" >
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Button 
          disabled={ !isProviedor }
          onClick={ ()=> login()}
          bg="btn-transparent w-[250px] sm:w-[270px] mx-auto"
          tc="text-secondary hover:text-white "
          className="sm:h-[48px] !text-[12px] bordered mt-0 p-0 "
          >
            <div className="grid grid-cols-3 gap-4  w-full text-center justify-center" >
              <span className="flex  text-right items-center justify-end " >
                <SVGComponent width={'25px'} heigh={'25px'} fill={'#9c9a9a'}   />
              </span>
              <span className="col-span-2 text-left items-center pt-1" > Iniciar sesión con Google</span>
            </div>

        </Button>
      </div>
    </div>

    </div>
    
      </div>
    )
  }



</>
  )
}

export default Login
