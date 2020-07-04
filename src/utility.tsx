export const csvToJSON = (csv: any) => {
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
}

export function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export const formatFips = (fips: string) => {
  while (fips.length < 5) {
    fips = '0' + fips;
  }
  return fips;
}