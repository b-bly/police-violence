const moment = require('moment');
import { columnHeadings } from '../constants';
import GeoService from './geoService';
import { IDeath } from '../models';
import { getFatalEncountersData } from '../3rdParty/fatalGoogleSheet';
// import { loadFatalEncountersData } from '../3rdParty/index';

import _ from 'lodash';

class FatalService {
  private fatalEncountersData: IDeath[];

  constructor(public geoService = GeoService) { }

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
    const fatalData = await getFatalEncountersData();

    // to load from csv:
    // const fatalData = await loadFatalEncountersData();

    this.fatalEncountersData = fatalData.map((record: any, i: number) => {
      const county = record[columnHeadings.counties] ? record[columnHeadings.counties] : null;
      const state = record[columnHeadings.states] ? record[columnHeadings.states] : null;
      const causeOfDeath: string = null; // record[columnHeadings.causeOfDeath] ? record[columnHeadings.causeOfDeath] :
      const race = record[columnHeadings.race] ? record[columnHeadings.race] : null;
      const fips: string = !county ? null : this.geoService.getCountyFipsId(county);
      const stateId: string = state ? this.geoService.getStateId(state) : null;
      const dateObj = moment(record[columnHeadings.date]);
      const date: string = dateObj ? dateObj.toISOString() : null;
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