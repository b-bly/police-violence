import { csv } from 'd3-fetch';

export const getJsonFromCsv = async  (url: string, cb?: Function): Promise<any> => {
  try {
    return await csv(url, (data) => cb ? cb(data) : data);
  } catch (e) {
    return e;
  }
}

export const formatFips = (fips: string) => {
  while (fips.length < 5) {
    fips = '0' + fips;
  }
  return fips;
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}