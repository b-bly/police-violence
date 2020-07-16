import { Point } from "react-simple-maps";

export interface IColumnHeadings {
  [key: string]: string
}

export const columnHeadings: IColumnHeadings = {
  counties: "Location of death (county)",
  states: "Location of death (state)",
  causeOfDeath: "Cause of death",
  date: "Date of injury resulting in death (month/day/year)",
  race: "Subject's race"
}

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

export interface Position {
  coordinates: Point,
  zoom: number
}