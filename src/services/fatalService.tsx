import { formatFips, toTitleCase, getJsonFromCsv } from '../utility';
import _ from 'lodash';
import allStates from "../states.json";
import { sleep } from '../utility';
import censusService from './censusService';

// type columnHeading = "counties" | "states" | "causeOfDeath" | "date";
// type ColumnHeadings = {
//   [heading in columnHeading]: string
// }

interface ColumnHeadings {
  [key: string]: string
}

const columnHeadings: ColumnHeadings = {
  counties: "Location of death (county)",
  states: "Location of death (state)",
  causeOfDeath: "Cause of death",
  date: "Date of injury resulting in death (month/day/year)"
};

interface DeathData {
  [key: number]: number
}

class FatalService {
  counties: any[] = [];
  fatalEncountersData: any[] = [];
  allStates: any[] = allStates;
  loading: boolean = false;

  constructor() {
    this.loadDataIfNotLoaded();
  }

  async getCountyFips() {
    if (this.counties.length < 1) {
      const url = "./data/county_fips.csv";
      let counties = await getJsonFromCsv(url);
      counties = counties.map((record: any) => {
        record.FIPS = formatFips(record.FIPS);
        return record;
      });
      this.counties = counties;
    }
    return this.counties;
  }

  async loadFatalEncountersData(): Promise<void> {
    this.fatalEncountersData = await getJsonFromCsv("./data/fatal_encounters.csv");
  }

  async getFatalEncountersData() {
    await this.loadDataIfNotLoaded();
    return this.fatalEncountersData;
  }

  async getCausesOfDeath() {
    await this.loadDataIfNotLoaded();
    const causesOfDeath: string[] = _.uniqBy(this.fatalEncountersData, columnHeadings.causeOfDeath).map(x => String(x[columnHeadings.causeOfDeath]));
    return ['all', ...causesOfDeath];
  }

  async getYearsRange() {
    await this.loadDataIfNotLoaded();
    const years = _.uniq(this.fatalEncountersData.map(data =>
      new Date(data["Date of injury resulting in death (month/day/year)"]).getFullYear().toString()))
      .filter(year => parseInt(year) < new Date().getFullYear());
    return ['all', ...years];
  }

  countDeaths(records: any[]): DeathData {
    const data = _.groupBy(records, 'geoId');
    const deathData: any = {};
    for (let geo in data) {
      deathData[geo] = data[geo].length;
    }
    return deathData;
  }

  async loadDataIfNotLoaded() {
    if (this.loading) { await sleep(500) }
    if (this.loading) { await sleep(500) }
    if (this.counties.length < 1) {
      this.loading = true;
      await this.getCountyFips();
      this.loading = false;
    }
    if (this.fatalEncountersData.length < 1) {
      this.loading = true;
      await this.loadFatalEncountersData();
      this.loading = false;
    }
  }

  async getData(location: string, year: string, causeOfDeath: string): Promise<DeathData> {
    return await this.getDeathsByLocation(location, year, causeOfDeath);
  }

  async getDeathsByLocation(location: string, year: string, causeOfDeath: string) {
    await this.loadDataIfNotLoaded();
    let fatalEncountersData = this.fatalEncountersData;
    if (year !== 'all') {
      fatalEncountersData = await this.filterDataForYear(year);
    }
    if (causeOfDeath !== 'all') {
      fatalEncountersData = await this.filterDataForCauseOfDeath(causeOfDeath);
    }
    const deathData = this.aggregateByLocation(location, fatalEncountersData);
    const result = this.countDeaths(deathData);
    return result;
  }

  async getBlackToWhiteRiskData(location: string, year: string, causeOfDeath: string) {
    await this.loadDataIfNotLoaded();
    await censusService.loadDataIfNotLoaded();
    let fatalEncountersData = this.fatalEncountersData;
    if (year !== 'all') {
      fatalEncountersData = await this.filterDataForYear(year);
    }
    if (causeOfDeath !== 'all') {
      fatalEncountersData = await this.filterDataForCauseOfDeath(causeOfDeath);
    }
    // const deathData = this.aggregateByLocation(location, fatalEncountersData);

    // filter by race
    let whiteDeathData: any[] = fatalEncountersData.filter((record: any) => record["Subject's race"] === 'European-American/White');
    let blackDeathData: any[] = fatalEncountersData.filter((record: any) => record["Subject's race"] === 'African-American/Black');
    whiteDeathData = this.aggregateByLocation(location, whiteDeathData);
    blackDeathData = this.aggregateByLocation(location, blackDeathData);
    let whiteDeathDataObj = this.countDeaths(whiteDeathData);
    let blackDeathDataObj = this.countDeaths(blackDeathData);
    const blackToWhiteDeathRatios: any = {};
    for (let locationId in whiteDeathDataObj) {
      if (blackDeathDataObj[locationId]) {
        // calc black : white death ratio in police encounters
        // TODO: replace locationId with FIPS in censusdata
        const ratio = blackDeathDataObj[locationId]/whiteDeathDataObj[locationId];
        blackToWhiteDeathRatios[locationId] = ratio;
      }
    }
    let blackToWhiteRiskData: any[] = []
    if (location.toLowerCase() === 'counties') {
      blackToWhiteRiskData = censusService.raceDataByCounty; // await censusService.getRaceDataByCounty();

    } else if (location.toLowerCase() === 'states') {
      blackToWhiteRiskData = censusService.raceDataByState; // await censusService.getRaceDataByState();
    } else {
      throw new Error('Invalid location.');
    }

    // calculate black : white death ratio, not total deaths 

    const riskData: any = {};
    for (let locationId in blackToWhiteDeathRatios) {
      const record = blackToWhiteRiskData.find(record => record.county === locationId);
      if (record) {
        // deaths ratio / demo ratio
        // TODO: This is a mock!  Get data
        const deathsRatio = blackToWhiteDeathRatios[locationId];
        riskData[locationId] = deathsRatio / record.blackToWhiteRatio;
      }
    }
    return riskData;
  }

  aggregateByLocation(location: string, fatalEncountersData: any[]) {
    return fatalEncountersData.map((record: any) => {
      let geoId: string = 'undefined';
      if (location.toLowerCase() === 'counties') {
        geoId = this.getCountyFipsId(record);
      } else if (location.toLowerCase() === 'states') {
        // state
        geoId = this.getStateId(record);
      } else {
        throw new Error('Invalid location');
      }
      return {
        geoId: geoId
      };
    });
  }

  getCountyFipsId(record: any) {
    const county = toTitleCase(record[columnHeadings.counties]);
    const fipsRecord = this.counties.find((x: any) => x.Name === county);
    return fipsRecord ? fipsRecord.FIPS : county;
  }

  getStateId(record: any) {
    const state: string = record[columnHeadings.states].toUpperCase();
    const stateRecord = this.allStates.find((x: any) => x.id === state);
    return stateRecord ? stateRecord.val : state;
  }

  async filterDataForYear(year: string) {
    // await this.loadDataIfNotLoaded();
    return this.fatalEncountersData.filter((data: any) => {
      const d = new Date(data[columnHeadings.date]);
      const dataYear = d.getFullYear().toString();
      if (dataYear === '2100') return false; // fatal encounters uses a year 2100 as a spacer.  Yeah, I don't get it either.
      return dataYear === year;
    });
  }

  async filterDataForCauseOfDeath(causeOfDeath: string) {
    return this.fatalEncountersData.filter((data: any) => {
      return causeOfDeath === data[columnHeadings.causeOfDeath];
    });
  }
}

export default new FatalService();