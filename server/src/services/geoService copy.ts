import { toTitleCase } from '../utility';
import { getCountyFips } from '../3rdParty/index';

interface ColumnHeadings {
  [key: string]: string
}

const columnHeadings: ColumnHeadings = {
  counties: "Location of death (county)",
  states: "Location of death (state)",
  causeOfDeath: "Cause of death",
  date: "Date of injury resulting in death (month/day/year)"
};

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