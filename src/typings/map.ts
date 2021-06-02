export interface neighbor {
    toPointId: string
    edgeId: string
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

export interface edge {
    id: string
    length: number
    /** range: 0-100 */
    congestionDegree: number
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

export type pointMap = Record<string, mapPoint>
export type edgeMap = Record<string, edge>
