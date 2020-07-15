import csv from 'csv-parser'; // const csv = require('csv-parser');
const fs = require('fs');

export const getJsonFromCsv = async (url: string, cb?: Function): Promise<any[]> => {
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
    function (txt) {
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