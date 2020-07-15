import { toTitleCase } from '../utility';
import { getCountyFips } from '../3rdParty/index';
import { columnHeadings } from '../constants';

class GeoService {
  states: any[] = [];
  counties: any[] = [];

  constructor() { }

  async init(cb: Function) {
    this.counties = await getCountyFips();
    cb.bind(this)();
  }

  getCountyFipsId = (record: any) => {
    const county = toTitleCase(record[columnHeadings.counties]);
    const fipsRecord = this.counties.find((x: any) => x.Name === county);
    return fipsRecord ? fipsRecord.FIPS : county;
  }

  getStateId = (record: any) => {
    const state: string = record[columnHeadings.states].toUpperCase();
    const stateRecord = this.states.find((x: any) => x.id === state);
    return stateRecord ? stateRecord.val : state;
  }
}

export default new GeoService();