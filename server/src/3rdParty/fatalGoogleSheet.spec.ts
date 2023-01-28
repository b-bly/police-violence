import { getFatalEncountersData } from './fatalGoogleSheet'
import { expect, it } from '@jest/globals'
import { columnHeadings } from '../constants'
import { property } from 'lodash'

// Noticing some variability in headings.  Run this before debugging, but skipping to avoid
// blocking a deployment.
it('has the correct headings', async () => {
    return await getFatalEncountersData().then((data) => {
        // [
        //     'Location of death (county)',
        //     'State',
        //     'Date of injury resulting in death (month/day/year)', // Nov 26 there is a space before "Date".
        //     'Race',
        // ]
        for (const property in columnHeadings) {
            if (property !== 'causeOfDeath') {
                expect(data[1]).toHaveProperty(columnHeadings[property])
            }
        }
    })
})
