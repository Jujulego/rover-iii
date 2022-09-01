import { Auth } from '@aws-amplify/auth';
import { AegisApi } from '@jujulego/aegis-api';
import axios, { AxiosRequestConfig } from 'axios';

// Api util
export const $api = new AegisApi<AxiosRequestConfig>(
  (req, signal, opts) =>
    axios.request({
      ...opts,
      method: req.method,
      baseURL: process.env.API_URL,
      url: req.url,
      data: req.body,
      signal
    })
      .then((res) => res.data)
);

// Configure axios to use token from amplify
axios.interceptors.request.use(async (config) => {
  const session = await Auth.currentSession()
    .catch(() => undefined);

  if (session) {
    config.headers ??= {};
    config.headers['Authorization'] = `Bearer ${session.getAccessToken().getJwtToken()}`;
  }

  return config;
});
