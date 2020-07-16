import { getCensusRaceDataByCounty } from '../3rdParty/censusApi';
import { IRaceGeo, GeoType } from '../models';

class CensusService {
  censusCountyData: any[] = [];
  censusStateData: any[] = [];

  async init(cb?: () => void) {
    if (this.censusCountyData.length < 1) {
      const data = await getCensusRaceDataByCounty();
      this.censusCountyData = this.csvStyleJsonToKeyValueBlackWhite(data);
    }
    if (cb) { cb.bind(this)(); }
  }

  csvStyleJsonToKeyValueBlackWhite = (csvObject: any[]) => {
    const headers = csvObject[0];
    // total black
    // B02001_003E (use) index 37

    // total white
    // B02001_002E  index 21

    const blackIndex = headers.indexOf('B02001_003E');
    const whiteIndex = headers.indexOf('B02001_002E');

    return csvObject.slice(1).map<IRaceGeo>((record: any, i) => {
      const geoType: GeoType = GeoType.county;
      // geoId = fips = state [25] + county [15] 
      const geoId: string = record[25] + record[15];
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

  getCensusCountyData () {
    return this.censusCountyData;
  }
}

export default new CensusService();