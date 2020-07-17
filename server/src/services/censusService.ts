import { getCensusRaceDataByCounty, getCensusRaceDataByState } from '../3rdParty/censusApi';
import { IRaceGeo, GeoType } from '../models';

class CensusService {
  censusCountyData: any[];
  censusStateData: any[];

  async init(cb?: () => void) {
    if (!this.censusCountyData) {
      const data: any[] = await getCensusRaceDataByCounty();
      this.censusCountyData = this.formatCountyData(data, GeoType.county);
    }
    if (!this.censusStateData) {
      const data: any[] = await getCensusRaceDataByState();
      this.censusStateData = this.formatStateData(data, GeoType.state);
    }
    if (cb) { cb.bind(this)(); }
  }


  formatStateData(csvObject: any[], geoType: GeoType) {
    const headers = csvObject[0];
    // total black
    // B02001_003E (use) index 36

    // total white
    // B02001_002E  index 20

    const blackIndex = headers.indexOf('B02001_003E');
    const whiteIndex = headers.indexOf('B02001_002E');

    return csvObject.slice(1).map<IRaceGeo>((record: any, i) => {
      let geoId: string = record[24];
      const numberOfBlacks = parseInt(record[blackIndex], 10) === null ? 0 : parseInt(record[blackIndex], 10);
      const numberOfWhites = parseInt(record[whiteIndex], 10) === null ? 0 : parseInt(record[whiteIndex], 10);
      const raceGeo: IRaceGeo = {
        geoType,
        numberOfBlacks,
        numberOfWhites,
        geoId
      };
      return raceGeo;

    }).filter((record: IRaceGeo) => Object.keys(record).length !== 0);
  }

  formatCountyData = (csvObject: any[], geoType: GeoType) => {
    const headers = csvObject[0];
    // total black
    // B02001_003E (use) index 37

    // total white
    // B02001_002E  index 21

    const blackIndex = headers.indexOf('B02001_003E');
    const whiteIndex = headers.indexOf('B02001_002E');

    return csvObject.slice(1).map<IRaceGeo>((record: any, i) => {
      // geoId = fips = state [25] + county [15] 
      let geoId: string = record[25] + record[15];
      if (record[blackIndex] !== null && record[whiteIndex] !== null) {
        const numberOfBlacks = parseInt(record[blackIndex], 10);
        const numberOfWhites = parseInt(record[whiteIndex], 10);
        const raceGeo: IRaceGeo = {
          geoType,
          numberOfBlacks,
          numberOfWhites,
          geoId
        };
        return raceGeo;
      }
      const empty: any = {};
      return empty;
    }).filter((record: IRaceGeo) => Object.keys(record).length !== 0);
  }
}

export default new CensusService();