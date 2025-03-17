import teayudoAPI from "../../../api/teayudoAPI";

export const registerWhatsappApi = async ({ first_name, last_name, codePhone, phone }) => {
  await localStorage.setItem("phone", phone);
  await localStorage.setItem("codePhone", codePhone);
  await localStorage.setItem("first_name", first_name);
  await localStorage.setItem("last_name", last_name);
  try {
    const resp = teayudoAPI.post("/sendRegisterCode", { phone, codePhone });

    // if(!resp.ok) throw new Error(resp.error);

    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
