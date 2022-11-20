import 'mocha'
import { it } from 'mocha'
import { expect } from 'chai'
import { getFatalEncountersData } from './fatalGoogleSheet'

it('has the correct headings', async () => {
    return await getFatalEncountersData().then((data) => {
        ;[
            'Location of death (county)',
            'State',
            'Date of injury resulting in death (month/day/year)',
            'Race',
        ].forEach((property) => {
            expect(data[1]).to.have.property(property)
        })
    })
}).timeout(10000)
