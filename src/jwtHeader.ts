import type { AxiosInstance  } from 'axios'

export interface JWTHeaderOption {
 authTokenHeaderName?: string,
 newTokenHeaderName?: string,
 tokenPrefix?: string,
 getToken?: () => string,
 saveToken?: (token:string) => void;
}

const defaultOption = {
  authTokenHeaderName: 'Authorization',
  newTokenHeaderName: 'newToken',
  tokenPrefix: 'Bearer ',
  getToken: () => { 
    return window.localStorage.getItem('token');
  },
  saveToken: (token:string) => {
    window.localStorage.setItem('token', token);
  }
}
/**
 * 为请求自动加上 jwt 的header
 * @example
 *  import axiosJWTHeader from '@mtjs/axios-ext'
 * @param axiosInstance 
 * @param options 
 */
export default function axiosJWTHeader(axiosInstance: AxiosInstance, options: JWTHeaderOption = {}) {
  let jwtHeaderOption = {...defaultOption, ...options};
  const { getToken, authTokenHeaderName, tokenPrefix, newTokenHeaderName, saveToken } = jwtHeaderOption;

  axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if(token){
      config.headers![authTokenHeaderName] = `${tokenPrefix}${token}`;
    }
    return config;
  })
  axiosInstance.interceptors.response.use((response) => {
    if(response && response.headers){
      const newToken = response.headers[newTokenHeaderName];
      newToken && saveToken(newToken);
    }
    return response;
  }, error => {
    if(error && error.response){
      const newToken = error.response.headers[newTokenHeaderName];
      newToken && saveToken(newToken);
    }
    return Promise.reject(error)
  })
}