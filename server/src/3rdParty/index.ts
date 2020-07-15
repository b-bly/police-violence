import stateIdsJson from './states.json';
import { formatFips, getJsonFromCsv } from '../utility';
const path = require('path');

export const stateIds = stateIdsJson;

export const getCountyFips = async () => {
  const url = path.resolve(__dirname, "county_fips.csv");
  const counties: any[] = await getJsonFromCsv(url);
  const fips = counties.map((record: any) => {
    record.FIPS = formatFips(record.FIPS);
    return record;
  });
  return fips;
}

export const loadFatalEncountersData = async (): Promise<any[]> => {
  const url = path.resolve(__dirname, "fatal_encounters.csv");
  const data = await getJsonFromCsv(url);
  return data;
}

