export const categoryApi = async () => {
  const urlApi = process.env.REACT_APP_API_URL;
  const urlPath = `${urlApi}/categories`;

  try {
    const resp = await fetch(urlPath, {
      method: "GET",
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
