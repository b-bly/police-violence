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
    return await this.get(url);
  }

  async loadRaceDataByState() {
    const url = '/api/census/state';
    return await this.get(url);
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
      this.raceDataByCounty = await this.loadRaceDataByCounty();
    } 
  }
}

export default new CensusService();