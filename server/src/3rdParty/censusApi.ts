const nodeFetch = require('node-fetch');
const racePopByCountyUrl = 'https://data.census.gov/api/access/data/table?g=0100000US.050000&id=ACSDT1Y2018.B02001';

export const getCensusRaceDataByCounty = async () => {
  const censusResponse = await nodeFetch(racePopByCountyUrl); 
    const json = await censusResponse.json();
    return json.response.data;
}