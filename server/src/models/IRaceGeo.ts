import { GeoType } from './../constants';

export interface IRaceGeo {
  geoType: GeoType,
  numberOfBlacks: number,
  numberOfWhites: number,
  geoId: string,
}