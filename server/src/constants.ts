import { IColumnHeadings } from "./types";


export const columnHeadings: IColumnHeadings = {
  counties: "Location of death (county)",
  states: "State",
  causeOfDeath: 'Cause of death',
  date: "Date of injury resulting in death (month/day/year)",
  race: 'Subject\'s race'
};

export const causesOfDeath = [
  "Vehicle",
  "Gunshot",
  "Beaten/Bludgeoned with an instrument",
  "Stabbed",
  "Asphyxiated/Restrained",
  "Drowned",
  "Drug overdose",
  "Drowned",
  "Drug overdose",
  "Fell from a height",
  "Undetermined",
  "Chemical agent/Pepper spray",
  "Medical emergency",
  "Other",
  "Burned/Smoke inhalation",
  "Tasered",
  "Unknown"
];

export const races = ['European-American/White', 'African-American/Black', 'Hispanic/Latino',
'Race unspecified', 'Native American/Alaskan', 'Asian/Pacific Islander', 'Middle Eastern',
'HIspanic/Latino'];

export const allowedExt = [
	'.js',
	'.ico',
	'.css',
	'.png',
	'.jpg',
	'.woff2',
	'.woff',
	'.ttf',
	'.svg',
];
