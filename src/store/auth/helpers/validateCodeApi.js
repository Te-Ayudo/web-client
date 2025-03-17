import teayudoAPI from "../../../api/teayudoAPI";

export const validateCodePhone = async ({ codePhone, phone, code }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const resp = teayudoAPI.post("/validateCodePhone", { _id: user._id, phone, codePhone, code });

    // if(!resp.ok) throw new Error(resp.error);

    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
