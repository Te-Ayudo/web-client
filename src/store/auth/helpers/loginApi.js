import teayudoAPI from "../../../api/teayudoAPI";

export const loginApi = async ({ email, password, role }) => {
  try {
    const resp = await teayudoAPI.post("/login", { email, password, role });

    //if(!resp.ok) throw new Error('No se pudo crear el usuario');

    //const myResp = await resp.json();
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
