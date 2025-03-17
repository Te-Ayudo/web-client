import { servicesApi } from "./helpers"
import { setServices } from "./serviciosSlice";
import Swal from "sweetalert2";

export const startListServicios = (idProveedor=null) => {
  return async (dispatch) => {

    if (!!idProveedor){
      const {_id}=idProveedor;
      const services = await servicesApi(_id);
      dispatch(setServices(services.data));
    }

  };
};
export const startListServiciosbyProvider = (idProveedor) => {
  return async (dispatch) => {

    const idProveedora = process.env.REACT_APP_ID_PROVIDER_EXAMPLE;
    //if (!idProveedor) throw new Error("El ID del proveedor no existe");
    const services = await servicesApi(idProveedora);
    dispatch(setServices(services.data));
  };
};


export const startAddService = ({ _id,imageURL,unitPrice,name,description }) => {

return async(dispatch) =>{    

    const count =0;

    const { value: formValues } = await Swal.fire({
      title: "Cantidad",
      html: `
        ${name}
        ${description}
        <button >
            +
        </button>
            <input type="text" id="username" class="swal2-input" placeholder="Username">
        <input id="swal-input1" class="swal2-input" value="${count}">

      `,
      confirmButtonText: 'Agregar',
      focusConfirm: false,
      //didOpen: () => {
      //  const usernameInput = popup.querySelector('#username')
      //  usernameInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()
      //},
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
        ];
      }
    });
    if (formValues) {
      Swal.fire(JSON.stringify(formValues));
    }


  };
};
