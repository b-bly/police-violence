import { describe, expect, it, beforeEach } from '@jest/globals'
import {
    getCensusRaceDataByCounty,
    getCensusRaceDataByState,
} from './censusApi'
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

describe('getCensusBlackDataByCounty', () => {
    let data: string[][]
    beforeEach(async () => {
        data = await getCensusRaceDataByCounty()
    })
    it('Should return data', async () => {
        expect(data.length).toBeGreaterThan(1)
    })

    it('Should return data in the format   [ "P1_003N", "P1_004N", "state", "county" ]', () => {
        expect(data[0][0]).toEqual('P1_003N')
        expect(data[0][1]).toEqual('P1_004N')
        expect(data[0][2]).toEqual('state')
        expect(data[0][3]).toEqual('county')
    })
})

describe('getCensusRaceDataByState', () => {
    let data: string[][]
    beforeEach(async () => {
        data = await getCensusRaceDataByState()
    })
    it('Should return data', async () => {
        expect(data.length).toBeGreaterThan(1)
    })

    it('Should return data in the format   [ "P1_003N", "P1_004N", "state", "county" ]', () => {
        expect(data[0][0]).toEqual('P1_003N')
        expect(data[0][1]).toEqual('P1_004N')
        expect(data[0][2]).toEqual('state')
    })
})
