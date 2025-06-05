import _fetch from "../../wrappers/_fetch";
import { BOOKING_CLEAR, BOOKING_COUPON_FAILURE, BOOKING_COUPON_SUCCESS, BOOKING_CREATE_REQUEST, BOOKING_SET_ERROR, BOOKING_SET_SUCESS } from "./bookingSlice";
import Swal from "sweetalert2";
import { registerApi } from "./helpers/registerApi";

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || data.error || response.statusText;
      return Promise.reject({ message: error, code: response.status });
    }
    return data;
  });
}

async function create(object, route) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(object),
  };

  return await _fetch(`${process.env.REACT_APP_API_URL}/${route}/`, requestOptions).then(handleResponse);
}

export const startCreateBooking = (booking, providerId, navigate) => {
  return async (dispatch) => {
    dispatch(BOOKING_CREATE_REQUEST(booking));

    create(booking, "booking").then(
      (data) => {
        // Al crear la reserva con éxito, redirigir al usuario usando el ID de la reserva
        console.log("Reserva creada con éxito:", data);
        const bookingId = data?.data._id; // Suponiendo que la respuesta tiene el ID de la reserva
        if (bookingId) {
          dispatch(BOOKING_CLEAR()); // Limpiar estado de la reserva
          // Redirigir al usuario a la página de éxito con el ID de la reserva
          navigate(`/${providerId}/gracias/${bookingId}`);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al procesar la reserva. Intenta nuevamente.",
          });
        }
      },
      (error) => {
        // En caso de error, mostrar alerta
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "No se pudo crear la reserva.",
        });
      }
    );
  };
};

export const startVerifyCoupon = (booking) => {
  const{code,services} = booking  
  return async(dispatch) => {

    dispatch(BOOKING_CREATE_REQUEST(booking));
    create({code,services},'coupon/verify').then(
      (response)=>{
        dispatch( BOOKING_COUPON_SUCCESS(response) );
				setTimeout(function () {
          Swal.fire('Cupon Aplicado.',response?.reason,'success')
				}, 500)
      },
      (error)=>{
        dispatch( BOOKING_COUPON_FAILURE(error) );
				setTimeout(function () {
          Swal.fire('Cupon Inválido.',error?.message,'error')
				}, 500)

      }
    );

  }
}

export const startCreateAddress = (nombre,coord) => {
  return async(dispatch) => {

		let user = JSON.parse(await localStorage.getItem('user'))
    let	idUser = user._id    
    const myResp = await registerApi(nombre,coord,idUser)

    if (myResp['error']) {
				return setTimeout(
					function () {
            dispatch(BOOKING_SET_ERROR(myResp['error']))
					}.bind(this),
					150
				)
			} else {
        await localStorage.setItem("user", JSON.stringify(myResp.data));
				return setTimeout(
					function () {
            dispatch(BOOKING_SET_SUCESS( 'Dirección registrada con éxito.' ));
					}.bind(this),
					150
				)
			}

  }
}
