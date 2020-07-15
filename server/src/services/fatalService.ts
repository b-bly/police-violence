import { loadFatalEncountersData, getCountyFips, stateIds } from '../3rdParty/index';
import { columnHeadings } from '../constants';
import DeathDB from '../models/deathDB';
import GeoService from './geoService';

class FatalService {
  private fatalEncountersData: any[];
  private counties: any[];
  private stateIds: any[];

  constructor (public geoService = GeoService) {}

  async init(cb?: () => void) {

    if (!this.fatalEncountersData) {
      await this.loadFatalEncountersData();
    }
    if (cb) { cb.bind(this)(); }
  }

  getFatalEncountersData() {
    return this.fatalEncountersData.map(record => record.toState());
  }

  async loadFatalEncountersData(): Promise<void> {
    await this.geoService.init(() => { return; });
    const fatalData = await loadFatalEncountersData();
    this.fatalEncountersData = fatalData.map(record => {
      const county = record[columnHeadings.counties];
      const fips: string = this.geoService.getCountyFipsId(county);
      const state = record[columnHeadings.states];
      const stateId: string = this.geoService.getStateId(state);
      const causeOfDeath = record[columnHeadings.causeOfDeath];
      const race = record[columnHeadings.race];
      const date = new Date(record[columnHeadings.date]).toISOString();

      return new DeathDB(
        race,
        county,
        fips,
        state,
        stateId,
        causeOfDeath,
        date);
    });
  }
}

export default new FatalService();