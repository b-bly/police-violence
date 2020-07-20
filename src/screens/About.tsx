import React from 'react';
import './About.css';
import { blue } from '../style/colors';

interface AboutProps {

}

export const About: React.FC<AboutProps> = ({ }) => {
  return (
    <div className="container">
      <div className="text-container">
        <h1 className="title">About</h1>
        <h2>Data sources</h2>
        <p><strong>Deaths in police encounters</strong>: fatalencounters.org &nbsp;
          <a href="https://docs.google.com/spreadsheets/d/1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE/edit#gid=0">
          database</a>
        </p>
        <p>These are deaths that occured while police were on the scene.  Quoted from fatalencounters.org: </p>
        <p className="quote">"We try to document all deaths that happen when police are present or that are caused by police: on-duty, off-duty, criminal, line-of-duty, local, federal, intentional, accidental–all of them."</p>
        <p><strong>Demographics</strong>: U.S. Census Bureau, 2018 American Community Survey 1-Year Estimates
     
        </p>
        <p>
          <a href="https://data.census.gov/cedsci/table?q=race&tid=ACSDT1Y2018.B02001&vintage=2018&hidePreview=true&g=0100000US.04000.001">
            Race by state
        </a>
        &nbsp;
        <a href="https://data.census.gov/cedsci/table?q=race&tid=ACSDT1Y2018.B02001&vintage=2018&hidePreview=true&g=0100000US.050000">
          Race by county
        </a>
        </p>
        <p><strong>Calculations</strong>: </p>
        <p><strong>Risk</strong>: the times more likely a black person is to die in a police encounter than a white person.  
          This was calculated as follows:
        </p>
        <p className="calculation">ratio of black : white deaths / black : white population ratio</p>
        <p className="calculation">(number of black deaths  / number of white deaths) / (black population / white population)</p>
        <p>Example:</p>
        <p>For example, in Los Angeles County, there were 245 black deaths and 200 white deaths between January 1, 2000 and July 20, 2020.</p>
        <p>The population of black people is 811,476.  The population of whites is 5,184,112.</p>
        <p className="calculation">(245 / 200) / (811,476 / 5,184,112)  = 7.83 
        </p>
        <p className="calculation">A black person is 7.83 times more likely to die in an encounter 
        with the police than a white person.
        </p>
      </div>
    </div>
  );
}


// fatal encounters data:
// https://docs.google.com/spreadsheets/d/1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE/edit#gid=0
// download:
// https://docs.google.com/spreadsheets/d/1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE/export?format=csv&id=1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE&gid=0
// blocked by cors
// possible workaround with jsonp:
// https://stackoverflow.com/questions/32897921/why-does-this-cors-request-to-a-google-drive-sheet-fail-in-firefox-works-in-c

// census api with race data
// https://www.census.gov/data/developers/data-sets/decennial-census.html
// file download https://www.census.gov/data/tables/time-series/demo/popest/2010s-counties-detail.html


// Total black
// H016B001

// age and sex
// https://data.census.gov/api/access/data/table?g=0100000US&id=ACSST1Y2018.S0101

    // total black
    // B02001_003E (use) index 37

    // total white
    // B02001_002E  index 21

// 2017

// counties - race
// api:  https://data.census.gov/api/access/data/table?g=0100000US.050000&id=ACSDT1Y2018.B02001
// table: https://data.census.gov/cedsci/table?q=race&tid=ACSDT1Y2018.B02001&vintage=2018&hidePreview=true&g=0100000US.050000

// states
// table
// https://data.census.gov/cedsci/table?q=race&tid=ACSDT1Y2018.B02001&vintage=2018&hidePreview=true&g=0100000US.04000.001
// api
// https://data.census.gov/api/access/data/table?g=0100000US.04000.001&id=ACSDT1Y2018.B02001

// counties - black
// https://data.census.gov/api/access/data/table?t=Black%20or%20African%20American&g=0100000US.050000&y=2018&id=ACSDT1Y2018.B01001B