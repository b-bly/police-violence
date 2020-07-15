export default class DeathDB {
  race: string;
  county: string;
  fips: string;
  state: string;
  stateId: string;
  causeOfDeath: string;
  date: Date;

  constructor(
    race: string,
    county: string,
    fips: string,
    state: string,
    stateId: string,
    causeOfDeath: string,
    date: string
    ) {
      this.race = race;
      this.county = county;
      this.fips = fips;
      this.state = state;
      this.stateId = stateId;
      this.causeOfDeath = causeOfDeath;
      this.date = new Date(date);
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