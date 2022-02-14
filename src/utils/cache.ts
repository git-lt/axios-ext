import { uniqueId  } from './uniqueId';

const cacheItem:Record<string, string > = {};

const setItemNodejs = (key:string, value: string) => {
  cacheItem[key]= value;
}
const getItemNodejs = (key:string) => {
  return cacheItem[key];
}
const removeItemNodejs = (key:string) => {
  delete cacheItem[key];
}
const isNodejs = typeof window === 'undefined';
const setItem = isNodejs ? setItemNodejs : window.localStorage.setItem;
const getItem = isNodejs ? getItemNodejs : window.localStorage.getItem;
const removeItem = isNodejs ? removeItemNodejs : window.localStorage.removeItem

interface CacheDataProps {
  expires: number,
  data: any,
  url: string,
}

export const setCache = (baseUrl: string, url: string, params: any, expires: number, data:any) => {
  const urlInfo = baseUrl + url + JSON.stringify(params);
  const cacheId = uniqueId(urlInfo);
  const cacheData: CacheDataProps = {
    expires: +new Date() + expires * 1000,
    data,
    url: urlInfo,
  };
  setItem(cacheId, JSON.stringify(cacheData));
};

export const getCache = (baseUrl:string, url:string, params: string) => {
  const urlInfo = baseUrl + url + JSON.stringify(params);
  const cacheId = uniqueId(urlInfo);
  const cacheData = getItem(cacheId);
  if(!cacheData) return null;

  const data = JSON.parse(cacheData) as CacheDataProps;
  if(data.expires > +new Date()) return data.data;

  // 过期，清除缓存
  removeItem(cacheId)
  return null;
};