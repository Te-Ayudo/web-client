import teayudoAPI from "../../../api/teayudoAPI";

export const registerWhatsappOTPApi = async ({ codePhone, phone, code }) => {
  try {
    const resp = teayudoAPI.post("/validateRegisterCode", { phone, codePhone, code });

    // if(!resp.ok) throw new Error(resp.error);

    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
