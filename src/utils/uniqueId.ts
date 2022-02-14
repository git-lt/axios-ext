let uqidc: number;

const lz = (i: string, c: any) => {
  if (typeof c != 'number' || c <= 0 || (typeof i != 'number' && typeof i != 'string')) {
    return i;
  }
  i += '';

  while (i.length < c) {
    i = '0' + i;
  }
  return i;
};

const getHashCode = (s: string) => {
  let hash = 0;
  let c = typeof s == 'string' ? s.length : 0;
  let i = 0;
  while (i < c) {
    hash = (hash << 5) - hash + s.charCodeAt(i++);
    //hash = hash & hash; // Convert to 32bit integer
  }
  // convert to unsigned
  return hash < 0 ? hash * -1 + 0xffffffff : hash;
};

export const uniqueId = (s: string, bres?: string) => {
  let i: number;
  if (s == undefined || typeof s != 'string') {
    if (!uqidc) {
      uqidc = 0;
    } else {
      ++uqidc;
    }
    var od = new Date();
    i = +(s = od.getTime() + '' + uqidc);
  } else {
    i = getHashCode(s);
  }
  return (bres ? 'res:' : '') + i.toString(32) + '-' + lz((s.length * 4).toString(16), 3);
};
