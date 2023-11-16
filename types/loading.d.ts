import type { AxiosInstance } from 'axios';
declare const namespace = "axios-loading";
declare type LoadingHandler = (isLoading: boolean, tip: string) => void;
export interface LoadingOption {
    tip?: string;
    delay?: number;
    handler?: null | LoadingHandler;
}
interface LoadingConfig extends Required<LoadingOption> {
    startTime: number;
}
export default function axiosLoading(axiosInstance: AxiosInstance, options?: LoadingOption): void;
declare module 'axios' {
    interface AxiosRequestConfig {
        loading?: boolean | LoadingOption;
        [namespace]?: LoadingConfig;
    }
}
export {};
