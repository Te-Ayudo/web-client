import _fetch from "../../../wrappers/_fetch";

export const employeeApi = async(method,service) => {

  const idProveedor = process.env.REACT_APP_ID_PROVIDER_EXAMPLE;
  const teayudoUrl= 'https://test.teayudo.com.bo/api/employee/provider/'+idProveedor;

  try {

    const resp = await _fetch( teayudoUrl, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						method: method,
						serviceCart: service
					}),
				});

    if(!resp.ok) throw new Error('No se pudo obtener la lista de empleados');

    const myResp = await resp.json();
    return myResp;

  } catch (error) {
    console.log(error);
    throw new Error( error.message );
  }


}
