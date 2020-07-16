import { IRaceGeo } from "../types";
import RaceGeo from "../models/RaceGeo";

class CensusService {
  raceDataByCounty: any[] = [];
  raceDataByState: any[] = [];
  constructor() {
    this.loadDataIfNotLoaded();
   }

  async get(url: string) {
    try {
      const res = await fetch(url);
      return await res.json();
    } catch (e) {
      console.log(e);
    }
  }

  async loadRaceDataByCounty() {
    const url = '/api/census/county';
    const data: IRaceGeo[] = await this.get(url);
    return data.map((record: IRaceGeo) => new RaceGeo(record));
  }

  async loadRaceDataByState() {
    const url = '/api/census/state';
    const data: IRaceGeo[] = await this.get(url);
    return data.map((record: IRaceGeo) => new RaceGeo(record));
  }

  async getRaceDataByCounty() {
    await this.loadDataIfNotLoaded();
    return this.raceDataByCounty;
  }

  async getRaceDataByState() {
    await this.loadDataIfNotLoaded();
    return this.raceDataByCounty;
  }

  async loadDataIfNotLoaded() {
    if (this.raceDataByCounty.length < 1) {
      try {
      this.raceDataByCounty = await this.loadRaceDataByCounty();
      this.raceDataByState = await this.loadRaceDataByState();
      } catch (e) {
        console.log(e);
        this.raceDataByCounty = [];
      }
    } 
  }
}

export default new CensusService();