import React from 'react';
import './About.css';

interface AboutProps {

}

export const About: React.FC<AboutProps> = () => {
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