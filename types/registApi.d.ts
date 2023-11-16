import type { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';
export declare type RequestDataType = "json" | "form";
interface RequestConfig extends AxiosRequestConfig {
    dataType: RequestDataType;
}
export declare type ApiConfig = Record<string, string | Function>;
export interface RegistApiOption {
    apiConfig: ApiConfig;
    prefix?: string;
}
export declare type TransApiResult = <T = any>(config?: Partial<RequestConfig>) => AxiosPromise<T>;
export declare type TransFnApiResult = (...params: any[]) => TransApiResult;
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
export default function registApi<T extends RegistApiOption, R extends {
    [P in keyof T['apiConfig']]: T['apiConfig'][P] extends (...params: infer U) => any ? (...params: U) => TransApiResult : TransApiResult;
}>(axiosInstance: AxiosInstance, options: T): R;
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
export declare function withConfig(config: Partial<RequestConfig>): (strArr: string[], ...values: string[]) => (params?: any) => (string | Partial<RequestConfig>)[];
export {};
