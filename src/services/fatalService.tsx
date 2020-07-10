import { csv } from 'd3-fetch';
import { formatFips, toTitleCase } from '../utility';
import _ from 'lodash';
import allStates from "../states.json";

class FatalService {
  counties: any[] = [];
  fatalEncountersData: any[] = [];
  allStates: any[] = allStates;

  constructor() {
    this.loadDataIfNotLoaded();
  }

  async getJsonFromCsv(url: string, cb?: Function): Promise<any> {
    try {
      return await csv(url, (data) => cb ? cb(data) : data);
    } catch (e) {
      return {
        error: e, message: "Error getting data from url: ${url}"
      }
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

  formatData(deaths: any[]) {
    const data = _.groupBy(deaths, 'geoId');
    const deathsByCounty: any = {};
    for (let geo in data) {
      deathsByCounty[geo] = data[geo].length;
    }
    return deathsByCounty;
  }

  async loadDataIfNotLoaded() {
    if (this.counties.length < 1) {
      await this.getCountyFips();
    }
    if (this.fatalEncountersData.length < 1) {
      await this.loadFatalEncountersData();
    }
  }

  async getTotalDeathsByCounty() {
    await this.loadDataIfNotLoaded();
    const deathData = this.fatalEncountersData.map((deaths: any) => {
      const county = toTitleCase(deaths['Location of death (county)']);
      const fipsRecord = this.counties.find((x: any) => x.Name === county);
      return {
        geoId: fipsRecord ? fipsRecord.FIPS : county
      }
    });
    return this.formatData(deathData);
  }

  async getTotalDeathsByState() {
    await this.loadDataIfNotLoaded();
    const deathData = this.fatalEncountersData.map((deaths: any) => {
      const state: string = deaths['Location of death (state)'].toUpperCase();
      const stateRecord = this.allStates.find((x: any) => x.id === state);
      return {
        geoId: stateRecord ? stateRecord.val : state
      }
    });
    return this.formatData(deathData);
  }
}

export default FatalService;