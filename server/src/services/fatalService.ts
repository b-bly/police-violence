import { loadFatalEncountersData, getCountyFips, stateIds } from '../3rdParty/index';
import { columnHeadings } from '../types';
import GeoService from './geoService';
import { IDeath } from '../models';

class FatalService {
  private fatalEncountersData: IDeath[];
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
    return this.fatalEncountersData;
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

      const data: IDeath = {
        race,
        county,
        fips,
        state,
        stateId,
        causeOfDeath,
        date
      };
      return data;
    });
  }
}

export default new FatalService();