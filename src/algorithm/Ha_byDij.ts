/* eslint-disable max-params */
import { bus } from '@/bus'
import { mapPoint, edgeMap, pointMap } from '../typings/map'
import { dijkstra } from './Dij_Ha'
/**
 * @param {edgeMap} myEdgeMap - edge map
 * @param {pointMap} myPointMap - point map
 * @param {mapPoint} startPoint - start point
 * @param {mapPoint} endPoint - end point
 * @param {number} timeOrDis - distance: 0, time:1
 * @param {number} bike - is bike?
 * @return {[number, string[], string[], number[]]} [cost, points list, paths list, paths time list]
 *
 * 注：不能有重复
 */
export function Ha({
    myEdgeMap,
    myPointMap,
    startPoint,
    wayPointList,
    endPoint,
    timeOrDis,
    bike,
}: {
    myEdgeMap: edgeMap
    myPointMap: pointMap
    startPoint: mapPoint
    endPoint: mapPoint
    wayPointList: mapPoint[]
    /** distance: 0, time:1 */
    timeOrDis: number
    bike: number
}): [number, string[], string[], number[]] {
    wayPointList.sort((a, b) =>
        Math.abs(a.position.lat - startPoint.position.lat) + Math.abs(a.position.lng - startPoint.position.lng) >
        Math.abs(b.position.lat - startPoint.position.lat) + Math.abs(b.position.lng - startPoint.position.lng)
            ? -1
            : 1,
    )
    const totalList = getC(wayPointList)
    let minCost = Infinity
    let minRawCost = Infinity
    let minPoints: string[] = []
    let minPath: string[] = []
    const minPathTime: number[] = []
    const memory: Record<string, Record<string, [number, string[], string[], number]>> = {}
    for (const onelist of totalList) {
        let cost = 0
        let rawCost = 0
        let Points: string[] = []
        let Path: string[] = []
        let good = true
        onelist.splice(0, 0, startPoint)
        onelist.splice(onelist.length, 0, endPoint)
        for (let i = 1; i < onelist.length; i++) {
            let tmpPoints: string[] = []
            let tmpPath: string[] = []
            let tmpCost: number = 0
            let tmpRawCost: number = 0
            if (memory[onelist[i - 1].id] === undefined) {
                memory[onelist[i - 1].id] = {}
            }
            if (memory[onelist[i - 1].id][onelist[i].id] === undefined) {
                const answer = dijkstra(myEdgeMap, myPointMap, onelist[i - 1], onelist[i], timeOrDis, bike)
                for (const idCur in answer[0]) {
                    if (answer[0].hasOwnProperty(idCur)) {
                        memory[onelist[i - 1].id][idCur] = [
                            answer[0][idCur],
                            answer[1][idCur],
                            answer[2][idCur],
                            answer[3][idCur],
                        ]
                    }
                }
            }
            ;[tmpCost, tmpPoints, tmpPath, tmpRawCost] = JSON.parse(
                JSON.stringify(memory[onelist[i - 1].id][onelist[i].id]),
            )
            if (tmpCost + cost >= minCost) {
                good = false
                break
            } else {
                cost += tmpCost
                rawCost += tmpRawCost
                tmpPoints.splice(0, 1)
                Points = Points.concat(tmpPoints)
                Path = Path.concat(tmpPath)
            }
        }
        if (good) {
            minCost = cost
            minPath = Path.concat()
            minPoints = Points.concat()
            minRawCost = rawCost
        }
    }
    minPoints.splice(0, 0, startPoint.id)
    for (const pathItem of minPath) {
        if (myEdgeMap[pathItem].type === 1) {
            minPathTime.push((myEdgeMap[pathItem].length * (1 + myEdgeMap[pathItem].congestionDegree)) / bus.speed.walk)
        } else if (myEdgeMap[pathItem].type === 2) {
            minPathTime.push((myEdgeMap[pathItem].length * (1 + myEdgeMap[pathItem].congestionDegree)) / bus.speed.bike)
        } else {
            minPathTime.push((myEdgeMap[pathItem].length * (1 + myEdgeMap[pathItem].congestionDegree)) / bus.speed.bus)
        }
    }
    console.log(minPathTime)
    return [minRawCost, minPoints, minPath, minPathTime]
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
