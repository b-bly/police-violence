import _ from 'lodash';
import allStates from "../states.json";
import { sleep } from '../utility';
import censusService from './censusService';
import { IDeath } from '../types';
import Death from '../models/death';

interface DeathData {
  [key: number]: number
}

class FatalService {
  counties: any[] = [];
  fatalEncountersData: Death[] = [];
  allStates: any[] = allStates;
  loading: boolean = false;

  constructor() {
    this.loadDataIfNotLoaded();
  }

  async get(url: string) {
    const res = await fetch(url);
    return await res.json();

  }

  async loadFatalEncountersData(): Promise<void> {
    try {
      const data: IDeath[] = await this.get('/api/fatalEncounters');
      this.fatalEncountersData = data.map((record: IDeath) => new Death(record));
    } catch (e) {
      this.fatalEncountersData = [];
      console.log(e)
      // alert('Error getting data.');
    }
  }

  async loadDataIfNotLoaded() {
    if (this.loading) { await sleep(500) }
    if (this.loading) { await sleep(500) }
    if (this.fatalEncountersData.length < 1) {
      this.loading = true;
      await this.loadFatalEncountersData();
      this.loading = false;
    }
  }

  async getFatalEncountersData() {
    await this.loadDataIfNotLoaded();
    return this.fatalEncountersData;
  }

  async getCausesOfDeath() {
    await this.loadDataIfNotLoaded();
    const causesOfDeath: string[] = _.uniqBy(this.fatalEncountersData, "causeOfDeath")
      .map((death: Death) => death.causeOfDeath);
    return ['all', ...causesOfDeath];
  }

  async getYearsRange() {
    await this.loadDataIfNotLoaded();
    const years = _.uniq(this.fatalEncountersData.map((data: Death) =>
      data.year))
      .filter(year => parseInt(year) <= new Date().getFullYear() && parseInt(year) > 2000);
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

  async getData(location: string, year: string, causeOfDeath: string, dependentVariable: string): Promise<DeathData> {
    if (dependentVariable === 'risk') {
      try {
        const data = await this.getBlackToWhiteRiskData(location, year, causeOfDeath);
        return data;
      } catch (e) {
        console.log(e);
        return [];
      }
    }
    return await this.getDeathsByLocation(location, year, causeOfDeath);
  }

  async getDeathsByLocation(location: string, year: string, causeOfDeath: string) {
    await this.loadDataIfNotLoaded();
    let fatalEncountersData: Death[] = this.fatalEncountersData.map((x: Death) => new Death({...x.toState()}));
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
    let fatalEncountersData = this.fatalEncountersData.map((x: Death) => new Death({...x.toState()}));;
    if (year !== 'all') {
      fatalEncountersData = await this.filterDataForYear(year);
    }
    if (causeOfDeath !== 'all') {
      fatalEncountersData = await this.filterDataForCauseOfDeath(causeOfDeath);
    }
    const locations = this.aggregateByLocation(location, fatalEncountersData).map(record => record.geoId);
    // filter by race
    let whiteDeathData: any[] = fatalEncountersData.filter((record: any) => record.race === 'European-American/White');
    let blackDeathData: any[] = fatalEncountersData.filter((record: any) => record.race === 'African-American/Black');
    whiteDeathData = this.aggregateByLocation(location, whiteDeathData);
    blackDeathData = this.aggregateByLocation(location, blackDeathData);
    let whiteDeathDataObj: any = this.countDeaths(whiteDeathData);
    let blackDeathDataObj: any = this.countDeaths(blackDeathData);
    const blackToWhiteDeathRatios: any = {};
    for (let locationId of locations) {
      let ratio;
      if (blackDeathDataObj[locationId] === undefined) {
        // if there is no record of black deaths, it is zero
        ratio = 0;
      } else if (whiteDeathDataObj[locationId] === undefined && blackDeathDataObj[locationId] !== undefined) {
        // if there is no record of white deaths, it is zero,
        // but can't divide by zero
        ratio = blackDeathDataObj[locationId] / 1;
      } else if (blackDeathDataObj[locationId] && whiteDeathDataObj[locationId]) {
        ratio = blackDeathDataObj[locationId] / whiteDeathDataObj[locationId];
      } else {
        ratio = 0;
      }
      blackToWhiteDeathRatios[locationId] = Number(ratio);
    }
    let blackToWhiteRiskData: any[] = []
    if (location.toLowerCase() === 'counties') {
      blackToWhiteRiskData = censusService.raceDataByCounty; 

    } else if (location.toLowerCase() === 'states') {
      blackToWhiteRiskData = censusService.raceDataByState; 
    } else {
      throw new Error('Invalid location.');
    }

    // calculate black : white death ratio, not total deaths 

    const riskData: any = {};
    for (let locationId in blackToWhiteDeathRatios) {
      const record = blackToWhiteRiskData.find(record => record.geoId === locationId);
      if (record) {
        
        // deaths ratio / demo ratio
        const deathsRatio = blackToWhiteDeathRatios[locationId];
        const BWRaceRatio = record.raceRatio;
        const risk = deathsRatio / BWRaceRatio;  
        
        riskData[locationId] = risk;
      }
    }
    return riskData;
  }

  aggregateByLocation(location: string, fatalEncountersData: Death[]) {
    return fatalEncountersData.map((record: Death) => {
      let geoId: string = 'undefined';
      if (location.toLowerCase() === 'counties') {
        geoId = record.fips;
      } else if (location.toLowerCase() === 'states') {
        // state
        geoId = record.stateId;
      } else {
        throw new Error('Invalid location');
      }
      return {
        geoId: geoId
      };
    });
  }

  async filterDataForYear(year: string) {
    // await this.loadDataIfNotLoaded();
    return this.fatalEncountersData.filter((data: Death) => {
      if (data.year === '2100') return false; // fatal encounters uses a year 2100 as a spacer.  Yeah, I don't get it either.
      return data.year === year;
    });
  }

  async filterDataForCauseOfDeath(causeOfDeath: string) {
    return this.fatalEncountersData.filter((data: Death) => {
      return causeOfDeath === data.causeOfDeath;
    });
  }
}

export default new FatalService();