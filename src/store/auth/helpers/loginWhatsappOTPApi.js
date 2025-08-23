import teayudoAPI from "../../../api/teayudoAPI";

export const loginWhatsappOTPApi = async ({ phone, codePhone, code }) => {
  try {
    const resp = await teayudoAPI.post("/validateLoginCode", { codePhone, phone, code });

    //if(!resp.ok) throw new Error('No se pudo crear el usuario');

    //const myResp = await resp.json();
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
