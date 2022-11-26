import { getFatalEncountersData } from './fatalGoogleSheet'
import { expect, it } from '@jest/globals'

// Noticing some variability in headings.  Run this before debugging, but skipping to avoid
// blocking a deployment.
it.skip('has the correct headings', async () => {
    return await getFatalEncountersData().then((data) => {
        ;[
            'Location of death (county)',
            'State',
            // 'Date of injury resulting in death (month/day/year)', // Nov 26 there is a space before "Date".
            'Race',
        ].forEach((property) => {
            expect(data[1]).toHaveProperty(property)
        })
    })
})
