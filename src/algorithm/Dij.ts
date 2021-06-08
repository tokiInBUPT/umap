/* eslint-disable complexity */
/* eslint-disable max-params */
import { mapPoint, edgeMap, pointMap, neighbor } from '../typings/map'
import { speed } from '../config'

/**
 * @param {edgeMap} myEdgeMap - edge map
 * @param {pointMap} myPointMap - point map
 * @param {mapPoint} startPoint - start point
 * @param {mapPoint} endPoint - end point
 * @param {number} timeOrDis - distance: 0, time:1
 * @param {number} bike - is bike?
 * @return {[number, string[], string[], number[]]} [cost, points list, paths list, paths time list]
 */
export function dijkstra({
    myEdgeMap,
    myPointMap,
    startPoint,
    endPoint,
    timeOrDis,
    bike,
}: {
    myEdgeMap: edgeMap
    myPointMap: pointMap
    startPoint: mapPoint
    endPoint: mapPoint
    /** distance: 0, time:1 */
    timeOrDis: number
    bike: number
}): [number, string[], string[], number[]] {
    /** 从key点到起始点的距离 */
    const distance: Record<string, number> = {}
    const rawDistance: Record<string, number> = {}
    const used: Record<string, boolean> = {}
    const prev: Record<string, null | { point: mapPoint; edge: string }> = {}
    for (const point in myPointMap) {
        if (myPointMap.hasOwnProperty(point)) {
            distance[myPointMap[point].id] = -1
            rawDistance[myPointMap[point].id] = -1
            used[myPointMap[point].id] = false
        }
    }
    distance[startPoint.id] = 0
    rawDistance[startPoint.id] = 0
    used[startPoint.id] = true
    prev[startPoint.id] = null
    const tempNeighbor: neighbor[] = JSON.parse(JSON.stringify(startPoint.neighborWalk))
    if (bike) {
        for (const bikeItem of startPoint.neighborBike) {
            for (const walkItem of tempNeighbor) {
                if (walkItem.toPointId === bikeItem.toPointId) {
                    walkItem.edgeId = bikeItem.edgeId
                    break
                }
            }
        }
    }
    for (const next of tempNeighbor) {
        if (myEdgeMap[next.edgeId] === undefined) {
            console.log(myEdgeMap)
            console.log(next.edgeId)
        }
        if (timeOrDis && myEdgeMap[next.edgeId].type === 2) {
            distance[next.toPointId] =
                distance[startPoint.id] +
                ((myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)) /
                    speed.bike) *
                    speed.walk
        } else {
            distance[next.toPointId] =
                distance[startPoint.id] +
                myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
        }
        rawDistance[next.toPointId] = rawDistance[startPoint.id] + myEdgeMap[next.edgeId].length
        prev[next.toPointId] = {
            point: startPoint,
            edge: next.edgeId,
        }
    }
    for (let i = 1; i < Object.keys(myPointMap).length; i++) {
        let minNum = ''
        let min = Infinity
        for (const j in distance) {
            if (distance[j] !== -1 && distance[j] < min && !used[j]) {
                minNum = j
                min = distance[j]
            }
        }
        used[minNum] = true
        const tempNeighbor2: neighbor[] = JSON.parse(JSON.stringify(myPointMap[minNum].neighborWalk))
        if (bike) {
            for (const bikeItem of myPointMap[minNum].neighborBike) {
                for (const walkItem of tempNeighbor2) {
                    if (walkItem.toPointId === bikeItem.toPointId) {
                        walkItem.edgeId = bikeItem.edgeId
                        break
                    }
                }
            }
        }
        for (const next of tempNeighbor2) {
            if (myEdgeMap[next.edgeId] === undefined) {
                console.log(myEdgeMap)
                console.log(next.edgeId)
            }
            if (distance[next.toPointId] === -1) {
                if (timeOrDis && myEdgeMap[next.edgeId].type === 2) {
                    distance[next.toPointId] =
                        distance[minNum] +
                        ((myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)) /
                            speed.bike) *
                            speed.walk
                } else {
                    distance[next.toPointId] =
                        distance[minNum] +
                        myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
                }
                rawDistance[next.toPointId] = rawDistance[minNum] + myEdgeMap[next.edgeId].length
                prev[next.toPointId] = {
                    point: myPointMap[minNum],
                    edge: next.edgeId,
                }
            } else if (
                timeOrDis &&
                myEdgeMap[next.edgeId].type === 2 &&
                distance[next.toPointId] >
                    distance[minNum] +
                        myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
            ) {
                if (timeOrDis && myEdgeMap[next.edgeId].type === 2) {
                    distance[next.toPointId] =
                        distance[minNum] +
                        ((myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)) /
                            speed.bike) *
                            speed.walk
                } else {
                    distance[next.toPointId] =
                        distance[minNum] +
                        myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
                }
                rawDistance[next.toPointId] = rawDistance[minNum] + myEdgeMap[next.edgeId].length
                prev[next.toPointId] = {
                    point: myPointMap[minNum],
                    edge: next.edgeId,
                }
            } else if (
                distance[next.toPointId] >
                distance[minNum] +
                    myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
            ) {
                if (timeOrDis && myEdgeMap[next.edgeId].type === 2) {
                    distance[next.toPointId] =
                        distance[minNum] +
                        ((myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)) /
                            speed.bike) *
                            speed.walk
                } else {
                    distance[next.toPointId] =
                        distance[minNum] +
                        myEdgeMap[next.edgeId].length * (1 + myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
                }
                rawDistance[next.toPointId] = rawDistance[minNum] + myEdgeMap[next.edgeId].length
                prev[next.toPointId] = {
                    point: myPointMap[minNum],
                    edge: next.edgeId,
                }
            }
        }
    }
    const points: string[] = []
    const path: string[] = []
    const pathTime: number[] = []
    let current = myPointMap[endPoint.id].id
    let e
    while ((e = prev[current]) !== null) {
        points.splice(0, 0, current)
        if (myEdgeMap[e.edge].type === 1) {
            pathTime.splice(0, 0, (myEdgeMap[e.edge].length * (1 + myEdgeMap[e.edge].congestionDegree)) / speed.walk)
        } else if (myEdgeMap[e.edge].type === 2) {
            pathTime.splice(0, 0, (myEdgeMap[e.edge].length * (1 + myEdgeMap[e.edge].congestionDegree)) / speed.bike)
        } else {
            pathTime.splice(0, 0, (myEdgeMap[e.edge].length * (1 + myEdgeMap[e.edge].congestionDegree)) / speed.bus)
        }

        path.splice(0, 0, e.edge !== null ? e.edge : '')
        current = e.point.id
    }
    points.splice(0, 0, current)
    return [rawDistance[myPointMap[endPoint.id].id], points, path, pathTime]
}

// const startPointNum: number = 0;
// const endPointNum: number = 9;

// const edgeList = JSON.parse(fs.readFileSync("edgeList.json").toString());
// const pointList = JSON.parse(fs.readFileSync("pointList.json").toString());
// const myEdgeMap: edgeMap = {};
// for (let i of edgeList) {
//     myEdgeMap[i.id] = i;
// }
// const myPointMap: pointMap = {};
// for (let i of pointList) {
//     myPointMap[i.id] = i;
// }

// const [a, b, c] = dijkstra(
//     myEdgeMap,
//     myPointMap,
//     pointList[startPointNum],
//     pointList[endPointNum],
//     0
// );

// console.log(a);
// console.log(b);
// console.log(c);
