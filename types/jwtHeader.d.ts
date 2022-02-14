import type { AxiosInstance } from 'axios';
export interface JWTHeaderOption {
    authTokenHeaderName?: string;
    newTokenHeaderName?: string;
    tokenPrefix?: string;
    getToken?: () => string;
    saveToken?: (token: string) => void;
}
/**
 * 为请求自动加上 jwt 的header
 * @example
 *  import axiosJWTHeader from '@mtjs/axios-ext'
 * @param axiosInstance
 * @param options
 */
export default function axiosJWTHeader(axiosInstance: AxiosInstance, options?: JWTHeaderOption): void;
