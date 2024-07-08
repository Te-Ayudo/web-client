import _fetch from "../../../wrappers/_fetch";

export const registerApi = async(nombre,coordenada,idUser) => {

  const teayudoUrl= 'https://test.teayudo.com.bo/api/registerDirection';
  const newcoord = {
    latitude:coordenada.lat,
    longitude:coordenada.lng
  }
  console.log(nombre, newcoord ,idUser);
  try {

    const resp = await _fetch( teayudoUrl, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						direction: nombre,
						coordinates: newcoord,
						//street: this.state.street,
						//house: this.state.house,
						//city: c,
						// reference: this.state.reference,
						// phone: this.state.phone,
						idUser: idUser,
					}),
				});

    if(!resp.ok) throw new Error('No se pudo crear la direccion');

    const myResp = await resp.json();
    return myResp;

  } catch (error) {
    console.log(error);
    throw new Error( error.message );
  }


}
