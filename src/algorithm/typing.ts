export interface mapPoint {
    id: string;
    name: string;
    x: number;
    y: number;
    neighborWalk: neighbor[];
    neighborBike: neighbor[];
    logicPositionList: logicPosition[];
}

export interface neighbor {
    toPointId: string;
    edgeId: string;
}

export interface edge {
    id: string;
    length: number;
    /** range: 0-100 */
    congestionDegree: number;
}

export interface bus {
    id: string;
    time: number;
    timeTable: timeTableItem;
}

export interface schoolBus {
    id: string;
    time: number;
    timeTable: timeTableItem;
}

export interface timeTableItem {
    h: number;
    m: number;
    s: number;
}

export interface logicPosition {
    pointId: string;
    id: string;
    name: string;
    discription: string;
}

export type pointMap = Record<string, mapPoint>;
export type edgeMap = Record<string, edge>;
