import type { AxiosInstance, AxiosRequestConfig, Method, AxiosPromise } from 'axios'

const REQUEST_HEADERS = {
  form: { "Content-Type": "application/x-www-form-urlencoded" },
  json: { "Content-Type": "application/json;charset=utf-8" },
};

export type RequestDataType = "json" | "form";

interface RequestConfig extends AxiosRequestConfig {
  // 请求的的数据类型 json / form(x-www-form-urlencoded)
  dataType: RequestDataType;
}

export type ApiConfig = Record<string, string | Function>;

export interface RegistApiOption {
  apiConfig: ApiConfig,
  prefix?: string,
}

export type TransApiResult = <T = any>(config?: Partial<RequestConfig>) => AxiosPromise<T>;
export type TransFnApiResult = (...params: any[]) => TransApiResult;
type TransResult = TransFnApiResult | TransApiResult;

function transfromToRequest(axios: AxiosInstance, methodUrl: string | [Partial<RequestConfig>, string], prefix = ''): TransApiResult {
  return (config: Partial<RequestConfig> = {}) => {
    let { dataType = 'json' } = config || {};
    let methodInfo = '';
    let reqConfig = config;
    if(Array.isArray(methodUrl)){
      const [cusConfig, methodPath] = methodUrl;
      reqConfig = {...reqConfig, ...cusConfig};
      methodInfo = methodPath;
    }else {
      methodInfo = methodUrl;
    }

    // 获取 方法 和 地址
    const [method, urlPath] = methodInfo.split(' ');
    const url = prefix + urlPath;

    // 所有请求都以 data 作为所有请求传递的数据对象
    const isGetLike = ['get', 'head', 'options', 'delete'].includes(method)

    reqConfig.url = url;
    reqConfig.method = method as Method;
    reqConfig.params = isGetLike ? reqConfig.data : {};
    reqConfig.headers = {
      ...(REQUEST_HEADERS[dataType] || {}),
      ...(reqConfig.headers || {})
    }
    
    return axios(reqConfig);
  }
}

/**
 * 
 * @example
 *  import axios from 'axios'
 *  import registApi from '@axios-ext/registApi'
 *  const apiConfig = {
 *    login: 'post /login',
 *    getUser: 'get /users'
 *    delUser: (id) => `delete /user/${id}`
 *  }
 *  const apis = registApi(axios, { apiConfig: apiConfig, prefix: '/api'})
 *  
 *  apis.login({data: { username: '', pwd: ''}}).then(res => { })
 * 
 * @param axiosInstance 
 * @param options 
 * @returns apis
 */
export default function registApi<
  T extends RegistApiOption,
  R extends { [P in keyof T['apiConfig']]: T['apiConfig'][P] extends (...params: infer U) => any ? (...params: U) => TransApiResult  : TransApiResult }
>(axiosInstance: AxiosInstance, options: T):R {
  const { apiConfig, prefix = ''} = options;

  const result: Record<string, TransResult> = {};
  Object.keys(apiConfig).forEach((v) => {
    const methodUrl = apiConfig[v];
    if (typeof methodUrl === 'function') {
      result[v] = (...params: any[]) => transfromToRequest(axiosInstance, methodUrl.apply(null, params), prefix);
    } else {
      result[v] = transfromToRequest(axiosInstance, methodUrl, prefix);
    }
  });
  return result as R;
}

/**
 * 用于在定义API时，预定义一些 axios 的配置，或覆盖全局配置
 * @example
 *  import axios from 'axios'
 *  import registApi, { withConfig } from '@axios-ext/registApi'
 *  const apiConfig = {
 *    login: 'post /login',
 *    getUser: 'get /users'
 *    delUser: (id) => `delete /user/${id}`
 *    createUser: withConfig({ dataType: 'form' })`post /user`
 *  }
 *  const apis = registApi(axios, { apiConfig: apiConfig, prefix: '/api'})
 *  
 *  apis.login({data: { username: '', pwd: ''}}).then(res => { })
 * 
 * @param config 
 * @returns 
 */
export function withConfig(config:Partial<RequestConfig>){
  return (strArr:string[], ...values:string[]) => {
    return (params:any={}) => {
      const reqPath = strArr.reduce((p,n) => {
        const keyName = values.shift();
        const v = keyName ? params[keyName] : '';
        return p+n+v;
      }, '')
      return [config, reqPath]
    }
  }
}