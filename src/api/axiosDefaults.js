import axios from 'axios';

export const axiosDefaultsBaseUrl = 'https://squadup-api.herokuapp.com/';
export const axiosDefaultsHeadersPostContentType = "multipart/form-data";
export const axiosDefaultsWithCredentials = true;

axios.defaults.baseURL = axiosDefaultsBaseUrl;
axios.defaults.headers.post["Content-Type"] = axiosDefaultsHeadersPostContentType
axios.defaults.withCredentials = axiosDefaultsWithCredentials

export const axiosReq = axios.create();
export const axiosRes = axios.create();
