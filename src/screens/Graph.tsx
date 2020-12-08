// 3rd party
import { scaleQuantile } from 'd3-scale';
import _ from 'lodash';
import React, { useEffect, useState, Fragment } from 'react';
import { Point } from 'react-simple-maps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

// services
import FatalService from '../services/fatalService';

// components
import { Dropdown } from '../components/Dropdown';
import { Legend } from '../components/Legend';
import { Controls } from '../components/Controls';
import { Map } from '../components/Map'

// style
import './GraphStyle.css';
// utility
import { sleep } from '../utility';
import { calculateMapHeight, calculateMapWidth } from '../utility';

import { Position } from '../types';

library.add(faSpinner);

const colorMap = ["rgb(227,108,236)", "rgb(198,98,217)", "rgb(170,89,198)", "rgb(142,79,179)",
    "rgb(113,70,160)", "rgb(85,60,141)", "rgb(57,51,122)", "rgb(28,41,103)", "rgb(0,32,84)"].reverse();

const maxRange = colorMap.length;

const locations = ['states', 'counties'];

export interface graphProps {
    width: number,
    height: number,
    loading: boolean,
    setLoading: Function
  }

export const Graph: React.FC<graphProps> = ({ height, width, loading, setLoading }) => {
    const fatalService = FatalService;

    // variables

    const locationRef: React.RefObject<HTMLUListElement> = React.createRef();
    const yearsRef: React.RefObject<HTMLUListElement> = React.createRef();
    const causeOfDeathRef: React.RefObject<HTMLUListElement> = React.createRef();
    const dependentRef: React.RefObject<HTMLUListElement> = React.createRef();
    const dropdownRefs = [locationRef, yearsRef, causeOfDeathRef, dependentRef];
    const dependentRange = ['deaths'] // ['risk', 'deaths']
    const defaultLocation = 'counties';
    const defaultYear = 'all';
    const defaultCauseOfDeath = 'all';
    const defaultDependentVariable = 'risk';
    const center: Point = [-96, 38];


    // legend variables
    const titles: any = {
        deaths: 'Number of deaths',
        risk: 'Risk: Times more likely blacks are to die than whites.'
    };
    const labels: any = {
        deaths: 'deaths',
        risk: 'x'
    }

    // state

    const [dropdownOpen, setDropdownOpen] = useState('');
    const [data, setData] = useState<any>({});
    const [geoUrl, setGeoUrl] = useState<string>(getGeoUrl(defaultLocation));
    const [yearsRange, setYearsRange] = useState<string[]>([]);
    const [causesOfDeath, setCausesOfDeath] = useState<string[]>([]);
    const [location, setLocation] = useState<string>(defaultLocation);
    const [causeOfDeath, setCauseOfDeath] = useState<string>(defaultCauseOfDeath);
    const [year, setYear] = useState<string>(defaultYear);
    const [dependentVariable, setDependentVariable] = useState<string>(defaultDependentVariable)
    const [position, setPosition] = useState<Position>({ coordinates: center, zoom: 1 });


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

    const getData = async (newLocation: string, newYear: string, causeOfDeath: string, dependentVariable: string) => {
        setLoading(true);
        if (!newLocation) { newLocation = location }
        if (!newYear) { newYear = year }
        let deathData = await fatalService.getData(newLocation, newYear, causeOfDeath, dependentVariable);
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


    const load = async () => {
        if (yearsRange.length < 1) {
            fatalService.getYearsRange().then(yearsRange => {
                yearsRange = yearsRange.map(year => year.toString());
                setYearsRange(yearsRange);
            });
        }
        const causesOfDeath = await fatalService.getCausesOfDeath();
        setCausesOfDeath(causesOfDeath);
    }

    const selectDependent = async (newDependent: string) => {
        await setDependentVariable(newDependent);
        await getData(location, year, causeOfDeath, newDependent);
    }

    const selectLocation = async (newLocation: string) => {
        await setLocation(newLocation);
        setGeoUrl(getGeoUrl(newLocation));
        await getData(newLocation, year, causeOfDeath, dependentVariable);
    }

    const selectYear = async (newYear: string) => {
        await setYear(newYear);
        await getData(location, newYear, causeOfDeath, dependentVariable);
    }

    const selectCauseOfDeath = async (newCause: string) => {
        await setCauseOfDeath(newCause);
        await getData(location, year, newCause, dependentVariable);
    }

    const getColorScale = (range: number) => {
        let colorScale = scaleQuantile()
            .domain(
                _.uniq(Object.keys(data).map((key: string) => data[key]))
            )
            .range(Array.from(Array(range).keys()));
        return colorScale;
    }

    const validateCoordinates = (coordinates: Point) => {
        // ew < increases, sn ^ increases
        const south = -169;
        const north = -77;
        const east = 40;
        const west = 46;

        if (coordinates[0] < south) { coordinates[0] = south }
        if (coordinates[0] > north) { coordinates[0] = north }
        if (coordinates[1] < east) { coordinates[1] = east }
        if (coordinates[1] > west) { coordinates[1] = west }
        return coordinates;
    }

    async function handleZoomAsync(zoom: number) {
        let coordinates = validateCoordinates(position.coordinates);
        setPosition({ ...position, coordinates });

        // sleep is because graph errors if state is set with zoom and coordinates at the same time,
        // even if coordinates are valid

        await sleep(100);
        setPosition(pos => ({ ...pos, zoom }));
    }

    // modified from https://codesandbox.io/s/zoom-controls-iwo3f?from-embed=&file=/src/MapChart.js:1160-1927

    function handleZoomIn() {
        if (position.zoom >= 4) return;
        handleZoomAsync(position.zoom * 1.5);
    }

    function handleZoomOut() {
        if (position.zoom <= 1) return;
        handleZoomAsync(position.zoom / 1.5);
    }

    function handleMoveEnd(position: any) {
        setPosition(position);
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
        quantiles.push('more than ' + Math.floor(parseInt(quantiles[quantiles.length - 1], 10)).toString());
        return quantiles;
    }

    useEffect(() => {
        if (data && Object.keys(data).length < 1 && !loading) {
            getData(location, year, causeOfDeath, dependentVariable);
            load();
        }
        if (loading === false) {
            document.addEventListener("click", handleClickOutside);
        }
        return function cleanup() {
            // remove event listener
            document.removeEventListener("click", handleClickOutside);
        }
    });

    const style = {
        block: {
            display: 'block',
            width: '100%',
            maxHeight: calculateMapHeight(height) + "px",
            maxWidth: calculateMapWidth(height) + "px",
            margin: '.5rem',
        },

    }

    const graph =
        <div className="graph-container">
            <div style={style.block}>

                <Map
                    data={data}
                    position={position}
                    handleMoveEnd={handleMoveEnd}
                    geoUrl={geoUrl}
                    colorScale={colorScale}
                    colorMap={colorMap}
                />

                <Controls
                    handleZoomIn={handleZoomIn}
                    handleZoomOut={handleZoomOut}
                />

            </div>
            <Legend
                colorMap={colorMap}
                colorScaleQuantiles={getRange()}
                label={labels[dependentVariable]}
                title={titles[dependentVariable]}
            />
        </div>

    return (
        <div>
            {!loading ?
                <Fragment>

                    < div className="flex-row dropdown-container">
                        <Dropdown
                            listRef={dependentRef}
                            choices={dependentRange}
                            label="Map Type"
                            setSelected={selectDependent}
                            selected={dependentVariable}
                            setDropdownOpen={setDropdownOpen}
                            dropdownOpen={dropdownOpen}
                            height={height}
                        />
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
                        <Dropdown
                            listRef={causeOfDeathRef}
                            choices={causesOfDeath}
                            label="Causes of Death" // location
                            setSelected={selectCauseOfDeath}
                            selected={causeOfDeath}
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
// https://docs.google.com/spreadsheets/d/1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE/edit#gid=0
// download:
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
// https://data.census.gov/cedsci/table?q=race&tid=ACSDT1Y2018.B02001&vintage=2018&hidePreview=true&g=0100000US.050000,.04000.001
// api
// https://data.census.gov/api/access/data/table?g=0100000US.04000.001&id=ACSDT1Y2018.B02001

// counties - black
// https://data.census.gov/api/access/data/table?t=Black%20or%20African%20American&g=0100000US.050000&y=2018&id=ACSDT1Y2018.B01001B