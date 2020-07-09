import { csv } from 'd3-fetch';
import { formatFips, toTitleCase } from './utility';
import _ from 'lodash';

class FatalService {
  counties: any[] = [];
   constructor() {
    this.getCountyFips().then((d) => {
      this.counties = d;
    });
  }

  async getJsonFromCsv(url: string, cb?: Function): Promise<any> {
    try {
      return await csv(url, (data) => cb? cb(data) : data);
    } catch (e) {
      return {
        error: e, message: "Error getting data from url: ${url}"
      }
    }
  }

  async getCountyFips() {
    if (this.counties.length < 1) {
      const url = "./data/county_fips.csv";
      let counties = await this.getJsonFromCsv(url);
      counties = counties.map((record: any) => {
        record.FIPS = formatFips(record.FIPS);
        return record;
      });
      this.counties = counties;
    }
    return this.counties;
  }

  formatData(deaths: any[]) {
    const data = _.groupBy(deaths, 'fips');
    const deathsByCounty: any = {};
    for (let fips in data) {
      deathsByCounty[fips] = data[fips].length;
    }
    return deathsByCounty;
  }

  async getTotalDeathsByCounty(counties: any[] = this.counties) {
    if (counties.length < 1) {
      this.counties = await this.getCountyFips();
    }
    let deathData: any = await this.getJsonFromCsv("./data/fatal_encounters.csv", (deaths: any) => {
      const county = toTitleCase(deaths['Location of death (county)']);
      const fipsRecord = this.counties.find((x: any) => x.Name === county);
      return {
        fips: fipsRecord ? fipsRecord.FIPS : county
      }
    });
    return this.formatData(deathData);
  }
}

export default FatalService;