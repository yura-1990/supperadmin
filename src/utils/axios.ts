import { getErrorMessage } from "./index";
import Axios, { AxiosRequestConfig } from "axios";
import { clearAccount } from "../store/account/accountSlice";
import store from "../store/store";
import { message } from "antd";

export const baseURL = "https://sport.napaautomotive.uz";
export const ImgUrl = `${baseURL}/storage/`;
const axios = Axios.create({ baseURL: baseURL });

axios.interceptors.request.use((configs: AxiosRequestConfig) => {
  const token = store.getState().account.token || "";
  configs.headers!.authorization = token ? `Bearer ${token}` : "";
  // configs.headers!.AcceptLanguage = 'en'
  return configs;
});

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    // console.log(error);
    message.error(getErrorMessage(error));
    if (error?.response?.status === 401) {
      return store.dispatch(clearAccount());
    }
    return Promise.reject(error);
  }
);

export { axios as default };
