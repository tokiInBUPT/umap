/* eslint-disable max-params */
import { mapPoint, edgeMap, pointMap } from '../typings/map'

/**
 * @param {edgeMap} myEdgeMap - edge map
 * @param {pointMap} myPointMap - point map
 * @param {mapPoint} startPoint - start point
 * @param {mapPoint} endPoint - end point
 * @param {number} timeOrDis - end point
 * @return {[number, string[], string[]]} [cost, points list, paths list]
 */
export function dijkstra(
    myEdgeMap: edgeMap,
    myPointMap: pointMap,
    startPoint: mapPoint,
    endPoint: mapPoint,
    /** distance: 0, time:1 */
    timeOrDis: number,
): [number, string[], string[]] {
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
    const points: string[] = []
    const path: string[] = []
    let current = myPointMap[endPoint.id].id
    let e
    while ((e = prev[current]) !== null) {
        points.splice(0, 0, current)
        path.splice(0, 0, e.edge !== null ? e.edge : '')
        current = e.point.id
    }
    points.splice(0, 0, current)
    return [distance[myPointMap[endPoint.id].id], points, path]
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
