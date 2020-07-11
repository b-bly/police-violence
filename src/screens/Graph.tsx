import { scaleQuantile } from 'd3-scale';
import _ from 'lodash';
import React, { useEffect, useState, Fragment } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import FatalService from '../services/fatalService';
import { Dropdown } from '../components/Dropdown';
import './GraphStyle.css';
import { Legend } from '../components/Legend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

library.add(faSpinner);
// const colorMap = [
//     "#ffedea",
//     "#ffcec5",
//     "#ffad9f",
//     "#ff8a75",
//     "#ff5533",
//     "#e2492d",
//     "#be3d26",
//     "#9a311f",
//     "#782618"
// ];

const colorMap = ["rgb(227,108,236)", "rgb(198,98,217)", "rgb(170,89,198)", "rgb(142,79,179)",
    "rgb(113,70,160)", "rgb(85,60,141)", "rgb(57,51,122)", "rgb(28,41,103)", "rgb(0,32,84)"].reverse();

const maxRange = colorMap.length;

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

const locations = ['states', 'counties'];

interface graphProps {
    width: number,
    height: number
}

export const Graph: React.FC<graphProps> = ({height}) => {
    const fatalService = FatalService;
    const [dropdownOpen, setDropdownOpen] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>({});
    const [location, setLocation] = useState<string>('states');
    const [geoUrl, setGeoUrl] = useState<string>(getGeoUrl('states'));
    const [yearsRange, setYearsRange] = useState<string[]>([]);
    // const [dependent, setDependent] = useState<string>('deaths');
    const [year, setYear] = useState<string>('all');
    const locationRef: React.RefObject<HTMLUListElement> = React.createRef();
    const yearsRef: React.RefObject<HTMLUListElement> = React.createRef();
    const dropdownRefs = [locationRef, yearsRef];

    const handleClickOutside = (event: MouseEvent) => {
        event.preventDefault();
        const outsideClicks = dropdownRefs.filter((ref) => {
            if (ref && ref !== null) {
                const cur = ref.current;
                if (cur) {
                    if (cur && !cur.contains(event.target as Node)) {
                        // This is an outside click
                        return true;
                    }
                }
            }
            return false;
        });
        if (outsideClicks.length === dropdownRefs.length) {
            // outside all dropdowns
            setDropdownOpen('');
        }
    };

    const getData = async (newLocation?: string, newYear?: string) => {
        setLoading(true);
        if (!newLocation) { newLocation = location }
        if (!newYear) { newYear = year }
        let deathData;
        if (newLocation === 'counties') {
            if (newYear === 'all') {
                deathData = await fatalService.getTotalDeathsByCounty();
            } else {
                deathData = await fatalService.getTotalDeathsByCountyForYear(newYear);
            }

        } else if (newLocation === 'states') {
            if (newYear === 'all') {
                deathData = await fatalService.getTotalDeathsByState();
            } else {
                deathData = await fatalService.getTotalDeathsByStateForYear(newYear);
            }
        }
        setData(deathData);
        // animateData();
        // setRange(1); // for when animating data
        setLoading(false);
    }

    function getGeoUrl(newLocation?: string) {
        if (!newLocation) { newLocation = location }
        if (newLocation === 'counties') {
            return "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";
        } else if (newLocation === 'states') {
            return "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
        }
        return '';
    }

    // const handleClickOutside = () => {
    //     setDropdownOpen('');
    // }


    const load = () => {
        if (yearsRange.length < 1) {
            fatalService.getYearsRange().then(yearsRange => {
                yearsRange = yearsRange.map(year => year.toString());
                setYearsRange(['all', ...yearsRange]);
            });
        }
    }

    const selectLocation = async (newLocation: string) => {
        await setLocation(newLocation);
        setGeoUrl(getGeoUrl(newLocation));
        await getData(newLocation);
    }

    const selectYear = async (newYear: string) => {
        await setYear(newYear);
        await getData(location, newYear);
    }



    const getColorScale = (range: number) => {
        let colorScale = scaleQuantile()
            .domain(
                _.uniq(Object.keys(data).map((key: string) => data[key]))
            )
            .range(Array.from(Array(range).keys()));
        return colorScale;
    }

    let colorScale = getColorScale(maxRange);


    // const animateData = () => {
    //     let repeats = 6;
    //     let offset = 1;
    //     const animationTime = 4000;
    //     let timeout = 0;
    //     const timeDiff = animationTime / repeats;
    //     for (let i = 0; i < repeats; i++) {
    //         timeout += timeDiff;
    //         setTimeout(() => {
    //             const currRange = Math.floor((maxRange - offset) / (repeats - i) + offset);
    //             setRange(currRange);
    //             console.log(currRange)
    //         }, timeout);
    //     }
    // }

    const getRange = () => {
        const quantiles = colorScale.quantiles().map(x => Math.round(x).toString());
        quantiles.push('> ' + quantiles[quantiles.length - 1]);
        return quantiles;
    }

    useEffect(() => {
        if (data && Object.keys(data).length < 1) {
            getData(location);
            load();
        }
        document.addEventListener("mousedown", handleClickOutside);
        return function cleanup() {
            // remove event listener
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // https://docs.google.com/spreadsheets/d/1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE/edit#gid=0
        // county fips
        // https://www.nrcs.usda.gov/wps/portal/nrcs/detail/national/home/?cid=nrcs143_013697
    });

    const graph = <div style={style.flexRow}>
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
                                    fill={cur ? colorMap[colorScale(cur)] : "rgb(61, 61, 61)"}
                                />
                            );
                        })
                    }
                </Geographies>
            </ComposableMap>
        </div>
        <Legend
            colorMap={colorMap}
            colorScaleQuantiles={getRange()}
            label={'deaths'}
        />

    </div>
    return (
        <div>
            {!loading ?
                <Fragment>

                    < div className="flex-row">
                        <Dropdown
                            listRef={yearsRef}
                            choices={yearsRange}
                            label="Years"
                            setSelected={selectYear}
                            selected={year}
                            setDropdownOpen={setDropdownOpen}
                            dropdownOpen={dropdownOpen}
                            height={height}
                        />
                        <Dropdown
                            listRef={locationRef}
                            choices={locations}
                            label="Region type" // location
                            setSelected={selectLocation}
                            selected={location}
                            setDropdownOpen={setDropdownOpen}
                            dropdownOpen={dropdownOpen}
                            height={height}
                        />
                    </div>

                    {graph}
                </Fragment>

                :
                <div className="loader-container">
                    <FontAwesomeIcon icon="spinner" spin style={{ color: 'white', fontSize: '25px' }} />
                </div>
            }

        </div >
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