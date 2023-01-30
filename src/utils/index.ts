/* eslint-disable react-hooks/rules-of-hooks */
import { STYLING_CONFIGS } from "../styles/constants";
import axios from "./axios";

export function pxToRem(size: number) {
  return `${Number(size / STYLING_CONFIGS.ROOT_SIZE)}rem`;
}

export const getErrorMessage = (error: any) => {
  if (error.response) {
    if (error.response.status === 401) {
      return "You are not authorized";
    }
    if (error.response.status === 404) {
      return "Resource not found";
    }
    if (error.response.status === 403) {
      return "You are not authorized";
    }
    if (error.response.data) {
      return error.response.data.message;
    }
  }

  return error.message;
};

export const getNotifs = async () => {
  let notifC = 0;
  try {
    const { data } = await axios.get("/api/notifications/all");
    let filteredData = await data.data.filter(
      (data: any) => data.is_read === 0 && data.body.includes("{")
    );
    notifC = filteredData.length;
    return notifC;
  } catch (error) {
    return notifC;
  }
};
