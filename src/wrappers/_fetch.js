export default async function _fetch(url, config) {
  try {
    const token = await localStorage.getItem("authToken");
    const body = (config && config.body) || null;
    const headers = (config && config.headers) || {};
    const configObject = {
      ...config,
      credentials: "omit",
      headers: {
        ...headers,
        "X-Request-With": "app",
        Authorization: String(token),
        Cookie: null,
      },
      body,
    };
    return await fetch(url, configObject);
  } catch (error) {}
}
