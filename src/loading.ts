import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import {isObject}  from './utils/index'

const namespace = 'axios-loading';
type LoadingHandler = (isLoading: boolean, tip: string) => void;
export interface LoadingOption {
  tip?: string,
  delay?: number,
  handler?:  null | LoadingHandler,
}

interface LoadingConfig extends Required<LoadingOption> {
  startTime: number;
}

const defaultOption = {
  tip: '加载中',
  delay: 260,
  handler: null,
}

function changeLoading(option: LoadingConfig, isLoading: boolean) {
  const { handler, tip} = option;
  handler && handler(isLoading, tip);
}

function hideLoading(option: LoadingConfig){
  const { startTime, delay } = option;

  if(startTime > 0){
    if((Date.now() - startTime) < delay){
      option.handler = null;
    }else{
      changeLoading(option, false)
    }
  }
}

function getLoadingOptions(defaultOptions: Required<LoadingOption>, config: AxiosRequestConfig): null | LoadingConfig{
  if(config.loading === true) return {...defaultOptions, startTime: 0};
  if(isObject(config.loading)) return {...defaultOptions, ...config.loading, startTime: 0};
  return null;
}

export default function axiosLoading(axiosInstance: AxiosInstance, options: LoadingOption = {}) {
  let defaultOptions = {...defaultOption, ...options, startTime: 0};
  
  axiosInstance.interceptors.request.use((config) => {
    const currOptions = getLoadingOptions(defaultOptions, config);
    if(!currOptions) return config;

    currOptions.startTime = Date.now();
    config[namespace] = currOptions;

    setTimeout(() => changeLoading(currOptions, true), currOptions.delay);
    
    return config;
  })
  axiosInstance.interceptors.response.use(response => {
    const loadingOptions = response.config[namespace];
    if(!loadingOptions) return response;

    hideLoading(loadingOptions)
    return response;
  },error => {
    if(!error.config) return  Promise.reject(error);

    const loadingOptions = error.config[namespace];
    if(!loadingOptions) return Promise.reject(error)

    hideLoading(loadingOptions)
    return Promise.reject(error)
  })
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    loading?: LoadingOption;
    [namespace]?: LoadingConfig;
  }
}