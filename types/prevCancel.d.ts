import type { AxiosStatic } from 'axios';
export interface PrevCancelOption {
    matchParams?: false;
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
export default function axiosPrevCancel(axiosStatic: AxiosStatic, options?: PrevCancelOption): void;
declare module 'axios' {
    interface AxiosRequestConfig {
        prevCancel?: boolean | PrevCancelOption;
    }
}
