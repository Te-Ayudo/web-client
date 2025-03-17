export const updateCustomer = async ({ codePhone, phone }) => {
  const teayudoUrl = process.env.REACT_APP_API_URL + "/updateCustomer";
  const first_name = localStorage.getItem("first_name");
  const last_name = localStorage.getItem("last_name");
  const user = JSON.parse(localStorage.getItem("user"));

  const formData = new FormData();
  formData.append("data", JSON.stringify({ 
    first_name: first_name, 
    last_name: last_name,
    phone: phone,
    codePhone: codePhone,
  }));
  formData.append("_id", user._id);
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
