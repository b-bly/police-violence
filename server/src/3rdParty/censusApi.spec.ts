import 'mocha'
import { expect } from 'chai'
import { getCensusRaceDataByCounty, getCensusRaceDataByState } from './censusApi'
// import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// dotenv.config();

describe('getCensusBlackDataByCounty', () => {
    let data: string[][]
    before(async () => {
        data = await getCensusRaceDataByCounty()
    })
    it('Should return data', async () => {
        expect(data.length).to.be.greaterThan(1)
    })

    it('Should return data in the format   [ "P1_003N", "P1_004N", "state", "county" ]', () => {
        expect(data[0][0]).to.equal('P1_003N')
        expect(data[0][1]).to.equal('P1_004N')
        expect(data[0][2]).to.equal('state')
        expect(data[0][3]).to.equal('county')
    })
})

describe('getCensusRaceDataByState', () => {
    let data: string[][]
    before(async () => {
        data = await getCensusRaceDataByState()
    })
    it('Should return data', async () => {
        expect(data.length).to.be.greaterThan(1)
    })

    it('Should return data in the format   [ "P1_003N", "P1_004N", "state", "county" ]', () => {
        expect(data[0][0]).to.equal('P1_003N')
        expect(data[0][1]).to.equal('P1_004N')
        expect(data[0][2]).to.equal('state')
    })
})
