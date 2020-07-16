export enum GeoType {
  county,
  state
}

export interface IRaceGeo {
  geoType: GeoType,
  numberOfBlacks: number,
  numberOfWhites: number,
  geoId: string,
}

export interface IDeath {
  race: string,
  county: string,
  fips: string,
  state: string,
  stateId: string,
  causeOfDeath: string,
  date: string,
}