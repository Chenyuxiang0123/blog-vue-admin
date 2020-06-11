import axios from "axios";
// import { Message } from "element-ui";
// import store from "@/store";
// import { getToken } from "@/utils/auth";

const baseURL = process.env.NODE_ENV === "development" ? "/admin" : "/web";
const http = axios.create({
  baseURL,
  timeout: 10000
});

http.interceptors.request.use(config => {
  return config;
});

http.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);

export default http;
