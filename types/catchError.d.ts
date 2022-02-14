import type { AxiosInstance, AxiosError } from 'axios';
export interface CatchErrorOption {
    handler?: (error: AxiosError) => Promise<any>;
}
/**
 * 配置请求是否全局捕获异常
 * 单个请求中可以取消全局捕获
 * @param axios
 * @param options
 */
export default function axiosRetry(axios: AxiosInstance, options?: CatchErrorOption): void;
declare module 'axios' {
    interface AxiosRequestConfig {
        catchError?: boolean | CatchErrorOption;
    }
}
