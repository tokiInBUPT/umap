/* eslint-disable complexity */
/* eslint-disable max-depth */
import { bus } from '@/bus'
import { getDistance } from '@/algorithm/calcDistance'
import { TRANSPORT } from '@/typings/map'

export function genTmpPoint() {
    if (
        (bus.currentPosition.lat !== bus.map.pointsMap[bus.current].position.lat &&
            bus.currentPosition.lng !== bus.map.pointsMap[bus.current].position.lng) ||
        bus.current === 'tmp-point'
    ) {
        if (bus.map.pointsMap['tmp-point']) {
            let neighborBike: {
                toPointId: string
                edgeId: string
            }[] = []
            let neighborWalk: {
                toPointId: string
                edgeId: string
            }[] = []
            for (const i in bus.map.pointsMap) {
                if (bus.map.pointsMap.hasOwnProperty(i)) {
                    const j = bus.map.pointsMap[i]
                    for (const k of j.neighborWalk) {
                        if (k.toPointId === 'tmp-point') {
                            bus.map.pointsMap[i].neighborWalk.splice(bus.map.pointsMap[i].neighborWalk.indexOf(k))
                        }
                    }
                    for (const k of j.neighborBike) {
                        if (k.toPointId === 'tmp-point') {
                            bus.map.pointsMap[i].neighborBike.splice(bus.map.pointsMap[i].neighborBike.indexOf(k))
                        }
                    }
                }
            }
            for (const i of bus.map.points) {
                for (const j of i.neighborWalk) {
                    if (j.toPointId === 'tmp-point') {
                        i.neighborWalk.splice(i.neighborWalk.indexOf(j))
                    }
                }
                for (const j of i.neighborBike) {
                    if (j.toPointId === 'tmp-point') {
                        i.neighborWalk.splice(i.neighborWalk.indexOf(j))
                    }
                }
            }
            if (bus.map.edgeMap[bus.animateInfo.edge].type === TRANSPORT.BIKE) {
                neighborBike = [
                    {
                        toPointId: bus.animateInfo.current,
                        edgeId: 'tmp-edge-3',
                    },
                    {
                        toPointId: bus.animateInfo.next,
                        edgeId: 'tmp-edge-4',
                    },
                ]
                bus.map.pointsMap[bus.animateInfo.current].neighborBike.push({
                    toPointId: 'tmp-point',
                    edgeId: 'tmp-edge-3',
                })
                bus.map.pointsMap[bus.animateInfo.next].neighborBike.push({
                    toPointId: 'tmp-point',
                    edgeId: 'tmp-edge-4',
                })
                const tempEdge3 = {
                    id: 'tmp-edge-3',
                    length: getDistance({
                        lat1: bus.map.pointsMap[bus.animateInfo.current].position.lat,
                        lng1: bus.map.pointsMap[bus.animateInfo.current].position.lng,
                        lat2: bus.currentPosition.lat,
                        lng2: bus.currentPosition.lng,
                    }),
                    /** range: 0-1 */
                    congestionDegree: bus.map.edgeMap[bus.animateInfo.edge].congestionDegree,
                    /** walk: 1, bike: 2, bus: 3 */
                    type: bus.map.edgeMap[bus.animateInfo.edge].type,
                    time: 0,
                }
                const tempEdge4 = {
                    id: 'tmp-edge-4',
                    length: getDistance({
                        lat1: bus.map.pointsMap[bus.animateInfo.next].position.lat,
                        lng1: bus.map.pointsMap[bus.animateInfo.next].position.lng,
                        lat2: bus.currentPosition.lat,
                        lng2: bus.currentPosition.lng,
                    }),
                    /** range: 0-1 */
                    congestionDegree: bus.map.edgeMap[bus.animateInfo.edge].congestionDegree,
                    /** walk: 1, bike: 2, bus: 3 */
                    type: bus.map.edgeMap[bus.animateInfo.edge].type,
                    time: 0,
                }
                if (bus.map.edges[bus.map.edges.indexOf(bus.map.edgeMap['tmp-edge-3'])]) {
                    bus.map.edges[bus.map.edges.indexOf(bus.map.edgeMap['tmp-edge-3'])] = tempEdge3
                    bus.map.edgeMap['tmp-edge-3'] = tempEdge3
                    bus.map.edges[bus.map.edges.indexOf(bus.map.edgeMap['tmp-edge-4'])] = tempEdge4
                    bus.map.edgeMap['tmp-edge-4'] = tempEdge4
                } else {
                    bus.map.edges.push(tempEdge3)
                    bus.map.edges.push(tempEdge4)
                    bus.map.edgeMap['tmp-edge-3'] = tempEdge3
                    bus.map.edgeMap['tmp-edge-4'] = tempEdge4
                }
            }
            neighborWalk = [
                {
                    toPointId: bus.animateInfo.current,
                    edgeId: 'tmp-edge-1',
                },
                {
                    toPointId: bus.animateInfo.next,
                    edgeId: 'tmp-edge-2',
                },
            ]
            bus.map.pointsMap[bus.animateInfo.current].neighborWalk.push({
                toPointId: 'tmp-point',
                edgeId: 'tmp-edge-1',
            })
            bus.map.pointsMap[bus.animateInfo.next].neighborWalk.push({
                toPointId: 'tmp-point',
                edgeId: 'tmp-edge-2',
            })

            const tempPoint = {
                id: 'tmp-point',
                name: '临时路口',
                position: bus.currentPosition,
                neighborWalk: neighborWalk,
                neighborBike: neighborBike,
            }
            bus.map.points[bus.map.points.indexOf(bus.map.pointsMap['tmp-point'])] = tempPoint
            bus.map.pointsMap['tmp-point'] = tempPoint
            const tempEdge1 = {
                id: 'tmp-edge-1',
                length: getDistance({
                    lat1: bus.map.pointsMap[bus.animateInfo.current].position.lat,
                    lng1: bus.map.pointsMap[bus.animateInfo.current].position.lng,
                    lat2: bus.currentPosition.lat,
                    lng2: bus.currentPosition.lng,
                }),
                /** range: 0-1 */
                congestionDegree: bus.map.edgeMap[bus.animateInfo.edge].congestionDegree,
                /** walk: 1, bike: 2, bus: 3 */
                type: bus.map.edgeMap[bus.animateInfo.edge].type === TRANSPORT.BUS ? TRANSPORT.BUS : TRANSPORT.WALK,
                time: 0,
            }
            const tempEdge2 = {
                id: 'tmp-edge-2',
                length: getDistance({
                    lat1: bus.map.pointsMap[bus.animateInfo.next].position.lat,
                    lng1: bus.map.pointsMap[bus.animateInfo.next].position.lng,
                    lat2: bus.currentPosition.lat,
                    lng2: bus.currentPosition.lng,
                }),
                /** range: 0-1 */
                congestionDegree: bus.map.edgeMap[bus.animateInfo.edge].congestionDegree,
                /** walk: 1, bike: 2, bus: 3 */
                type: bus.map.edgeMap[bus.animateInfo.edge].type === TRANSPORT.BUS ? TRANSPORT.BUS : TRANSPORT.WALK,
                time: 0,
            }
            bus.map.edges[bus.map.edges.indexOf(bus.map.edgeMap['tmp-edge-1'])] = tempEdge1
            bus.map.edgeMap['tmp-edge-1'] = tempEdge1
            bus.map.edges[bus.map.edges.indexOf(bus.map.edgeMap['tmp-edge-2'])] = tempEdge2
            bus.map.edgeMap['tmp-edge-2'] = tempEdge2
        } else {
            let neighborBike: {
                toPointId: string
                edgeId: string
            }[] = []
            let neighborWalk: {
                toPointId: string
                edgeId: string
            }[] = []
            if (bus.map.edgeMap[bus.animateInfo.edge].type === TRANSPORT.BIKE) {
                neighborBike = [
                    {
                        toPointId: bus.animateInfo.current,
                        edgeId: 'tmp-edge-3',
                    },
                    {
                        toPointId: bus.animateInfo.next,
                        edgeId: 'tmp-edge-4',
                    },
                ]
                bus.map.pointsMap[bus.animateInfo.current].neighborBike.push({
                    toPointId: 'tmp-point',
                    edgeId: 'tmp-edge-3',
                })
                bus.map.pointsMap[bus.animateInfo.next].neighborBike.push({
                    toPointId: 'tmp-point',
                    edgeId: 'tmp-edge-4',
                })
                const tempEdge3 = {
                    id: 'tmp-edge-3',
                    length: getDistance({
                        lat1: bus.map.pointsMap[bus.animateInfo.current].position.lat,
                        lng1: bus.map.pointsMap[bus.animateInfo.current].position.lng,
                        lat2: bus.currentPosition.lat,
                        lng2: bus.currentPosition.lng,
                    }),
                    /** range: 0-1 */
                    congestionDegree: bus.map.edgeMap[bus.animateInfo.edge].congestionDegree,
                    /** walk: 1, bike: 2, bus: 3 */
                    type: bus.map.edgeMap[bus.animateInfo.edge].type,
                    time: 0,
                }
                const tempEdge4 = {
                    id: 'tmp-edge-4',
                    length: getDistance({
                        lat1: bus.map.pointsMap[bus.animateInfo.next].position.lat,
                        lng1: bus.map.pointsMap[bus.animateInfo.next].position.lng,
                        lat2: bus.currentPosition.lat,
                        lng2: bus.currentPosition.lng,
                    }),
                    /** range: 0-1 */
                    congestionDegree: bus.map.edgeMap[bus.animateInfo.edge].congestionDegree,
                    /** walk: 1, bike: 2, bus: 3 */
                    type: bus.map.edgeMap[bus.animateInfo.edge].type,
                    time: 0,
                }
                bus.map.edges.push(tempEdge3)
                bus.map.edges.push(tempEdge4)
                bus.map.edgeMap['tmp-edge-3'] = tempEdge3
                bus.map.edgeMap['tmp-edge-4'] = tempEdge4
            }
            neighborWalk = [
                {
                    toPointId: bus.animateInfo.current,
                    edgeId: 'tmp-edge-1',
                },
                {
                    toPointId: bus.animateInfo.next,
                    edgeId: 'tmp-edge-2',
                },
            ]
            bus.map.pointsMap[bus.animateInfo.current].neighborWalk.push({
                toPointId: 'tmp-point',
                edgeId: 'tmp-edge-1',
            })
            bus.map.pointsMap[bus.animateInfo.next].neighborWalk.push({
                toPointId: 'tmp-point',
                edgeId: 'tmp-edge-2',
            })
            const tempPoint = {
                id: 'tmp-point',
                name: '临时路口',
                position: bus.currentPosition,
                neighborWalk: neighborWalk,
                neighborBike: neighborBike,
            }
            bus.map.points.push(tempPoint)
            bus.map.pointsMap['tmp-point'] = tempPoint
            const tempEdge1 = {
                id: 'tmp-edge-1',
                length: getDistance({
                    lat1: bus.map.pointsMap[bus.animateInfo.current].position.lat,
                    lng1: bus.map.pointsMap[bus.animateInfo.current].position.lng,
                    lat2: bus.currentPosition.lat,
                    lng2: bus.currentPosition.lng,
                }),
                /** range: 0-1 */
                congestionDegree: bus.map.edgeMap[bus.animateInfo.edge].congestionDegree,
                /** walk: 1, bike: 2, bus: 3 */
                type: bus.map.edgeMap[bus.animateInfo.edge].type === TRANSPORT.BUS ? TRANSPORT.BUS : TRANSPORT.WALK,
                time: 0,
            }
            const tempEdge2 = {
                id: 'tmp-edge-2',
                length: getDistance({
                    lat1: bus.map.pointsMap[bus.animateInfo.next].position.lat,
                    lng1: bus.map.pointsMap[bus.animateInfo.next].position.lng,
                    lat2: bus.currentPosition.lat,
                    lng2: bus.currentPosition.lng,
                }),
                /** range: 0-1 */
                congestionDegree: bus.map.edgeMap[bus.animateInfo.edge].congestionDegree,
                /** walk: 1, bike: 2, bus: 3 */
                type: bus.map.edgeMap[bus.animateInfo.edge].type === TRANSPORT.BUS ? TRANSPORT.BUS : TRANSPORT.WALK,
                time: 0,
            }
            bus.map.edges.push(tempEdge1)
            bus.map.edges.push(tempEdge2)
            bus.map.edgeMap['tmp-edge-1'] = tempEdge1
            bus.map.edgeMap['tmp-edge-2'] = tempEdge2
        }
        bus.current = 'tmp-point'
        bus.hasTmpPoint = true
    }
}
