import type { AxiosInstance, AxiosError } from 'axios';
declare const namespace = "axios-retry";
export interface RetryOption {
    count?: number;
    delay?: number;
    condition?: (err: AxiosError) => boolean;
}
declare type RetryConfig = {
    count?: number;
};
export declare function isNetworkError(error: AxiosError): boolean;
export declare function isStatusAllowed(status: number): boolean;
/**
 * 配置单个请求的重试次数
 * @param axios
 * @param options
 */
export default function axiosRetry(axios: AxiosInstance, options?: RetryOption): void;
declare module 'axios' {
    interface AxiosRequestConfig {
        retry?: boolean | RetryOption;
        [namespace]?: RetryConfig;
    }
}
export {};
