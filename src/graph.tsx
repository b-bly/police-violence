import { csv } from 'd3-fetch';
import { scaleQuantile } from 'd3-scale';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { formatFips, toTitleCase } from './utility';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

const colorMap = [
    "#ffedea",
    "#ffcec5",
    "#ffad9f",
    "#ff8a75",
    "#ff5533",
    "#e2492d",
    "#be3d26",
    "#9a311f",
    "#782618"
];

interface graphProps {

}

export const Graph: React.FC<graphProps> = (props) => {
    const [data, setData] = useState<any>({});
    const [countyFips, setCountyFips] = useState<any>([]);

    useEffect(() => {
        if ( countyFips && countyFips.length < 1) {
            csv("./data/county_fips.csv")
                .then((counties: any) => {
                counties = counties.map((record: any) => {
                    record.FIPS = formatFips(record.FIPS);
                    return record;
                });
                setCountyFips(counties);
                csv("./data/fatal_encounters.csv", (deaths: any) => {
                    const county = toTitleCase(deaths['Location of death (county)']);
                    const fipsRecord = counties.find((x: any) => x.Name === county);
                    return {
                        fips:  fipsRecord ? fipsRecord.FIPS : county
                    }
                }).then((d: any) => {
                    d = formatData(d);
                    setData(d);
                }).catch((e: Error) => console.log(e));
            }).catch((e: Error) => console.log(e));
           
            
        }
        // https://docs.google.com/spreadsheets/d/1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE/edit#gid=0

        // county fips
        // https://www.nrcs.usda.gov/wps/portal/nrcs/detail/national/home/?cid=nrcs143_013697
    });

    const formatData = (deaths: any) => {
        const data = _.groupBy(deaths, 'fips');
        const deathsByCounty: any = {};
        for (let fips in data) {
            deathsByCounty[fips] =  data[fips].length;
        }
        console.log(deathsByCounty[6037])
        return deathsByCounty;
    }

    const colorScale = scaleQuantile()
        .domain( 
            _.uniq(Object.keys(data).map((key: string) => data[key]))
            )
        .range(Array.from(Array(9).keys()));
    return (
        <div>
            <ComposableMap projection="geoAlbersUsa">
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo: any) => {
                            const cur = data[geo.id]; // id == fips county
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={colorMap[colorScale(cur ? cur : "#EEE")]}
                                />
                            );
                        })
                    }
                </Geographies>
            </ComposableMap>
        </div>
    );
}
// fatal encounters data:
// https://docs.google.com/spreadsheets/d/1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE/export?format=csv&id=1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE&gid=0
// blocked by cors
// possible workaround with jsonp:
// https://stackoverflow.com/questions/32897921/why-does-this-cors-request-to-a-google-drive-sheet-fail-in-firefox-works-in-c