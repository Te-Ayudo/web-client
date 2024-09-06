
export const registerApi = async({ first_name,last_name,email,password,phone,role }) => {

  const teayudoUrl= process.env.REACT_APP_API_URL + '/register';

  const formData = new FormData();
  formData.append('first_name',first_name);
  formData.append('last_name',last_name);
  formData.append('email',email);
  formData.append('password',password);
  formData.append('phone',phone);
  formData.append('role',role);

  try {

    const resp = await fetch( teayudoUrl, {
      method: 'POST',
      body: formData
    });

    if(!resp.ok) throw new Error('No se pudo crear el usuario');

    const myResp = await resp.json();
    return myResp;

  } catch (error) {
    console.log(error);
    throw new Error( error.message );
  }


}
