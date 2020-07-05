import { csv } from 'd3-fetch';
import { scaleQuantile } from 'd3-scale';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Legend } from './legend';
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

const maxRange = 10;

const style = {
    flexRow: {
        display: 'flex',
        width: '100%',
        height: '100%'
    },
    block: {
        display: 'block',
        width: '100%'
    }
}

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

interface graphProps {

}

export const Graph: React.FC<any> = (props: any) => {
    const [data, setData] = useState<any>({});
    const [countyFips, setCountyFips] = useState<any>([]);
    const [range, setRange] = useState<any>(maxRange);
    const [colorScaleQuantiles, setColorScaleQuantiles] = useState<any>(null);

    useEffect(() => {
        if (countyFips && countyFips.length < 1) {
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
                            fips: fipsRecord ? fipsRecord.FIPS : county
                        }
                    }).then((d: any) => {
                        d = formatData(d);
                        setData(d);
                        // animateData();
                        setRange(maxRange);
                        let colorScaleQuantiles = getColorScale(maxRange);
                        setColorScaleQuantiles(colorScaleQuantiles.quantiles());
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
            deathsByCounty[fips] = data[fips].length;
        }
        return deathsByCounty;
    }

     function getColorScale(range: number) {
        let colorScale = scaleQuantile()
            .domain(
                _.uniq(Object.keys(data).map((key: string) => data[key]))
            )
            .range(Array.from(Array(range).keys()));
        return colorScale;
    }




    let colorScale = scaleQuantile()
        .domain(
            _.uniq(Object.keys(data).map((key: string) => data[key]))
        )
        .range(Array.from(Array(range).keys()));


    const animateData = () => {
        let repeats = 4;
        let offset = 1;
        let timeout = 0;
        const animationTime = 4000;
        const timeDiff = animationTime / repeats;
        for (let i = 0; i < repeats; i++) {
            timeout += timeDiff;
            setTimeout(() => {
                const currRange = Math.floor((maxRange - offset) / (repeats - i) + offset);
                setRange(currRange);
                console.log(currRange)
            }, timeout);
        }

    }


    return (
        <div>
            {colorScale ?
                <div style={style.flexRow}>
                    <div style={style.block}>
                        <ComposableMap projection="geoAlbersUsa">
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo: any) => {
                                        const cur = data[geo.id]; // id == fips county
                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill={cur ? colorMap[colorScale(cur)] : "#EEE"}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ComposableMap>
                    </div>
                    <Legend 
                        colorMap={colorMap}
                        colorScaleQuantiles={colorScale.quantiles()}
                        label={'fatalities'}
                    />

                </div>
                :
                <div>loading</div>
            }

        </div>
    );
}

// fatal encounters data:
// https://docs.google.com/spreadsheets/d/1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE/export?format=csv&id=1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE&gid=0
// blocked by cors
// possible workaround with jsonp:
// https://stackoverflow.com/questions/32897921/why-does-this-cors-request-to-a-google-drive-sheet-fail-in-firefox-works-in-c

// Unique ID,Subject's name,Subject's age,Subject's gender,Subject's race,
// Subject's race with imputations,Imputation probability,URL of image of deceased,
// Date of injury resulting in death (month/day/year),Location of injury (address),Location of death (city),
// Location of death (state),Location of death (zip code),Location of death (county),Full Address,Latitude,
// Longitude,Agency responsible for death,Cause of death,A brief description of the circumstances surrounding the death,
// "Dispositions/Exclusions INTERNAL USE, NOT FOR ANALYSIS",Intentional Use of Force (Developing),
// Link to news article or photo of official document,"Symptoms of mental illness? INTERNAL USE, NOT FOR ANALYSIS",
// Video,Date&Description,Unique ID formula,Unique identifier (redundant),Date (Year)

// Date of injury resulting in death (month/day/year)
// Cause of death
// Date (Year)