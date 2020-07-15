import { getCountyFips, stateIds } from '../3rdParty/index';
import { toTitleCase } from '../utility';

class GeoService {
  stateIds: any[];
  counties: any[];

  async init(cb: () => void) {
    if (!this.counties) {
      await this.loadCountyFips();
    }
    if (!this.stateIds) {
      await this.loadStateIds();
    }
    cb.bind(this)();
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

export default new GeoService();