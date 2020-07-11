import { csv } from 'd3-fetch';
import { formatFips, toTitleCase } from '../utility';
import _ from 'lodash';
import allStates from "../states.json";
import { sleep } from '../utility';

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

  async getJsonFromCsv(url: string, cb?: Function): Promise<any> {
    try {
      return await csv(url, (data) => cb ? cb(data) : data);
    } catch (e) {
      return e;
    }
  }

  async getCountyFips() {
    if (this.counties.length < 1) {
      const url = "./data/county_fips.csv";
      let counties = await this.getJsonFromCsv(url);
      counties = counties.map((record: any) => {
        record.FIPS = formatFips(record.FIPS);
        return record;
      });
      this.counties = counties;
    }
    return this.counties;
  }

  async loadFatalEncountersData(): Promise<void> {
    this.fatalEncountersData = await this.getJsonFromCsv("./data/fatal_encounters.csv");
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

  formatData(deaths: any[]): DeathData {
    const data = _.groupBy(deaths, 'geoId');
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

  async getDeathsByLocation(location: string, year: string, causeOfDeath: string, fatalEncountersData?: any[]) {
    await this.loadDataIfNotLoaded();
    if (!fatalEncountersData) { fatalEncountersData = this.fatalEncountersData }
    if (year !== 'all') {
      fatalEncountersData = await this.filterDataForYear(year);
    }
    if (causeOfDeath !== 'all') {
      fatalEncountersData = await this.filterDataForCauseOfDeath(causeOfDeath);
    }
    const deathData = fatalEncountersData.map((record: any) => {
      let geoId: string = 'undefined';
      if (location === 'counties') {
        geoId = this.getCountyFipsId(record);
      } else {
        // state
        geoId = this.getStateId(record);
      }
      return {
        geoId: geoId
      };
    });
    return this.formatData(deathData);
  }

  getCountyFipsId(record: any) {
    const county = toTitleCase(record[columnHeadings.counties]);
    const fipsRecord = this.counties.find((x: any) => x.Name === county);
    return  fipsRecord ? fipsRecord.FIPS : county;
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