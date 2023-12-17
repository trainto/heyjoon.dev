import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import queryString, { StringifiableRecord } from 'query-string';
import { generateSha256 } from '../utils-client';

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'https://api.heyjoon.dev' : '/api';

axios.interceptors.request.use(async (config) => {
  const timeStamp = Date.now();
  config.headers.set('X-Heyjoon-Time', timeStamp);
  config.headers.set(
    'X-Heyjoon-Token',
    await generateSha256(
      timeStamp + ':' + (process.env.NEXT_PUBLIC_SECRET || '') + ':' + config.url?.split('?').pop(),
    ),
  );

  return config;
});

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
