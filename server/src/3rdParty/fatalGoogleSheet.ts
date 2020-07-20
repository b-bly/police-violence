import { causesOfDeath, columnHeadings, races } from '../constants';
import _ from 'lodash';
const nodeFetch = require('node-fetch');

const getCauseOfDeath = (currentLine: string[]) => {
  const cause = _.chain(currentLine).filter((el) => causesOfDeath.includes(el)).head().value();
  return cause;
}

const getRace = (currentLine: string[]) => {
  return _.chain(currentLine).filter((el) => races.includes(el)).head().value();
}

export const fatalCsvToJSON = (csv: string) => {
  const lines = csv.split("\n");
  const result = [];
  const headers = lines[0].split(",");
  for (let i = 1; i < lines.length; i++) {
    const obj: any = {};
    const currentLine = lines[i].split(",");
    for (let j = headers.length - 1; j >= 0; j--) {
      if (headers[j] && headers[j].toLowerCase() === columnHeadings.causeOfDeath.toLowerCase()) {
        // necessary because if a column is empty, Google Sheets just omits it from the data (no ',')
        obj[headers[j]] = getCauseOfDeath(currentLine);
      } else if (headers[j] && headers[j] === columnHeadings.race) {
        obj[headers[j]] = getRace(currentLine);
      } else {
        obj[headers[j]] = currentLine[j];
      }
    }
    result.push(obj);
  }

  // return result; //JavaScript object
  return result;
}

export const getFatalEncountersData = async () => {
  const url = 'https://docs.google.com/spreadsheets/d/1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE/export?format=csv&id=1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE&gid=0';
  try {
    const data = await nodeFetch(url);
    const text = await data.text();
    const json = fatalCsvToJSON(text);
    return json;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// { 'Unique ID': '25747',
//   'Subject\'s name': 'Mark A. Horton',
//   'Subject\'s age': '21',
//   'Subject\'s gender': 'Male',
//   'Subject\'s race': 'African-American/Black',
//   'Subject\'s race with imputations': 'African-American/Black',
//   'Imputation probability': 'Not imputed',
//   'URL of image of deceased': '',
//   'Date of injury resulting in death (month/day/year)': '01/01/2000',
//   'Location of injury (address)': 'Davison Freeway',
//   'Location of death (city)': 'Detroit',
//   'Location of death (state)': 'MI',
//   'Location of death (zip code)': '48203',
//   'Location of death (county)': 'Wayne',
//   'Full Address': 'Davison Freeway Detroit MI 48203 Wayne',
//   Latitude: '42.4045258',
//   Longitude: '-83.0922741',
//   'Agency responsible for death': '',
//   'Cause of death': 'Vehicle',
//   'A brief description of the circumstances surrounding the death':
//    '"Two Detroit men killed when their car crashed were among at least eight people who died in New Year\'s holiday weekend traffic accidents in Michigan',
//   '"Dispositions/Exclusions INTERNAL USE': ' police said. Mark A Horton',
//   ' NOT FOR ANALYSIS"':
//    ' National Highway Traffic Safety Administration data shows police reported two people dying in a police pursuit at 1:54 a.m. on January 1',
//   'Intentional Use of Force (Developing)': ' and passenger Phillip A. Blurbridge',
//   'Link to news article or photo of official document': ' 19',
//   '"Symptoms of mental illness? INTERNAL USE':
//    ' were killed when their car crashed in their hometown at 1:54 a.m. They were not wearing seat belts. While these deaths were not reported in news media as police pursuit deaths',
//   Video: ' 2000',
//   'Date&Description':
//    ' on Davison Freeway. It was the only double fatality crash in Michigan that night."',
//   'Unique ID formula': 'Unreported',
//   'Unique identifier (redundant)': 'Vehicle/Pursuit',
//   'Date (Year)\r':
//    'https://drive.google.com/file/d/1-nK-RohgiM-tZ5QV0fKOefRUbwJDRD6i/view?usp=sharing' }
