/* eslint-disable max-params */
import { mapPoint, edgeMap, pointMap } from '../typings/map'

/**
 * @param {edgeMap} myEdgeMap - edge map
 * @param {pointMap} myPointMap - point map
 * @param {mapPoint} startPoint - start point
 * @param {mapPoint} endPoint - end point
 * @param {number} timeOrDis - end point
 * @return [cost, points list, paths list]
 */
export function dijkstra(
    myEdgeMap: edgeMap,
    myPointMap: pointMap,
    startPoint: mapPoint,
    endPoint: mapPoint,
    /** distance: 0, time:1 */
    timeOrDis: number,
): [Record<string, number>, Record<string, string[]>, Record<string, string[]>] {
    /** 从key点到起始点的距离 */
    const distance: Record<string, number> = {}
    const used: Record<string, boolean> = {}
    const prev: Record<string, null | { point: mapPoint; edge: string }> = {}
    for (const point in myPointMap) {
        if (myPointMap.hasOwnProperty(point)) {
            distance[myPointMap[point].id] = -1
            used[myPointMap[point].id] = false
        }
    }
    distance[startPoint.id] = 0
    used[startPoint.id] = true
    prev[startPoint.id] = null
    for (const next of startPoint.neighborWalk) {
        distance[next.toPointId] =
            distance[startPoint.id] +
            myEdgeMap[next.edgeId].length * (1 + 0.01 * myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
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
        for (const next of myPointMap[minNum].neighborWalk) {
            if (distance[next.toPointId] === -1) {
                distance[next.toPointId] =
                    distance[minNum] +
                    myEdgeMap[next.edgeId].length * (1 + 0.01 * myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
                prev[next.toPointId] = {
                    point: myPointMap[minNum],
                    edge: next.edgeId,
                }
            } else if (
                distance[next.toPointId] >
                distance[minNum] +
                    myEdgeMap[next.edgeId].length * (1 + 0.01 * myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
            ) {
                distance[next.toPointId] =
                    distance[minNum] +
                    myEdgeMap[next.edgeId].length * (1 + 0.01 * myEdgeMap[next.edgeId].congestionDegree * timeOrDis)
                prev[next.toPointId] = {
                    point: myPointMap[minNum],
                    edge: next.edgeId,
                }
            }
        }
    }
    const points: Record<string, string[]> = {}
    const path: Record<string, string[]> = {}
    for (const idCur in distance) {
        if (distance.hasOwnProperty(idCur)) {
            let current = idCur
            points[idCur] = []
            path[idCur] = []
            let e
            while ((e = prev[current]) !== null) {
                points[idCur].splice(0, 0, current)
                path[idCur].splice(0, 0, e.edge ? e.edge : '')
                current = e.point.id
            }
            points[idCur].splice(0, 0, current)
        }
    }
    return [distance, points, path]
}
