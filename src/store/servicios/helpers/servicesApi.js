
export const servicesApi = async(idProveedor = '') => {

  const urlApi = process.env.REACT_APP_API_URL;
  const urlPath = `${urlApi}/service/provider/${idProveedor}`;

  try {
    const resp = await fetch( urlPath , {
      method: 'GET'
    }).then( handleResponse );
    return resp;
  } catch (error) {

    console.log(error);
    throw new Error( error.message );
  }

}

export const servicesByIdsApi = async(serviceIds = []) => {

  const urlApi = process.env.REACT_APP_API_URL;
  const urlPath = `${urlApi}/service/by-ids`;


  try {
    const resp = await fetch( urlPath , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ serviceIds })
    }).then( handleResponse );
    
    return resp;
  } catch (error) {

    throw new Error( error.message );
  }

}

function handleResponse(response) {
    return response.text().then(text => {

        const data = text && JSON.parse(text);

        if (!response.ok) {
            const error = (data && data.message || data.error ) || response.statusText;
            return Promise.reject({message: error.toString(), code: response.status} );
        }

        return data;
    });
}
