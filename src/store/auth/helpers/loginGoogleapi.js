import _fetch from "../../../wrappers/_fetch";

export const loginGoogleapi = async (user = {}) => {
  const urlApi = process.env.REACT_APP_API_URL;
  const urlPath = `${urlApi}/loginSM`;

  try {
    const resp = await _fetch(urlPath, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then(handleResponse);
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        //  location.reload(true);
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
