import { CensusService } from './censusService'
import 'mocha'
import { expect } from 'chai'
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
        before(() => {
            result = CensusService.formatStateData(stateData, GeoType.state)
        })
        it('Formats data', () => {

            expect(result[0]).to.have.property('geoType')
            expect(result[0]).to.have.property('numberOfBlacks')
            expect(result[0]).to.have.property('numberOfWhites')
            expect(result[0]).to.have.property('geoId')
        })

        it('Has correct type', () => {
            expect(result[0].geoType).to.be.a('number')
            expect(result[0].numberOfBlacks).to.be.a('number')
            expect(result[0].numberOfWhites).to.be.a('number')
            expect(result[0].geoId).to.be.a('string')
        })

        it('Returns the correct number of records', () => {
            expect(result.length).to.equal(3)
        })
    })

    describe('County data', () => {
        before(() => {
            result = CensusService.formatCountyData(countyData, GeoType.county)
        })
        it('Formats data', () => {
            expect(result[0]).to.have.property('geoType')
            expect(result[0]).to.have.property('numberOfBlacks')
            expect(result[0]).to.have.property('numberOfWhites')
            expect(result[0]).to.have.property('geoId')
        })

        it('Has correct type', () => {
            expect(result[0].geoType).to.be.a('number')
            expect(result[0].numberOfBlacks).to.be.a('number')
            expect(result[0].numberOfWhites).to.be.a('number')
            expect(result[0].geoId).to.be.a('string')
        })

        it('Returns the correct number of records', () => {
            expect(result.length).to.equal(2)
        })
    })
})
