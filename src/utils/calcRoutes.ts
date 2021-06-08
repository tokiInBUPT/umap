import { dijkstra, SA, Ha } from '@/algorithm/workerClient'
import { mapPoint } from '@/typings/map'
import { IRoute } from '@/typings/route'
export async function calcRoutes({
    map,
    from,
    to,
    middle,
}: {
    map: any
    from: string
    to: string
    middle: Set<string>
}) {
    const routes = []
    const currentPoint = map.pointsMap[from]
    if (middle.size <= 7 && middle.size > 0) {
        const wayPointList: mapPoint[] = []
        for (const wayPoint of middle) {
            wayPointList.push(map.pointsMap[wayPoint])
        }
        const distanceRoute = await Ha(map.edgeMap, map.pointsMap, currentPoint, map.pointsMap[to], wayPointList, 0, 0)
        let time = 0
        for (const pathTimeItem of distanceRoute[3]) {
            time += pathTimeItem
        }
        const distanceRouteObj = {
            name: '最短路程',
            description: `约${Math.round(distanceRoute[0])}米, 约${(time / 60).toFixed(0)}分钟${(time % 60).toFixed(
                0,
            )}秒`,
            avgDistance: distanceRoute[0],
            pointSeq: distanceRoute[1],
            edgeSeq: distanceRoute[2],
            pathTime: distanceRoute[3],
        }
        if (distanceRoute[0] > 1000) {
            distanceRouteObj.description = `约${(distanceRoute[0] / 1000).toFixed(2)}千米, 约${(time / 60).toFixed(
                0,
            )}分钟${(time % 60).toFixed(0)}秒`
        }

        routes.push(distanceRouteObj)
    } else if (middle.size > 7) {
        const wayPointList: mapPoint[] = []
        for (const wayPoint of middle) {
            wayPointList.push(map.pointsMap[wayPoint])
        }
        const distanceRoute = await SA(map.edgeMap, map.pointsMap, currentPoint, map.pointsMap[to], wayPointList, 0, 0)
        let time = 0
        for (const pathTimeItem of distanceRoute[3]) {
            time += pathTimeItem
        }
        const distanceRouteObj = {
            name: '最短路程',
            description: `约${Math.round(distanceRoute[0])}米, 约${(time / 60).toFixed(0)}分钟${(time % 60).toFixed(
                0,
            )}秒`,
            avgDistance: distanceRoute[0],
            pointSeq: distanceRoute[1],
            edgeSeq: distanceRoute[2],
            pathTime: distanceRoute[3],
        }
        if (distanceRoute[0] > 1000) {
            distanceRouteObj.description = `约${(distanceRoute[0] / 1000).toFixed(2)}千米, 约${(time / 60).toFixed(
                0,
            )}分钟${(time % 60).toFixed(0)}秒`
        }

        routes.push(distanceRouteObj)
    } else {
        const wayPointList: mapPoint[] = []
        for (const wayPoint of middle) {
            wayPointList.push(map.pointsMap[wayPoint])
        }
        const timeRoute = await dijkstra(map.edgeMap, map.pointsMap, currentPoint, map.pointsMap[to], 1, 0)
        let time = 0
        for (const pathTimeItem of timeRoute[3]) {
            time += pathTimeItem
        }
        const timeRouteObj = <IRoute>{
            name: '最短时间',
            description: `约${(time / 60).toFixed(0)}分钟${(time % 60).toFixed(0)}秒, 约${Math.round(timeRoute[0])}米`,
            avgDistance: timeRoute[0],
            pointSeq: timeRoute[1],
            edgeSeq: timeRoute[2],
            pathTime: timeRoute[3],
        }
        if (timeRoute[0] > 1000) {
            timeRouteObj.description = `约${(time / 60).toFixed(0)}分钟${(time % 60).toFixed(0)}秒, 约${(
                timeRoute[0] / 1000
            ).toFixed(2)}千米`
        }
        const distanceRoute = await dijkstra(map.edgeMap, map.pointsMap, currentPoint, map.pointsMap[to], 0, 0)
        time = 0
        for (const pathTimeItem of distanceRoute[3]) {
            time += pathTimeItem
        }
        const distanceRouteObj = {
            name: '最短路程',
            description: `约${Math.round(distanceRoute[0])}米, 约${(time / 60).toFixed(0)}分钟${(time % 60).toFixed(
                0,
            )}秒`,
            avgDistance: distanceRoute[0],
            pointSeq: distanceRoute[1],
            edgeSeq: distanceRoute[2],
            pathTime: distanceRoute[3],
        }
        if (distanceRoute[0] > 1000) {
            distanceRouteObj.description = `约${(distanceRoute[0] / 1000).toFixed(2)}千米, 约${(time / 60).toFixed(
                0,
            )}分钟${(time % 60).toFixed(0)}秒`
        }
        const timeRouteBike = await dijkstra(map.edgeMap, map.pointsMap, currentPoint, map.pointsMap[to], 1, 1)
        time = 0
        for (const pathTimeItem of timeRouteBike[3]) {
            time += pathTimeItem
        }
        const timeRouteBikeObj = {
            name: '最短时间(骑行)',
            description: `约${(time / 60).toFixed(0)}分钟${(time % 60).toFixed(0)}秒, 约${Math.round(
                timeRouteBike[0],
            )}米`,
            avgDistance: timeRouteBike[0],
            pointSeq: timeRouteBike[1],
            edgeSeq: timeRouteBike[2],
            pathTime: timeRouteBike[3],
        }
        if (timeRouteBike[0] > 1000) {
            timeRouteBikeObj.description = `约${(time / 60).toFixed(0)}分钟${(time % 60).toFixed(0)}秒, 约${(
                timeRouteBike[0] / 1000
            ).toFixed(2)}千米`
        }
        const distanceRouteBike = await dijkstra(map.edgeMap, map.pointsMap, currentPoint, map.pointsMap[to], 0, 1)
        time = 0
        for (const pathTimeItem of distanceRouteBike[3]) {
            time += pathTimeItem
        }
        const distanceRouteBikeObj = {
            name: '最短路程(骑行)',
            description: `约${Math.round(distanceRouteBike[0])}米, 约${(time / 60).toFixed(0)}分钟${(time % 60).toFixed(
                0,
            )}秒`,
            avgDistance: distanceRouteBike[0],
            pointSeq: distanceRouteBike[1],
            edgeSeq: distanceRouteBike[2],
            pathTime: distanceRouteBike[3],
        }
        if (distanceRouteBike[0] > 1000) {
            distanceRouteBikeObj.description = `约${(distanceRouteBike[0] / 1000).toFixed(2)}千米, 约${(
                time / 60
            ).toFixed(0)}分钟${(time % 60).toFixed(0)}秒`
        }
        routes.push(timeRouteObj)
        routes.push(distanceRouteObj)
        routes.push(timeRouteBikeObj)
        routes.push(distanceRouteBikeObj)
    }
    return routes
}
