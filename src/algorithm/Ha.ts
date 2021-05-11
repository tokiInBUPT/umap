import { mapPoint, edge, edgeMap, pointMap } from "./typing";
import { dijkstra } from "./Dij";
import { AStar } from "./AStar";
import * as fs from "fs";
/**
 * @param {edgeMap} myEdgeMap - edge map
 * @param {pointMap} myPointMap - point map
 * @param {mapPoint} startPoint - start point
 * @param {mapPoint} endPoint - end point
 * @param {number} timeOrDis - end point
 * @return {[number, string[], string[]]} [cost, points list, paths list]
 *
 * 注：不能有重复
 */
export function Ha(
    myEdgeMap: edgeMap,
    myPointMap: pointMap,
    startPoint: mapPoint,
    endPoint: mapPoint,
    wayPointList: mapPoint[],
    /**distance: 0, time:1 */
    timeOrDis: number
): [number, string[], string[]] {
    wayPointList.sort((a, b) => Math.abs(a.x - startPoint.x) + Math.abs(a.y - startPoint.y) > Math.abs(b.x - startPoint.x) + Math.abs(b.y - startPoint.y) ? -1 : 1);
    var totalList = getC(wayPointList);
    var minCost = Infinity;
    var minPoints: string[] = [];
    var minPath: string[] = [];
    const memory: Record<
        string,
        Record<string, [number, string[], string[]]>
    > = {};
    for (let onelist of totalList) {
        var cost = 0;
        var Points: string[] = [];
        var Path: string[] = [];
        var good = true;
        onelist.splice(0, 0, startPoint);
        onelist.splice(onelist.length, 0, endPoint);
        for (var i = 1; i < onelist.length; i++) {
            var tmpPoints: string[] = [];
            var tmpPath: string[] = [];
            var tmpCost: number;
            if (memory[onelist[i - 1].id] == undefined) {
                memory[onelist[i - 1].id] = {};
            }
            if (memory[onelist[i - 1].id][onelist[i].id] == undefined) {
                memory[onelist[i - 1].id][onelist[i].id] = AStar(
                    myEdgeMap,
                    myPointMap,
                    onelist[i - 1],
                    onelist[i],
                    timeOrDis
                );
            }
            [tmpCost, tmpPoints, tmpPath] = JSON.parse(
                JSON.stringify(memory[onelist[i - 1].id][onelist[i].id])
            );
            if (tmpCost + cost >= minCost) {
                good = false;
                break;
            } else {
                cost += tmpCost;
                tmpPoints.splice(0, 1);
                Points = Points.concat(tmpPoints);
                Path = Path.concat(tmpPath);
            }
        }
        if (good) {
            minCost = cost;
            minPath = Path.concat();
            minPoints = Points.concat();
        }
    }
    minPoints.splice(0, 0, startPoint.id);
    return [minCost, minPoints, minPath];
}

function getC(list: mapPoint[]) {
    var answer: mapPoint[][] = [];
    if (list.length > 1) {
        for (let i of list) {
            var tmpList = list.concat();
            tmpList.splice(list.indexOf(i), 1);
            var answerLists = getC(tmpList);
            for (let answerList of answerLists) {
                answerList.splice(answerList.length, 0, i);
                answer.splice(answer.length, 0, answerList);
            }
        }
    } else {
        answer = [[list[0]]];
    }
    return answer;
}

const startPointNum: number = 0;
const endPointNum: number = 9;

const edgeList = JSON.parse(fs.readFileSync("edgeList.json").toString());
const pointList = JSON.parse(fs.readFileSync("pointList.json").toString());
const myEdgeMap: edgeMap = {};
for (let i of edgeList) {
    myEdgeMap[i.id] = i;
}
const myPointMap: pointMap = {};
for (let i of pointList) {
    myPointMap[i.id] = i;
}

console.time("Ha");
const [a, b, c] = Ha(
    myEdgeMap,
    myPointMap,
    pointList[startPointNum],
    pointList[endPointNum],
    [
        pointList[1],
        pointList[2],
        pointList[3],
        pointList[4],
        pointList[5],
        pointList[6],
        pointList[7],
        pointList[8],
        // pointList[10],
    ],
    0
);
console.timeEnd("Ha");

console.log(a);
console.log(b);
console.log(c);
