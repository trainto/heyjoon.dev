import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import queryString, { StringifiableRecord } from 'query-string';

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'https://api.heyjoon.dev' : '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

export const fetcher = async <T>(url: string, query?: StringifiableRecord) => {
  const axiosConfig: AxiosRequestConfig = {
    method: 'GET',
    url: query ? queryString.stringifyUrl({ url, query }) : url,
  };

  try {
    const res = await axios<T>(axiosConfig);

    if (Math.floor(res.status / 100) === 2) {
      return res.data;
    } else {
      throw res;
    }
  } catch (err: unknown) {
    throw err;
  }
};

export const sendRequest = async <T>(config: AxiosRequestConfig) => {
  if (config.data && typeof config.data.append === 'function') {
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }

  try {
    return await axios<AxiosResponse<T>>(config);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return (
        err.response || { status: 600, statusText: 'Axios error does not have response!', data: '' }
      );
    }
    return { status: 600, statusText: (err as Error).message, data: '' };
  }
};
