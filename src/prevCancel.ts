import type { AxiosStatic, Canceler } from 'axios';
import { isObject } from './utils/index';
import { uniqueId } from './utils/uniqueId';

const allowMethods = ['get', 'head', 'option', 'put', 'delete'];

export interface PrevCancelOption {
  // 是否匹配请求参数
  matchParams?: false;
}

const defaultOption = {
  matchParams: false,
};

let cancelMap: Record<string, Canceler> = {};

function createUrlId(baseUrl = '', url: string, params = {}, matchParams: boolean) {
  const str = baseUrl + url + matchParams ? JSON.stringify(params) : '';
  return uniqueId(str);
}

/**
 * 取消上一个请求
 * @example
 *  import { axiosPrevCancel } from '@mtjs/axios-ext
 *  axiosPrevCancel(axios)
 *  api.getOrder({ data, prevCancel: true })
 * @param axiosStatic
 * @param options
 */
export default function axiosPrevCancel(axiosStatic: AxiosStatic, options: PrevCancelOption = {}) {
  let cancelOptions = { ...defaultOption, ...options };

  axiosStatic.interceptors.request.use(config => {
    if (!config || !allowMethods.includes(config.method!) || !config.prevCancel) return config;

    cancelOptions = isObject(config.prevCancel) ? { ...cancelOptions, ...(config.prevCancel as PrevCancelOption) } : cancelOptions;

    const urlId = createUrlId(config.baseURL, config.url!, config.params, cancelOptions.matchParams);
    // cancel prev same request
    if (cancelMap[urlId]) cancelMap[urlId]();

    config.cancelToken = new axiosStatic.CancelToken(cancel => {
      cancelMap[urlId] = cancel;
    });

    return config;
  });
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    prevCancel?: boolean | PrevCancelOption;
  }
}
