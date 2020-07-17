import csv from 'csv-parser'; // const csv = require('csv-parser');
const fs = require('fs');

export const getJsonFromCsv = async (url: string, cb?: () => void): Promise<any[]> => {
  const data: any[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(url)
      .on('error', () => {
        console.log('error');
        reject();
      })
      .pipe(csv())
      .on('data', (row: any) => {
        data.push(row);
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        resolve(data);
      });
  });
}

export const formatFips = (fips: string) => {
  while (fips.length < 5) {
    fips = '0' + fips;
  }
  return fips;
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const csvToJSON = (csv: string) => {
  const lines = csv.split("\n");
  const result = [];
  const headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {

    const obj: any = {};
    const currentline = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }

  //return result; //JavaScript object
  return result;
}