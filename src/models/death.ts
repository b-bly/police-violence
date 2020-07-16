import { IDeath } from "../types";

export default class Death {
  race: string;
  county: string;
  fips: string;
  state: string;
  stateId: string;
  causeOfDeath: string;
  date: Date;

  constructor(death: IDeath) {
      this.race = death.race;
      this.county = death.county;
      this.fips = death.fips;
      this.state = death.state;
      this.stateId = death.stateId;
      this.causeOfDeath = death.causeOfDeath;
      this.date = new Date(death.date);
  }

  get year() {
    return this.date.getFullYear().toString();
  }  

  toState() {
    return {
      race: this.race,
      county: this.county,
      fips: this.fips,
      state: this.state,
      stateId: this.stateId,
      causeOfDeath: this.causeOfDeath,
      date: this.date.toISOString()
    };
  }
}