import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Input from "../atoms/Input";
import Button from "../atoms/Button";

import { useNavigate } from 'react-router-dom';
import { startCreatingUserWithEmailPassword } from "../../store";
import { useForm } from "../../hooks/useForm";
import { Alert } from "../atoms/Alert";

const formValidations = {
  email: [ (value) => value.includes('@'), 'El correo debe de tener una @' ],
  password: [ (value) => value.length >= 6, 'El password debe de tener mas de 6 letras.' ],
  first_name: [ (value) => value.length >= 1, 'El nombre es obligatorio' ],
  last_name: [ (value) => value.length >= 1, 'El nombre es obligatorio' ],
}

const formData = {
  email:        '',
  password:     '',
  first_name:   '',
  last_name:    '',
  phone:        '',
  role:         'cliente',
}

export const Registro = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formSubmitedd, setFormSubmitedd] = useState(false)

  const {status,error} = useSelector( state => state.auth );
  const isCheckingAuthentication =  useMemo( () => status === 'checking',[status] );


  const {
    formState,first_name,last_name,email,password,phone,onInputChange,
    isFormValid,first_nameValid,last_nameValid,emailValid,passwordValid
  } = useForm(formData,formValidations);

  const onConfirmation = () => {
    const currentSlug = window.location.pathname.split('/')[1];
    navigate(`/${currentSlug}/confirmacion`);
  }

  const onSubmit = ( event ) => {
    event.preventDefault();
    setFormSubmitedd(true);

    if( !isFormValid ) return ;

    dispatch( startCreatingUserWithEmailPassword(formState,onConfirmation) );
  }
  return (
  <form className="text-center" method="POST" onSubmit={ onSubmit } >
    <h3 className="h3 text-primary">Crear Cuenta</h3>
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Input
          type="text"
          label="Nombre(s)"
          name="first_name"
          value={ first_name }
          onChange={ onInputChange }
          error={ !!first_nameValid && formSubmitedd }
          helperText={ first_nameValid }
        />
      </div>
    </div>
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Input
          type="text"
          label="Apellido(s)"
          name="last_name"
          value={ last_name }
          onChange={ onInputChange }
          error={ !!last_nameValid && formSubmitedd }
          helperText={ last_nameValid }
        />
      </div>
    </div>
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Input
          type="email"
          label="Correo electrónico"
          name="email"
          value={ email }
          onChange={ onInputChange }
          error={ !!emailValid && formSubmitedd }
          helperText={ emailValid }
        />
      </div>
    </div>
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Input
          type="password"
          label="Contraseña"
          name="password"
          value={ password }
          onChange={ onInputChange }
          error={ !!passwordValid && formSubmitedd }
          helperText={ passwordValid }

        />
      </div>
    </div>
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Input
          type="text"
          label="Teléfono"
          name="phone"
          value={ phone }
          onChange={ onInputChange }
        />
      </div>
    </div>


    <div className={`col-span-full ${!!error?'':'hidden'} `}  >
      <Alert mensaje={error} />
    </div>

    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Button
          disabled={ isCheckingAuthentication }
          type='submit'
          className="sm:h-[48px] !text-[14px]">
          Registrarse
        </Button>
      </div>
    </div>
  </form>

  )

}

export default Registro
