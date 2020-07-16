import { IRaceGeo } from './../../../src/models/IRaceGeo';
import { getCensusRaceDataByCounty } from '../3rdParty/censusApi';
import { GeoType } from '../constants';
import RaceGeo from '../models/RaceGeo';

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
        return new RaceGeo( {
          geoType,
          numberOfBlacks,
          numberOfWhites,
          geoId
        });
      }
      const empty: any = {};
      return empty;
    }).filter((record: RaceGeo) => Object.keys(record).length !== 0);
  }

  getCensusRaceDataByCountyBlackWhite = () => {
    let data = this.censusCountyData.map((raceGeo: RaceGeo) => raceGeo.toState());;
    return data;
  }
}

export default new CensusService();