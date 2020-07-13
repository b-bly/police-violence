import statesJson from './states.json';
import { getJsonFromCsv, formatFips } from '../utility';

export const states = statesJson;

export const getCountyFips = async () => {
  const url = "./data/county_fips.csv";
  let counties = await getJsonFromCsv(url);
  return counties.map((record: any) => {
    record.FIPS = formatFips(record.FIPS);
    return record;
  });
}

