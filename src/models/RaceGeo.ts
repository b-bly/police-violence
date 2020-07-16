import { GeoType } from "../types";
import { IRaceGeo } from "./IRaceGeo";

export default class RaceGeo {
  geoType: GeoType;
  numberOfBlacks: number;
  numberOfWhites: number;
  geoId: string;

  constructor(
    raceGeo: IRaceGeo
  ) {
    this.geoType = raceGeo.geoType;
    this.numberOfBlacks = raceGeo.numberOfBlacks;
    this.numberOfWhites = raceGeo.numberOfWhites;
    this.geoId = raceGeo.geoId;
  }

  // Example ratio calc
  // demogr: 25 black  75 white
  // deaths 66 black   33 white
  // demogr b:w ratio = 1/3
  // deaths b:w reatio = 2/1
  // risk b:w = 2 deaths / .33 dem = 6 x

  get raceRatio() {
    return this.numberOfBlacks / this.numberOfWhites;
  }

  toState() {
    return {
      geoType: this.geoType,
      numberOfBlacks: this.numberOfBlacks,
      numberOfWhites: this.numberOfWhites,
      geoId: this.geoId
    };
  }
}