import axios from "axios";

const teayudoAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

teayudoAPI.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    "x-token": localStorage.getItem("token"),
  };
  return config;
});

export default teayudoAPI;
