export function isGetLike(method:string){
  return ['get', 'head', 'options', 'delete'].includes(method);
}

export function isObject(val:any) {
  return val !== null && typeof val === 'object';
}

export function isBoolean(val:any) {
  return typeof val === 'boolean';
}