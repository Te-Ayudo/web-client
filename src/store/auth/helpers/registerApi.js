export const registerApi = async ({ codePhone, phone }) => {
  const teayudoUrl = process.env.REACT_APP_API_URL + "/completeProfile";
  const first_name = localStorage.getItem("first_name");
  const last_name = localStorage.getItem("last_name");

  const formData = new FormData();
  formData.append(
    "data",
    JSON.stringify({
      first_name: first_name,
      last_name: last_name,
    })
  );
  formData.append("codePhone", codePhone);
  formData.append("phone", phone);

  try {
    const resp = await fetch(teayudoUrl, {
      method: "POST",
      body: formData,
    });

    if (!resp.ok) throw new Error("No se pudo crear el usuario");

    const myResp = await resp.json();
    return myResp;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
