import {
    getCensusRaceDataByCounty,
    getCensusRaceDataByState,
} from '../3rdParty/censusApi'
import { IRaceGeo, GeoType } from '../models'

export class CensusService {
    censusCountyData: any[]
    censusStateData: any[]

    async init(cb?: () => void) {
        if (!this.censusCountyData) {
            const data: string[][] = await getCensusRaceDataByCounty()
            this.censusCountyData = CensusService.formatCountyData(data, GeoType.county)
        }
        if (!this.censusStateData) {
            const data: string[][] = await getCensusRaceDataByState()
            this.censusStateData = CensusService.formatStateData(data, GeoType.state)
        }
        if (cb) {
            cb.bind(this)()
        }
    }

    static formatStateData(data: string[][], geoType: GeoType) {
        const headers = data[0]
        // black only pop P1_004N
        // white only pop P1_003N

        const blackIndex = headers.indexOf('P1_004N')
        const whiteIndex = headers.indexOf('P1_003N')

        return data
            .slice(1)
            .map<IRaceGeo>((record: any, i) => {
                const geoId: string = record[2]
                const numberOfBlacks =
                    parseInt(record[blackIndex], 10) === null
                        ? 0
                        : parseInt(record[blackIndex], 10)
                const numberOfWhites =
                    parseInt(record[whiteIndex], 10) === null
                        ? 0
                        : parseInt(record[whiteIndex], 10)
                const raceGeo: IRaceGeo = {
                    geoType,
                    numberOfBlacks,
                    numberOfWhites,
                    geoId,
                }
                return raceGeo
            })
            .filter((record: IRaceGeo) => Object.keys(record).length !== 0)
    }

    static formatCountyData = (data: any[], geoType: GeoType) => {
        const headers = data[0]
        // black only pop P1_004N
        // white only pop P1_003N

        const blackIndex = headers.indexOf('P1_004N')
        const whiteIndex = headers.indexOf('P1_003N')

        return data
            .slice(1)
            .map<IRaceGeo>((record: any, i) => {
                // geoId = fips = state [25] + county [15]
                const geoId: string = record[2] + record[3]
                if (
                    record[blackIndex] !== null &&
                    record[whiteIndex] !== null
                ) {
                    const numberOfBlacks = parseInt(record[blackIndex], 10)
                    const numberOfWhites = parseInt(record[whiteIndex], 10)
                    const raceGeo: IRaceGeo = {
                        geoType,
                        numberOfBlacks,
                        numberOfWhites,
                        geoId,
                    }
                    return raceGeo
                }
                const empty: any = {}
                return empty
            })
            .filter((record: IRaceGeo) => Object.keys(record).length !== 0)
    }
}

export default new CensusService()
