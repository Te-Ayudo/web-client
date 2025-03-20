import _fetch from "../../../wrappers/_fetch";

export const employeeApi = async (method, service, id_prov) => {
  const baseUrl = process.env.REACT_APP_API_URL + `/employee/provider/${id_prov}`;

  // Construcción de parámetros de la URL
  const queryParams = new URLSearchParams({
    method: method,
    page: 1,
    perPage: 25,
    sort: "-id",
    state: "true",
  });

  // Agregar los servicios como serviceCart.0, serviceCart.1, etc.
  service.forEach((srv, index) => {
    queryParams.append(`serviceCart.${index}`, srv);
  });

  const fullUrl = `${baseUrl}?${queryParams.toString()}`;

  try {
    const resp = await _fetch(fullUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) throw new Error("No se pudo obtener la lista de empleados");

    const myResp = await resp.json();
    return myResp;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
