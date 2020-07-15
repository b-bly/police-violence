import DeathDB from "./deathDB";

export default class Death extends DeathDB {
  get year() {
    return this.date.getFullYear().toString();
  }  
}