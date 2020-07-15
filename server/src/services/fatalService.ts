import { loadFatalEncountersData, getCountyFips, stateIds } from '../3rdParty/index';
import { toTitleCase } from '../utility';
import { columnHeadings } from '../constants';
import DeathDB from '../models/deathDB';

class fatalService {
  private fatalEncountersData: any[];
  private counties: any[];
  private stateIds: any[];

  constructor() { }

  async init(cb?: Function) {
    if (!this.counties) {
      await this.loadCountyFips();
    }
    if (!this.stateIds) {
      await this.loadStateIds();
    }
    if (!this.fatalEncountersData) {
      await this.loadFatalEncountersData();
    }
    if (cb) { cb.bind(this)(); }
  }

  getFatalEncountersData() {
    return this.fatalEncountersData.map(record => record.toState());
  }

  async loadFatalEncountersData(): Promise<void> {
    console.log('fatal load')
    const fatalData = await loadFatalEncountersData();
    this.fatalEncountersData = fatalData.map(record => {
      const county = record[columnHeadings.counties];
      const fips: string = this.getCountyFipsId(county);
      const state = record[columnHeadings.states];
      const stateId: string = this.getStateId(state);
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

  async loadCountyFips() {
    this.counties = await getCountyFips();
  }

  async loadStateIds() {
    this.stateIds = stateIds;
  }

  getCountyFipsId(county: string) {
    county = toTitleCase(county);
    const fipsRecord = this.counties.find((x: any) => x.Name === county);
    if (fipsRecord && fipsRecord.FIPS) { 
      return fipsRecord.FIPS;
    } else {
      return null;
    }
  }

  getStateId(state: string) {
     state = state.toUpperCase();
    const stateRecord = this.stateIds.find((x: any) => x.id === state);
    if (stateRecord) {
      return stateRecord.val;
    } else {
      return null;
    }
  }
}

export default new fatalService;