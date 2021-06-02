/* eslint-disable max-params */
import { mapPoint, edgeMap, pointMap } from '../typings/map'
import { dijkstra } from './Dij_Ha'
import { dijkstra as dij_raw } from './Dij'

const T0 = 50000.0 // 初始温度
const T_end = 1e-4
const q = 0.9 // 退火系数
const L = 500 // 每个温度时的迭代次数，即链长

function init(wayPointList: mapPoint[], startPoint: mapPoint, endPoint: mapPoint) {
    const firstPath = wayPointList.concat()
    firstPath.splice(0, 0, startPoint)
    firstPath.splice(firstPath.length, 0, endPoint)
    return firstPath
}

function countDis(myEdgeMap: edgeMap, myPointMap: pointMap, timeOrDis: number) {
    const memory: Record<string, Record<string, [number, string[], string[]]>> = {}
    for (const point in myPointMap) {
        if (myPointMap.hasOwnProperty(point)) {
            memory[point] = {}
            const answer = dijkstra(myEdgeMap, myPointMap, myPointMap[point], myPointMap[point], timeOrDis)
            for (const idCur in answer[0]) {
                if (answer[0].hasOwnProperty(idCur)) {
                    memory[point][idCur] = [answer[0][idCur], answer[1][idCur], answer[2][idCur]]
                }
            }
        }
    }
    return memory
}

function path_len(memory: Record<string, Record<string, [number, string[], string[]]>>, pointInPath: mapPoint[]) {
    let distance = 0
    for (let i = 0; i < pointInPath.length - 1; i++) {
        distance += memory[pointInPath[i].id][pointInPath[i + 1].id][0]
    }
    return distance
}

function create_new(cityCount: number, pointInPathRaw: mapPoint[]) {
    const pointInPath = pointInPathRaw.concat()
    if (pointInPathRaw.length < 4) {
        return pointInPath
    }
    const count = pointInPath.length - 1
    let tmp1 = Math.floor(Math.random() * count)
    while (tmp1 === count || tmp1 === 0) {
        tmp1 = Math.floor(Math.random() * count)
    }
    let tmp2 = Math.floor(Math.random() * count)
    while (tmp2 === tmp1 || tmp2 === count || tmp2 === 0) {
        tmp2 = Math.floor(Math.random() * count)
    }
    const tmp = pointInPath[tmp1]
    pointInPath[tmp1] = pointInPath[tmp2]
    pointInPath[tmp2] = tmp
    return pointInPath
}

export function SA(
    myEdgeMap: edgeMap,
    myPointMap: pointMap,
    startPoint: mapPoint,
    endPoint: mapPoint,
    wayPointList: mapPoint[],
    /** distance: 0, time:1 */
    timeOrDis: number,
): [number, string[], string[]] {
    console.log('now in SA')
    if (wayPointList.length === 0) {
        console.log('SA to Dij')
        return dij_raw(myEdgeMap, myPointMap, startPoint, endPoint, timeOrDis)
    }
    let T: number = T0
    const memory = countDis(myEdgeMap, myPointMap, timeOrDis)
    let path: mapPoint[]
    let count = 0
    path = init(wayPointList, startPoint, endPoint)
    while (T > T_end) {
        for (let i = 0; i < (L * 3) / 10 + (((L * 7) / 10) * T) / T0; i++) {
            const path_new = create_new(Object.keys(myPointMap).length, path)
            const disOld = path_len(memory, path)
            const disNew = path_len(memory, path_new)
            const disDif = disNew - disOld
            if (disDif < 0) {
                path = path_new.concat()
            } else {
                if (Math.exp(-disDif / T) > Math.random()) {
                    path = path_new.concat()
                }
            }
        }
        T *= q
        count++
        console.log(count)
    }
    let answer_path: string[] = []
    let answer_points: string[] = [startPoint.id]
    for (let i = 0; i < path.length - 1; i++) {
        const tmpMemory = memory[path[i].id][path[i + 1].id][1].concat()
        tmpMemory.splice(0, 1)
        answer_points = answer_points.concat(tmpMemory)
        answer_path = answer_path.concat(memory[path[i].id][path[i + 1].id][2])
    }
    console.log('SA ended')
    return [path_len(memory, path), answer_points, answer_path]
}
