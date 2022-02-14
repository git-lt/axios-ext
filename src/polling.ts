// import type { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

// export interface PollingOption {
//   // ms
//   delay?: number,
//   // 返回 true 继续轮询，返回 false 中断轮询
//   condition?: (err: AxiosError | AxiosResponse) => boolean
// }

// const defaultOptions = {
//   delay: 3 * 1000,
//   condition: () => true,
// }

// function getPollingOptions(config: AxiosRequestConfig, defaultOptions: Required<PollingOption>): Required<PollingOption> | null {
//   if(!config.polling) return null;
//   if(config.polling === true) return defaultOptions;
  
//   return { ...defaultOptions, ...config.polling };
// }

// function fixConfig(axios: AxiosInstance, config: AxiosRequestConfig) {
//   if (axios.defaults.httpAgent === config.httpAgent) {
//     delete config.httpAgent;
//   }
//   if (axios.defaults.httpsAgent === config.httpsAgent) {
//     delete config.httpsAgent;
//   }
// }

// /**
//  * 配置单个请求轮询
//  * @param axios 
//  * @param options 
//  */
// export default function axiosPolling(axios: AxiosInstance) {

//   axios.interceptors.response.use(response => {
//     const { config } = response;
    
//     const pollingOptions = getPollingOptions(config, defaultOptions);
//     if(!pollingOptions) return response;
//     const { delay, condition } = pollingOptions;
    
//     fixConfig(axios, config);

//     if(condition(response)){
//       return new Promise((resolve) => setTimeout(() => resolve(axios(config)), delay));
//     }
    
//     return response;
//   }, error => {
//     const { config } = error;
//     if(!config) return Promise.reject(error);

//     const pollingOptions = getPollingOptions(config, defaultOptions);
//     if(!pollingOptions) return Promise.reject(error);
//     const { delay, condition } = pollingOptions;
    
//     fixConfig(axios, config);

//     if(condition(error)){
//       return new Promise((resolve) => setTimeout(() => resolve(axios(config)), delay));
//     }
//     return Promise.reject(error);
//   })
// }

// declare module 'axios' {
//   export interface AxiosRequestConfig {
//     polling?: boolean | PollingOption;
//   }
// }