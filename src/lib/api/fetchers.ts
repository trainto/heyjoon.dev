import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import queryString, { StringifiableRecord } from 'query-string';

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'https://api.heyjoon.dev' : '/api';

export const fetcher = async <T>(url: string, query?: StringifiableRecord) => {
  const axiosConfig: AxiosRequestConfig = {
    method: 'GET',
    url: query ? queryString.stringifyUrl({ url, query }) : url,
  };

  try {
    const res = await axios<AxiosResponse<T>>(axiosConfig);

    if (Math.floor(res.status / 100) === 2) {
      return res.data.data;
    } else {
      throw res;
    }
  } catch (err: unknown) {
    throw err;
  }
};
