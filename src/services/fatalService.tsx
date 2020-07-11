import { csv } from 'd3-fetch';
import { formatFips, toTitleCase } from '../utility';
import _ from 'lodash';
import allStates from "../states.json";
import { sleep } from '../utility';

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

  async getYearsRange() {
    await this.loadDataIfNotLoaded();
    const years = _.uniq(this.fatalEncountersData.map(data => 
      new Date(data["Date of injury resulting in death (month/day/year)"]).getFullYear().toString()));
      return years;
  }

  formatData(deaths: any[]) {
    const data = _.groupBy(deaths, 'geoId');
    const deathsByCounty: any = {};
    for (let geo in data) {
      deathsByCounty[geo] = data[geo].length;
    }
    return deathsByCounty;
  }

  async loadDataIfNotLoaded() {
    if (this.loading) { await sleep(500)}
    if (this.loading) { await sleep(500)}
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

  async getTotalDeathsByCounty(fatalEncountersData?: any[]) {
    await this.loadDataIfNotLoaded();
    if (!fatalEncountersData) { fatalEncountersData = this.fatalEncountersData }
    const deathData = fatalEncountersData.map((deaths: any) => {
      const county = toTitleCase(deaths['Location of death (county)']);
      const fipsRecord = this.counties.find((x: any) => x.Name === county);
      return {
        geoId: fipsRecord ? fipsRecord.FIPS : county
      }
    });
    return this.formatData(deathData);
  }

  async getTotalDeathsByState(fatalEncountersData?: any[]) {
    await this.loadDataIfNotLoaded();
    if (!fatalEncountersData) { fatalEncountersData = this.fatalEncountersData }
    const deathData = fatalEncountersData.map((data: any) => {
      const state: string = data['Location of death (state)'].toUpperCase();
      const stateRecord = this.allStates.find((x: any) => x.id === state);
      return {
        geoId: stateRecord ? stateRecord.val : state
      }
    });
    return this.formatData(deathData);
  }

  async filterDataForYear(year: string) {
    // await this.loadDataIfNotLoaded();
    return this.fatalEncountersData.filter((data: any) => {
      const d = new Date(data["Date of injury resulting in death (month/day/year)"]);
      const dataYear = d.getFullYear().toString();
      if (dataYear === '2100') return false; // fatal encounters uses a year 2100 as a spacer.  Yeah, I don't get it either.
      return dataYear === year;
    });
  }

  async getTotalDeathsByStateForYear(year: string) {
    await this.loadDataIfNotLoaded();
    let deathData: any[] = await this.filterDataForYear(year);
    return await this.getTotalDeathsByState(deathData);
  }

  async getTotalDeathsByCountyForYear(year: string) {
    await this.loadDataIfNotLoaded();
    let deathData: any[] = await this.filterDataForYear(year);
    return await this.getTotalDeathsByCounty(deathData);
  }
}

export default new FatalService();