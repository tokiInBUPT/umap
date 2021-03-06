export interface neighbor {
    toPointId: string
    edgeId: string
}

export interface logicPosition {
    id: string
    name: string
    points: string[] | undefined
}

export interface mapPoint {
    id: string
    name: string
    position: {
        lat: number
        lng: number
    }
    neighborWalk: neighbor[]
    neighborBike: neighbor[]
}

export enum TRANSPORT {
    WALK = 1,
    BIKE = 2,
    BUS = 3,
}

export interface edge {
    id: string
    length: number
    /** range: 0-1 */
    congestionDegree: number
    /** walk: 1, bike: 2, bus: 3 */
    type: TRANSPORT
    time: number
}

export interface timeTableItem {
    h: number
    m: number
    s: number
}

export interface bus {
    id: string
    time: number
    timeTable: timeTableItem
}

export interface schoolBus {
    id: string
    time: number
    timeTable: timeTableItem
}

export interface logicPosition {
    pointId: string
    id: string
    name: string
    discription: string
}

export enum busType {
    SCHOOLBUS = 1,
    PUBLICBUS = 2,
}

export interface timeListItem {
    time: number
    /** type=1: 班车, type=2: 公交 */
    type: number
}

export type pointMap = Record<string, mapPoint>
export type edgeMap = Record<string, edge>
