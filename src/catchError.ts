import type { AxiosInstance, AxiosError } from 'axios'

export interface CatchErrorOption {
  handler?: (error: AxiosError) => Promise<any>;
}

const defaultOptions = {
  handler: (error: AxiosError) => Promise.reject(error)
}

function catchErrorHandler(error:AxiosError, options:CatchErrorOption){
  const { config } = error;
  if(!config || !config.catchError) return Promise.reject(error);
  if(typeof config.catchError !== 'boolean' && config.catchError.handler){
     return config.catchError.handler(error)
  }
  return options.handler!(error);
}

/**
 * 配置请求是否全局捕获异常
 * 单个请求中可以取消全局捕获
 * @param axios 
 * @param options 
 */
export default function axiosRetry(axios: AxiosInstance, options: CatchErrorOption = defaultOptions) {
  axios.interceptors.request.use(undefined, error => catchErrorHandler(error, options))
  axios.interceptors.response.use(undefined, error => catchErrorHandler(error, options))
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    catchError?: boolean | CatchErrorOption;
  }
}