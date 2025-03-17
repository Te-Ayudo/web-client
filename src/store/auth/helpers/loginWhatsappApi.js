import teayudoAPI from "../../../api/teayudoAPI";

export const loginWhatsappApi = async ({ phone, codePhone }) => {
  try {
    const resp = await teayudoAPI.post("/sendLoginCode", { phone, codePhone });

    //if(!resp.ok) throw new Error('No se pudo crear el usuario');

    //const myResp = await resp.json();
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
