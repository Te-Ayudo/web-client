import { checkingCredentials, clearErrorMessage, confirmation, login, loginWhatsapp, logout } from "./";
import { registerApi } from "./helpers/registerApi";
import { registerWhatsappApi } from "./helpers/registerWhatsappApi";
import { loginApi } from "./helpers/loginApi";
import { loginWhatsappApi } from "./helpers/loginWhatsappApi";
import { loginGoogleapi } from "./helpers/loginGoogleapi";
import { loginWhatsappOTPApi } from "./helpers/loginWhatsappOTPApi";
import { registerWhatsappOTPApi } from "./helpers/registerWhatsappOTPApi";
import { sendCodeApi } from "./helpers/sendCodeApi";
import { validateCodePhone } from "./helpers/validateCodeApi";
import { updateCustomer } from "./helpers/updateCustomerApi";


export const checkingAuthentication = (email,password) => {
  return async(dispatch)=>{
   dispatch(checkingCredentials());
  }
}

export const startCreatingUserWithEmailPassword = ({ first_name,last_name,email,password,phone,role },onConfirmation) => {

 return async(dispatch) => {

    dispatch(checkingCredentials());
    const result = await registerApi({first_name,last_name,email,password,phone,role });

    const newResult = {
      email: email,
    }

    if( result.error )
       return dispatch( logout( result ) );

    dispatch( confirmation(newResult) );

    onConfirmation();
 }

}

export const sendCodeWithWhatsapp = ({ first_name, last_name, codePhone, phone }, onConfirmation) => {
  return async (dispatch) => {
    const { data, ...res } = await sendCodeApi({ first_name, last_name, codePhone, phone });

    const responseJSON = data;
    if (responseJSON.error) {
      dispatch(logout(data));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
      return;
    }
    if (!responseJSON.error) { 
      onConfirmation();
    }
  };
};

export const startUserWithWhatsapp = ({ code }, onConfirmation) => {
  return async (dispatch) => {
    const codePhone = localStorage.getItem("codePhone");
    const phone = localStorage.getItem("phone");
    // dispatch(checkingCredentials());
    const { data } = await validateCodePhone({ codePhone, phone, code });
    
    if (data.error) {
      dispatch(logout(data));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
      return;
    }

    if (data.data) {
      const { data } = await updateCustomer({ codePhone, phone });      
      // const responseJSON = data;
      if (data.error) {
        dispatch(logout(data));
        setTimeout(() => {
          dispatch(clearErrorMessage());
        }, 10);
        return;
      }
      if (!data.error) {
        // await localStorage.setItem("authToken", "Bearer " + data.token);
        await localStorage.setItem("user", JSON.stringify(data));
        const formData = {
          uid: data._id,
          phone: data.phone,
          codePhone: data.codePhone,
          displayName: data.first_name + " " + data.last_name,
          photoURL: "",
        };
        dispatch(loginWhatsapp(formData));
        onConfirmation();
      }
    }
  };
};

export const sendRegisterCodeWithWhatsapp = ({ first_name,last_name,codePhone,phone },onConfirmation) => {
 return async(dispatch) => {

    dispatch( checkingCredentials() );
    const { data } = await registerWhatsappApi({ first_name, last_name, codePhone, phone });

    const responseJSON = data;      
    if (responseJSON.error) {
      dispatch(logout(data));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
      return;
    }
    if (!responseJSON.error) {     
      onConfirmation();
    }
 }
}

export const startCreatingUserWithWhatsapp = ({ code },onConfirmation) => {
 return async(dispatch) => {
    const codePhone = localStorage.getItem('codePhone');
    const phone = localStorage.getItem('phone');
    dispatch( checkingCredentials() );
    const { data } = await registerWhatsappOTPApi({ codePhone, phone, code });
    if (data.error) {
      dispatch(logout(data));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
      return;
    }

    if (data.data.user) {
      
      const { data } = await registerApi({ codePhone, phone });
      if (data.error) {
        dispatch(logout(data));
        setTimeout(() => {
          dispatch(clearErrorMessage());
        }, 10);
        return;
      }
      if (!data.error) {      
        await localStorage.setItem("authToken", "Bearer " + data.token);
        await localStorage.setItem("user", JSON.stringify(data.user));
        const formData = {
          uid: data.user._id,
          phone: data.user.phone,
          codePhone: data.user.codePhone,
          displayName: data.user.first_name + " " + data.user.last_name,
          photoURL: "",
        };
        dispatch(loginWhatsapp(formData));
        onConfirmation();
    }
  }
 }
}

