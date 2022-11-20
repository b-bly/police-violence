const nodeFetch = require('node-fetch')

import { CENSUS_KEY } from '../config'

// black only pop P1_004N
// white only pop P1_003N
const BLACK_BY_STATE_URL = `https://api.census.gov/data/2020/dec/pl?get=P1_004N&for=state:*&key=${CENSUS_KEY}`
const BLACK_BY_COUNTY_URL = `https://api.census.gov/data/2020/dec/pl?get=P1_004N&for=county:*&key=${CENSUS_KEY}&in=state:*`
const WHITE_BY_COUNTY_URL = `https://api.census.gov/data/2020/dec/pl?get=P1_003N&for=county:*&key=${CENSUS_KEY}&in=state:*`
const WHITE_BY_STATE_URL = `https://api.census.gov/data/2020/dec/pl?get=P1_003N&for=state:*&key=${CENSUS_KEY}`
const WHITE_AND_BLACK_BY_COUNTY_URL = `https://api.census.gov/data/2020/dec/pl?get=P1_003N,P1_004N&for=county:*&key=${CENSUS_KEY}&in=state:*`
const WHITE_AND_BLACK_BY_STATE_URL = `https://api.census.gov/data/2020/dec/pl?get=P1_003N,P1_004N&for=state:*&key=${CENSUS_KEY}`

export const getCensusBlackDataByCounty = async (): Promise<string[][]> => {
    const censusResponse = await nodeFetch(BLACK_BY_COUNTY_URL)
    const json = await censusResponse.json()
    return json
}

export const getCensusBlackDataByState = async (): Promise<string[][]> => {
    const censusResponse = await nodeFetch(BLACK_BY_STATE_URL)
    const json = await censusResponse.json()
    return json
}

export const getCensusWhiteDataByCounty = async (): Promise<string[][]> => {
    const censusResponse = await nodeFetch(WHITE_BY_COUNTY_URL)
    const json = await censusResponse.json()
    return json
}

export const getCensusWhiteDataByState = async (): Promise<string[][]> => {
    const censusResponse = await nodeFetch(WHITE_BY_STATE_URL)
    const json = await censusResponse.json()
    return json
}

export const getCensusRaceDataByCounty = async (): Promise<string[][]> => {
    const censusResponse = await nodeFetch(WHITE_AND_BLACK_BY_COUNTY_URL)
    const json = await censusResponse.json()
    return json
}

export const getCensusRaceDataByState = async (): Promise<string[][]> => {
    const censusResponse = await nodeFetch(WHITE_AND_BLACK_BY_STATE_URL)
    const json = await censusResponse.json()
    return json
}
