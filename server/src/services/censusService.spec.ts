import { CensusService } from './censusService'
import { describe, expect, it, beforeAll } from '@jest/globals'
import { GeoType, IRaceGeo } from '../models'

const stateData = [
    ['P1_004N', 'P1_003N', 'state'],
    ['11445', '432', '01'],
    ['18217', '4352', '01'],
    ['11933', '4354', '01'],
]

const countyData = [
    ['P1_003N', 'P1_004N', 'state', 'county'],
    ['42160', '11445', '01', '001'],
    ['189399', '18217', '01', '003'],
]

let result: IRaceGeo[]

describe('CensusService', () => {
    describe('State data', () => {
        beforeAll(() => {
            result = CensusService.formatStateData(stateData, GeoType.state)
        })
        it('Formats data', () => {

            expect(result[0]).toHaveProperty('geoType')
            expect(result[0]).toHaveProperty('numberOfBlacks')
            expect(result[0]).toHaveProperty('numberOfWhites')
            expect(result[0]).toHaveProperty('geoId')
        })

        it('Has correct type', () => {
            expect(typeof result[0].geoType).toBe('number')
            expect(typeof result[0].numberOfBlacks).toBe('number')
            expect(typeof result[0].numberOfWhites).toBe('number')
            expect(typeof result[0].geoId).toBe('string')
        })

        it('Returns the correct number of records', () => {
            expect(result.length).toEqual(3)
        })
    })

    describe('County data', () => {
        beforeAll(() => {
            result = CensusService.formatCountyData(countyData, GeoType.county)
        })
        it('Formats data', () => {
            expect(result[0]).toHaveProperty('geoType')
            expect(result[0]).toHaveProperty('numberOfBlacks')
            expect(result[0]).toHaveProperty('numberOfWhites')
            expect(result[0]).toHaveProperty('geoId')
        })

        it('Has correct type', () => {
            expect(typeof result[0].geoType).toBe('number')
            expect(typeof result[0].numberOfBlacks).toBe('number')
            expect(typeof result[0].numberOfWhites).toBe('number')
            expect(typeof result[0].geoId).toBe('string')
        })

        it('Returns the correct number of records', () => {
            expect(result.length).toEqual(2)
        })
    })
})
