import { getCensusRaceDataByCounty } from '../3rdParty/censusApi';
import { columnHeadings } from '../constants';

class CensusService {
  censusCountyData: any[] = [];
  censusStateData: any[] = [];

  async init(cb?: () => void) {
    if (this.censusCountyData.length < 1) {
      this.censusCountyData = await getCensusRaceDataByCounty();
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

    return csvObject.slice(1).map<any[]>((record: any[], i) => {
      const formattedRecord: any = {};
      if (record[blackIndex] !== null && record[whiteIndex] !== null) {
        formattedRecord.blackToWhiteRatio = parseInt(record[blackIndex], 10) / parseInt(record[whiteIndex], 10); // black / white
      } else {
        const empty: any = {};
        return empty;
      }
      // record[15] has a county id, but it's not the fips one.
      // 25 down--first part of fips?
      // state [25] + county [15] = fips
      const fips = record[25] + record[15];
      formattedRecord.county = fips;
      return formattedRecord;
    });
  }

  getCensusRaceDataByCountyBlackWhite = () => {
    let data = this.censusCountyData;
    data = this.csvStyleJsonToKeyValueBlackWhite(data);
    return data;
  }


  // Example ratio calc
  // demogr: 25 black  75 white
  // deaths 66 black   33 white
  // demogr b:w ratio = 1/3
  // deaths b:w reatio = 2/1
  // risk b:w = 2 deaths / .33 dem = 6 x
}

export default new CensusService();