export interface IColumnHeadings {
  [key: string]: string
}

export const columnHeadings: IColumnHeadings = {
  counties: "Location of death (county)",
  states: "Location of death (state)",
  causeOfDeath: "Cause of death",
  date: "Date of injury resulting in death (month/day/year)",
  race: "Subject's race"
};