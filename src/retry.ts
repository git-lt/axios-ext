import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import isRetryAllowed from './utils/isRetryAllowed'

const namespace = 'axios-retry';

export interface RetryOption {
  count?: number,
  delay?: number,
  // 返回 true 允许重试，返回 false 不允许重试
  condition?: (err: AxiosError) => boolean
}

type RetryConfig = { count?: number};

const defaultOptions = {
  count: 3,
  delay: 0,
  condition: () => true,
}

function getCurrentState(config: AxiosRequestConfig) {
  const currentState: RetryConfig = config[namespace] || {};
  currentState.count = currentState.count || 0;
  config[namespace] = currentState;
  return currentState;
}

function getRequestOptions(config:AxiosRequestConfig & {[namespace]?: any}, defaultOptions: Required<RetryOption>) {
  return { ...defaultOptions, ...config.retry as RetryOption };
}

export function isNetworkError(error:AxiosError) {
  return ( Boolean(error.code) && isRetryAllowed(error) );
}

export function isStatusAllowed(status: number) {
  return status >= 500 && status <= 599
}

function fixConfig(axios:AxiosInstance, config: AxiosRequestConfig) {
  if (axios.defaults.httpAgent === config.httpAgent) {
    delete config.httpAgent;
  }
  if (axios.defaults.httpsAgent === config.httpsAgent) {
    delete config.httpsAgent;
  }
}

/**
 * 配置单个请求的重试次数
 * @param axios 
 * @param options 
 */
export default function axiosRetry(axios: AxiosInstance, options:RetryOption = {}) {
  const defOptions = {...defaultOptions, ...options};

  axios.interceptors.request.use((config) => {
    getCurrentState(config);
    return config;
  })

  axios.interceptors.response.use(undefined, error => {
    const { config, response } = error;
    if (!config || !response || !config.retry) return Promise.reject(error);
    
    const errorAllowed = isRetryAllowed(error);
    const statusAllowed = isStatusAllowed(response.status);

    const { count, delay, condition } = getRequestOptions(config, defOptions);
    if (!errorAllowed || !statusAllowed || !condition(error)) return Promise.reject(error);

    const currentState = getCurrentState(config);

    if (currentState.count! >= count){
      currentState.count = 0;
      return Promise.reject(error);
    }

    currentState.count! += 1;
    // issues: https://github.com/mzabriskie/axios/issues/370
    fixConfig(axios, config);
    return new Promise((resolve) => setTimeout(() => resolve(axios(config)), delay));

  })
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    retry?: boolean | RetryOption;
    [namespace]?: RetryConfig,
  }
}