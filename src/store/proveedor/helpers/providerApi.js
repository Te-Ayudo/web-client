export const providerApi = async (slug) => {
  const urlApi = process.env.REACT_APP_API_URL;
  const urlPath = `${urlApi}/providerweb/${slug}`;

  try {
    const resp = await fetch(urlPath, {
      method: "GET",
    }).then(handleResponse);
    return resp;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw new Error(`API Request failed: ${error.message || "Unknown error"}`);
  }
};

export const getBranchById = async (branchId) => {
  const urlApi = process.env.REACT_APP_API_URL;
  const urlPath = `${urlApi}/enterprise/branches/${branchId}`;

  try {
    const resp = await fetch(urlPath, {
      method: "GET",
    }).then(handleResponse);
    return resp;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw new Error(`API Request failed: ${error.message || "Unknown error"}`);
  }
};

function handleResponse(response) {
  return response.text().then((text) => {
    let data;
    try {
      data = text && JSON.parse(text);
    } catch (error) {
      // Si no podemos parsear, devolvemos un error.
      return Promise.reject("Error parsing JSON response");
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Handle authentication error if necessary
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
