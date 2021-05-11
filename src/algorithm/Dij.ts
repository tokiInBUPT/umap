import { mapPoint, edge, edgeMap, pointMap } from "./typing";
import * as fs from "fs";


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
    /**distance: 0, time:1 */
    timeOrDis: number
): [number, string[], string[]] {
    /**从key点到起始点的距离 */
    const distance = {};
    const used = {};
    const prev = {};
    for (let point in myPointMap) {
        distance[myPointMap[point].id] = -1;
        used[myPointMap[point].id] = false;
    }
    distance[startPoint.id] = 0;
    used[startPoint.id] = true;
    prev[startPoint.id] = null;
    for (let next of startPoint.neighborWalk) {
        distance[next.toPointId] =
            distance[startPoint.id] + myEdgeMap[next.edgeId].length * (1 + 0.01*myEdgeMap[next.edgeId].congestionDegree*timeOrDis) ;
        prev[next.toPointId] = {
            point: startPoint,
            edge: next.edgeId,
        };
    }
    for (let i = 1; i < Object.keys(myPointMap).length; i++) {
        var minNum = "";
        var min = Infinity;
        for (let j in distance) {
            if (distance[j] != -1 && distance[j] < min && used[j] == false) {
                minNum = j;
                min = distance[j];
            }
        }
        used[minNum] = true;
        for (let next of myPointMap[minNum].neighborWalk) {
            if (distance[next.toPointId] == -1) {
                distance[next.toPointId] =
                    distance[minNum] + myEdgeMap[next.edgeId].length * (1 + 0.01*myEdgeMap[next.edgeId].congestionDegree*timeOrDis);
                    prev[next.toPointId] = {
                        point: myPointMap[minNum],
                        edge: next.edgeId,
                    };
            } else if (
                distance[next.toPointId] >
                distance[minNum] + myEdgeMap[next.edgeId].length * (1 + 0.01*myEdgeMap[next.edgeId].congestionDegree*timeOrDis)
            ) {
                distance[next.toPointId] =
                    distance[minNum] + myEdgeMap[next.edgeId].length * (1 + 0.01*myEdgeMap[next.edgeId].congestionDegree*timeOrDis);
                prev[next.toPointId] = {
                    point: myPointMap[minNum],
                    edge: next.edgeId,
                };
            }
        }
    }
    const points: string[] = [];
    const path: string[] = [];
    var current = myPointMap[endPoint.id].id;
    while (prev[current] != null) {
        points.splice(0, 0, current);
        path.splice(
            0,
            0,
            prev[current].edge != null ? prev[current].edge: ""
        );
        current = prev[current].point.id;
    }
    points.splice(0, 0, current);
    return [distance[myPointMap[endPoint.id].id], points, path];
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