export const startLoginGoogle = (user,navigation) => {
  return async(dispatch) => {
    const {data} = await loginGoogleapi(user);    
		let responseJSON = data;
		let error = data?.error;

    if( error ) {
      dispatch( logout( data ) );
      setTimeout(() => {
        dispatch( clearErrorMessage() );
      },10);
      return;
    }
    if (responseJSON?.error) {      
      responseJSON = {
        user: {
          role: false,
        },
      }
    }

    if( responseJSON?.token  ){
        const data ={
          uid:user.id,
          email:user.email,
          displayName:user.name,
          photoURL:user.picture
        }
     		await localStorage.setItem(
				 	'authToken',
		 		 	'Bearer ' + responseJSON?.token
		 		)
		 		await localStorage.setItem('user', JSON.stringify( data ) )
        dispatch(login(data));

       navigation();
      } else if (!error) {
				await localStorage.removeItem('authToken')
				return setTimeout(
					function () {
						//Alert.alert('Debes ingresar con una cuenta de cliente.')
            dispatch( clearErrorMessage() );
					},
					150
				)
			}

  }
}

export const startLoginWithEmailPassword = ({email, password,role},onServicios) => {
  return async(dispatch) => {
    dispatch( checkingCredentials() );
    const { data } = await loginApi({email, password, role});
		let responseJSON = data;
		let error = data.error;

    if( error ) {
      dispatch( logout( data ) );
      setTimeout(() => {
        dispatch( clearErrorMessage() );
      },10);
      return;
    }
    if (responseJSON.error) {
      responseJSON = {
        user: {
          role: false,
        },
      }
    }
    if (
      !error &&
      responseJSON.user.role !== 'proveedor-empleado' &&
      responseJSON.user.role !== 'empleado' &&
      responseJSON.user.role !== 'proveedor-empresa' &&
      responseJSON.user.state
    ){
    		await localStorage.setItem(
					'authToken',
					'Bearer ' + responseJSON['data']['token']
				)
				await localStorage.setItem('user', JSON.stringify(responseJSON['user']) )

      const formData = {
        uid:        data.user._id,
        email:     data.user.email,
        displayName:   data.user.first_name+' '+data.user.last_name,
        photoURL:    '',
      }

      dispatch( login(formData) );

      onServicios();

    }else if (!responseJSON.user.state) {
				await localStorage.removeItem('authToken')
				return setTimeout(
					function () {
          //	Alert.alert('Tu cuenta está inhabilitada')
              dispatch( clearErrorMessage() );
					},
					150
				)
			} else if (!error) {
				await localStorage.removeItem('authToken')
				return setTimeout(
					function () {
						//Alert.alert('Debes ingresar con una cuenta de cliente.')
            dispatch( clearErrorMessage() );
					},
					150
				)
			}

			return true

  }
}

export const startLoginWithWhatsapp = ({phone,codePhone}, onServicios) => {
  return async(dispatch) => {
    dispatch( checkingCredentials() );
    const { data } = await loginWhatsappApi({ phone, codePhone });
		let error = data.error;

    if( error ) {
      dispatch( logout( data ) );
      setTimeout(() => {
        dispatch( clearErrorMessage() );
      },10);
      return;
    }
		if (
			!error       
		){
      await localStorage.setItem('phone', phone);
      await localStorage.setItem('codePhone', codePhone);
      onServicios();
    }
  }
}  

export const startLoginWithWhatsappOTP = ({otpCode}, onServicios) => {
  return async(dispatch) => {
    dispatch( checkingCredentials() );
    const phone = localStorage.getItem('phone');
    const codePhone = localStorage.getItem('codePhone');
    const { data } = await loginWhatsappOTPApi({ phone, codePhone, code: otpCode });
		let responseJSON = data;    
    let error = data.error;
    if( error ) {
      dispatch( logout( data ) );
      setTimeout(() => {
        dispatch( clearErrorMessage() );
      },10);
      return;
    }
    if (
      responseJSON.data.user.state
		){           
				await localStorage.setItem(
					'authToken',
					'Bearer ' + responseJSON['data']['token']
				)
				await localStorage.setItem('user', JSON.stringify(responseJSON['data']['user']) )          
        
        const formData = {
          uid:        data.data.user._id,
          phone:  data.data.user.phone,
          codePhone: data.data.user.codePhone,
          displayName:   data.data.user.first_name+' '+data.data.user.last_name,          
          photoURL:    '',
        }
        
        dispatch( loginWhatsapp(formData) );
        onServicios();
    }
  }
}

export const startLogout = () => {
  return (dispatch) => {
		  localStorage.setItem('authToken', '')
		  localStorage.setItem('user', '')
      dispatch(logout());
  }
}
