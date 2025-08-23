import teayudoAPI from "../../../api/teayudoAPI";

export const sendCodeApi = async ({ first_name, last_name, codePhone, phone }) => {
  await localStorage.setItem("phone", phone);
  await localStorage.setItem("codePhone", codePhone);
  await localStorage.setItem("first_name", first_name);
  await localStorage.setItem("last_name", last_name);
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const resp = teayudoAPI.post("/sendCodePhone", { _id: user._id, phone, codePhone });

    // if(!resp.ok) throw new Error(resp.error);

    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
