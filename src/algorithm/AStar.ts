import { mapPoint, edge, edgeMap, pointMap } from "./typing";
import * as fs from "fs";

class PriorityQuene {
    list: { point: mapPoint; priority: number }[] = [];
    push(point: mapPoint, priority: number) {
        var flag = true;
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].priority > priority) {
                flag = false;
                this.list.splice(i, 0, {
                    point: point,
                    priority: priority,
                });
                break;
            }
        }
        if (flag == true) {
            this.list.splice(this.list.length, 0, {
                point: point,
                priority: priority,
            });
        }
    }
    pop() {
        const tmp = this.list[0];
        this.list.splice(0, 1);
        return tmp;
    }
    empty() {
        return this.list.length == 0;
    }
}



/**
 * @param {edgeMap} myEdgeMap - edge map
 * @param {pointMap} myPointMap - point map
 * @param {mapPoint} startPoint - start point
 * @param {mapPoint} endPoint - end point
 * @param {number} timeOrDis - end point
 * @return {[number, string[], string[]]} [cost, points list, paths list]
 */
 export function AStar(
    myEdgeMap: edgeMap,
    myPointMap: pointMap,
    startPoint: mapPoint,
    endPoint: mapPoint,
    /**distance: 0, time:1 */
    timeOrDis: number
): [number, string[], string[]] {
    const frontier = new PriorityQuene();
    frontier.push(startPoint, 0);
    const came_from = {};
    const cost_so_far = {};
    came_from[startPoint.id] = null;
    cost_so_far[startPoint.id] = 0;

    while (!frontier.empty()) {
        const current = frontier.pop().point;
        if (current == endPoint) {
            break;
        }

        for (const next of current.neighborWalk) {
            const new_cost =
                cost_so_far[current.id] +
                myEdgeMap[next.edgeId].length +
                myEdgeMap[next.edgeId].length *
                myEdgeMap[next.edgeId].congestionDegree *
                0.01 *
                timeOrDis;
            if (
                typeof cost_so_far[next.toPointId] == "undefined" ||
                new_cost < cost_so_far[next.toPointId]
            ) {
                cost_so_far[next.toPointId] = new_cost;
                const priority =
                    new_cost +
                    Math.abs(endPoint.x - myPointMap[next.toPointId].x) +
                    Math.abs(endPoint.y - myPointMap[next.toPointId].y);
                frontier.push(myPointMap[next.toPointId], priority);
                came_from[next.toPointId] = {
                    point: current,
                    edge: next.edgeId,
                };
            }
        }
    }
    const points: string[] = [];
    const path: string[] = [];
    var current = myPointMap[endPoint.id].id;
    while (came_from[current] != null) {
        points.splice(0, 0, current);
        path.splice(
            0,
            0,
            came_from[current].edge != null ? came_from[current].edge : ""
        );
        current = came_from[current].point.id;
    }
    points.splice(0, 0, current);
    return [cost_so_far[myPointMap[endPoint.id].id], points, path];
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

// const [a, b, c] = AStar(
//     myEdgeMap,
//     myPointMap,
//     pointList[startPointNum],
//     pointList[endPointNum],
//     0
// );

// console.log(a);
// console.log(b);
// console.log(c);