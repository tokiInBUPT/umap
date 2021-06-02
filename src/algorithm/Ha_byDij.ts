/* eslint-disable max-params */
import { mapPoint, edgeMap, pointMap } from '../typings/map'
import { dijkstra } from './Dij_Ha'
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
    /** distance: 0, time:1 */
    timeOrDis: number,
): [number, string[], string[]] {
    wayPointList.sort((a, b) =>
        Math.abs(a.position.lat - startPoint.position.lat) + Math.abs(a.position.lng - startPoint.position.lng) >
        Math.abs(b.position.lat - startPoint.position.lat) + Math.abs(b.position.lng - startPoint.position.lng)
            ? -1
            : 1,
    )
    const totalList = getC(wayPointList)
    let minCost = Infinity
    let minPoints: string[] = []
    let minPath: string[] = []
    const memory: Record<string, Record<string, [number, string[], string[]]>> = {}
    for (const onelist of totalList) {
        let cost = 0
        let Points: string[] = []
        let Path: string[] = []
        let good = true
        onelist.splice(0, 0, startPoint)
        onelist.splice(onelist.length, 0, endPoint)
        for (let i = 1; i < onelist.length; i++) {
            let tmpPoints: string[] = []
            let tmpPath: string[] = []
            let tmpCost: number = 0
            if (memory[onelist[i - 1].id] === undefined) {
                memory[onelist[i - 1].id] = {}
            }
            if (memory[onelist[i - 1].id][onelist[i].id] === undefined) {
                const answer = dijkstra(myEdgeMap, myPointMap, onelist[i - 1], onelist[i], timeOrDis)
                for (const idCur in answer[0]) {
                    if (answer[0].hasOwnProperty(idCur)) {
                        memory[onelist[i - 1].id][idCur] = [answer[0][idCur], answer[1][idCur], answer[2][idCur]]
                    }
                }
            }
            ;[tmpCost, tmpPoints, tmpPath] = JSON.parse(JSON.stringify(memory[onelist[i - 1].id][onelist[i].id]))
            if (tmpCost + cost >= minCost) {
                good = false
                break
            } else {
                cost += tmpCost
                tmpPoints.splice(0, 1)
                Points = Points.concat(tmpPoints)
                Path = Path.concat(tmpPath)
            }
        }
        if (good) {
            minCost = cost
            minPath = Path.concat()
            minPoints = Points.concat()
        }
    }
    minPoints.splice(0, 0, startPoint.id)
    return [minCost, minPoints, minPath]
}

function getC(list: mapPoint[]) {
    let answer: mapPoint[][] = []
    if (list.length > 1) {
        for (const i of list) {
            const tmpList = list.concat()
            tmpList.splice(list.indexOf(i), 1)
            const answerLists = getC(tmpList)
            for (const answerList of answerLists) {
                answerList.splice(answerList.length, 0, i)
                answer.splice(answer.length, 0, answerList)
            }
        }
    } else {
        answer = [[list[0]]]
    }
    return answer
}
