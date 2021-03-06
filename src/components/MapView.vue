<script lang="ts">
import { gsap } from '@/utils/gsap'
import { bus, realPosition } from '@/bus'
import { clock } from '@/modules/clock'
import { pushLog } from '@/modules/log'
import { defineComponent, ref, watch, computed, onMounted, nextTick } from 'vue'
import { TMap, createRainbowPath, createRouteMarker, createUserMarker, createLabelLayer } from '@/utils/mapHelper'
import { busTimeDIf } from '@/config'
import { genTmpPoint } from '@/algorithm/genTmpPoint'
import { formatTime } from '@/utils/clock'
export default defineComponent({
    emits: ['ready'],
    setup(props, { emit }) {
        let gsapObj: gsap.core.Timeline | null = null
        const currentPoint = computed(() => {
            return bus.map.pointsMap[bus.current]
        })
        const mapEl = ref(null)
        let map: any
        let label: any
        let marker: any
        let routeLayer: any = null
        let middleMarkerLayer: any = null
        onMounted(() => {
            const center = new TMap.LatLng(40.15756173403039, 116.2895435631267)
            map = new TMap.Map(mapEl.value, {
                center: center,
                zoom: 17.2,
                pitch: 10,
                rotation: 0,
                baseMap: {
                    type: 'vector',
                    features: ['base', 'building3d'],
                },
            })
            const mapReady = () => {
                emit('ready')
                map.off('tilesloaded', mapReady)
            }
            map.on('tilesloaded', mapReady)
            marker = createUserMarker(
                map,
                new TMap.LatLng(
                    bus.map.pointsMap[bus.current].position.lat,
                    bus.map.pointsMap[bus.current].position.lng,
                ),
            )
            const labels: any[] = []
            let ii = 0
            for (const i in bus.map.pointsMap) {
                if (bus.map.pointsMap.hasOwnProperty(i)) {
                    const j = bus.map.pointsMap[i]
                    if (j.name.includes('路口')) {
                        continue
                    }
                    labels.push({
                        id: j.id,
                        position: new TMap.LatLng(j.position.lat, j.position.lng),
                        styleId: 'label',
                        content: j.name,
                        properties: {},
                        rank: ii++,
                    })
                }
            }
            label = createLabelLayer(map, labels)
            pushLog('系统初始化完成')
            pushLog(`共${bus.map.points.length}个点`)
            pushLog(`共${bus.map.edges.length}条边`)
        })
        watch(
            () => bus.activeRoute,
            (route) => {
                if (routeLayer) {
                    routeLayer.destroy()
                }
                if (middleMarkerLayer) {
                    middleMarkerLayer.destroy()
                }
                marker.stopMove()
                if (!route) {
                    return
                }
                const rainbowPaths = []
                const P_GREEN = 'rgba(0, 180, 0, 1)'
                const P_YELLOW = '#ff9200'
                const P_RED = '#f56c6c'
                for (let i = 1; i < route.pointSeq.length; i++) {
                    const p0Id = route.pointSeq[i - 1]
                    const p1Id = route.pointSeq[i]
                    const p0 = bus.map.pointsMap[p0Id]
                    const p1 = bus.map.pointsMap[p1Id]
                    const edge = bus.map.edgeMap[route.edgeSeq[i - 1]]
                    rainbowPaths.push({
                        color:
                            edge.congestionDegree < 0.334 ? P_GREEN : edge.congestionDegree < 0.667 ? P_YELLOW : P_RED,
                        path: [
                            new TMap.LatLng(p0.position.lat, p0.position.lng),
                            new TMap.LatLng(p1.position.lat, p1.position.lng),
                        ],
                    })
                }

                const firstPoint = bus.map.pointsMap[route.pointSeq[0]]
                const points = [
                    {
                        id: bus.current,
                        styleId: 'start',
                        position: new TMap.LatLng(firstPoint.position.lat, firstPoint.position.lng),
                    },
                ]
                for (const r of bus.middle) {
                    const p = bus.map.pointsMap[r].position
                    points.push({
                        id: r,
                        styleId: 'middle',
                        position: new TMap.LatLng(p.lat, p.lng),
                    })
                }
                {
                    const p = bus.map.pointsMap[realPosition.value].position
                    points.push({
                        id: realPosition.value + (realPosition.value === firstPoint.id ? 'e' : ''),
                        styleId: 'end',
                        position: new TMap.LatLng(
                            p.lat,
                            realPosition.value === firstPoint.id ? p.lng + 0.00005 : p.lng,
                        ),
                    })
                }
                routeLayer = createRainbowPath(map, rainbowPaths)
                middleMarkerLayer = createRouteMarker(map, points)
                let bounds = new TMap.LatLngBounds()
                route.pointSeq.forEach(function (item) {
                    if (
                        bounds.isEmpty() ||
                        !bounds.contains(
                            new TMap.LatLng(bus.map.pointsMap[item].position.lat, bus.map.pointsMap[item].position.lng),
                        )
                    ) {
                        bounds.extend(
                            new TMap.LatLng(bus.map.pointsMap[item].position.lat, bus.map.pointsMap[item].position.lng),
                        )
                    }
                })
                map.fitBounds(bounds, {
                    padding: 150,
                })
            },
        )
        watch(
            () => bus.animateState,
            async (v) => {
                console.log('animateState changed')
                bus.animateInfo.totalTime = 0
                bus.animateInfo.paused = false
                if (!v) {
                    pushLog('取消模拟导航')
                    if (gsapObj) {
                        gsapObj.kill()
                        gsapObj = null
                    }
                    genTmpPoint()
                    bus.activeRoute = null
                    return
                }
                bus.animateInfo.paused = false
                if (!bus.activeRoute) return
                const firstPoint = bus.map.pointsMap[bus.activeRoute.pointSeq[0]]
                const tn = {
                    lat: firstPoint.position.lat * 2e16,
                    lng: firstPoint.position.lng * 2e16,
                    angle: 0,
                }
                gsap.ticker.lagSmoothing(0)
                const tl = gsap.timeline({
                    smoothChildTiming: true,
                    autoRemoveChildren: true,
                    yoyo: false,
                    onStart() {
                        clock.clockBase += clock.clockOffset
                        clock.clockBase = clock.clockBase % (3600 * 24)
                        clock.clockOffset = 0
                    },
                    onUpdate() {
                        marker.updateGeometries([
                            {
                                id: 'user',
                                styleId: 'userPNG',
                                position: new TMap.LatLng(tn.lat / 2e16, tn.lng / 2e16),
                                properties: {
                                    $angle: tn.angle,
                                },
                            },
                        ])
                        bus.currentPosition.lat = tn.lat / 2e16
                        bus.currentPosition.lng = tn.lng / 2e16
                        map._changeFPS()
                        const now = performance.now()
                        clock.clockOffset += ((now - clock.lastOffsetUpdate) / 1000) * bus.speed.timeScale
                        clock.clockOffset = clock.clockOffset % (3600 * 24)
                        clock.lastOffsetUpdate = now
                    },
                    // @ts-ignore
                    async onComplete() {
                        pushLog(`导航结束`)
                        bus.current = bus.animateInfo.next
                        map.panTo(new TMap.LatLng(currentPoint.value.position.lat, currentPoint.value.position.lng))
                        await nextTick()
                        bus.animateState = false
                        bus.animateInfo.paused = false
                        if (bus.hasTmpPoint) {
                            bus.map.points.splice(bus.map.points.indexOf(bus.map.pointsMap['tmp-point']), 1)
                            delete bus.map.pointsMap['tmp-point']
                            bus.map.edges.splice(bus.map.edges.indexOf(bus.map.edgeMap['tmp-edge-1']), 1)
                            delete bus.map.edgeMap['tmp-edge-1']
                            bus.map.edges.splice(bus.map.edges.indexOf(bus.map.edgeMap['tmp-edge-2']), 1)
                            delete bus.map.edgeMap['tmp-edge-2']
                            if (bus.map.edgeMap['tmp-edge-3']) {
                                bus.map.edges.splice(bus.map.edges.indexOf(bus.map.edgeMap['tmp-edge-3']), 1)
                                delete bus.map.edgeMap['tmp-edge-3']
                                bus.map.edges.splice(bus.map.edges.indexOf(bus.map.edgeMap['tmp-edge-4']), 1)
                                delete bus.map.edgeMap['tmp-edge-4']
                            }
                            bus.hasTmpPoint = false
                            for (let i in bus.map.pointsMap) {
                                if (bus.map.pointsMap.hasOwnProperty(i)) {
                                    const j = bus.map.pointsMap[i]
                                    for (let k of j.neighborWalk) {
                                        if (k.toPointId === 'tmp-point') {
                                            bus.map.pointsMap[i].neighborWalk.splice(
                                                bus.map.pointsMap[i].neighborWalk.indexOf(k),
                                            )
                                        }
                                    }
                                    for (let k of j.neighborBike) {
                                        if (k.toPointId === 'tmp-point') {
                                            bus.map.pointsMap[i].neighborBike.splice(
                                                bus.map.pointsMap[i].neighborBike.indexOf(k),
                                            )
                                        }
                                    }
                                }
                            }
                            for (let i of bus.map.points) {
                                for (let k of i.neighborWalk) {
                                    if (k.toPointId === 'tmp-point') {
                                        i.neighborWalk.splice(i.neighborWalk.indexOf(k))
                                    }
                                }
                                for (let k of i.neighborBike) {
                                    if (k.toPointId === 'tmp-point') {
                                        i.neighborBike.splice(i.neighborBike.indexOf(k))
                                    }
                                }
                            }
                        }
                    },
                })
                tl.timeScale(bus.speed.timeScale)
                marker.updateGeometries([
                    {
                        id: 'user',
                        styleId: 'userPNG',
                        position: new TMap.LatLng(tn.lat / 2e16, tn.lng / 2e16),
                    },
                ])
                bus.currentPosition.lat = tn.lat / 2e16
                bus.currentPosition.lng = tn.lng / 2e16
                for (let i = 0; i < bus.activeRoute.edgeSeq.length; i++) {
                    const p0 = bus.map.pointsMap[bus.activeRoute.pointSeq[i + 0]]
                    const p1 = bus.map.pointsMap[bus.activeRoute.pointSeq[i + 1]]
                    const e0 = bus.map.edgeMap[bus.activeRoute.edgeSeq[i]]
                    let t0 = bus.activeRoute.pathTime[i]
                    if (bus.activeRoute.edgeSeq[i] === 'benbu_to_shahe') {
                        bus.map.busTimeList.sort(function (a, b) {
                            return a.time - b.time
                        })
                        let busToGo: {
                            time: number
                            type: number
                        } = {
                            time: -1,
                            type: -1,
                        }
                        let flag = true
                        for (let i of bus.map.busTimeList) {
                            if (i.time > clock.clockBase + clock.clockOffset + bus.animateInfo.totalTime) {
                                if (i.type === 1 && flag) {
                                    busToGo = i
                                    break
                                } else if (flag) {
                                    busToGo = i
                                    flag = false
                                } else if (i.type === 1) {
                                    // eslint-disable-next-line max-depth
                                    if (i.time - busToGo.time < busTimeDIf) {
                                        busToGo = i
                                        break
                                    }
                                }
                            }
                        }
                        let t1 = 0
                        if (busToGo.time === -1) {
                            busToGo = bus.map.busTimeList[0]
                            t1 =
                                24 * 3600 -
                                (clock.clockBase + clock.clockOffset + bus.animateInfo.totalTime) +
                                busToGo.time
                        } else {
                            t1 = busToGo.time - (clock.clockBase + clock.clockOffset + bus.animateInfo.totalTime)
                        }
                        if (busToGo.type === 2) {
                            t0 += busTimeDIf
                        }
                        bus.animateInfo.totalTime += t1
                        tl.to(
                            {},
                            {
                                duration: t1,
                                onStart(currentOffset: number) {
                                    if (i === 0) {
                                        pushLog(`开始导航，前方 ${p1.name} 拥挤度 ${e0.congestionDegree.toFixed(2)}`)
                                    }
                                    bus.current = p0.id
                                    bus.animateInfo.current = p0.id
                                    bus.animateInfo.next = p1.id
                                    bus.animateInfo.edge = e0.id
                                    bus.animateInfo.type = busToGo.type
                                    clock.clockOffset = currentOffset
                                    clock.lastOffsetUpdate = performance.now()
                                    if (bus.animateInfo.type === 1) {
                                        pushLog(`等校车至${formatTime(busToGo.time)}, 前往${p1.name}`)
                                    } else {
                                        pushLog(`等公交至${formatTime(busToGo.time)}, 前往${p1.name}`)
                                    }
                                },
                                onStartParams: [bus.animateInfo.totalTime - t1],
                            },
                        )
                    }
                    bus.animateInfo.totalTime += t0
                    tl.to(tn, {
                        lat: p1.position.lat * 2e16,
                        lng: p1.position.lng * 2e16,
                        ease: 'linear',
                        duration: t0,
                        onStart: (currentOffset: number) => {
                            bus.current = p0.id
                            bus.animateInfo.current = p0.id
                            bus.animateInfo.next = p1.id
                            bus.animateInfo.edge = e0.id
                            if (
                                bus.activeRoute &&
                                bus.activeRoute.edgeSeq[i] === 'benbu_to_shahe' &&
                                (bus.animateInfo.type === 1 || bus.animateInfo.type === 2)
                            ) {
                                if (bus.animateInfo.type === 1) {
                                    pushLog(`乘校车至${p1.name}`)
                                } else {
                                    pushLog(`乘公交至${p1.name}`)
                                }
                                bus.animateInfo.type += 2
                            } else {
                                if (i === 0 && bus.activeRoute && bus.activeRoute.edgeSeq[i] !== 'benbu_to_shahe') {
                                    pushLog(`开始导航，前方 ${p1.name} 拥挤度 ${e0.congestionDegree.toFixed(2)}`)
                                } else {
                                    pushLog(
                                        `到达 ${p0.name} ，前方 ${p1.name} 拥挤度 ${e0.congestionDegree.toFixed(2)}`,
                                    )
                                }
                            }
                            const y = Math.sin(p1.position.lng - p0.position.lng) * Math.cos(p1.position.lat)
                            const x =
                                Math.cos(p0.position.lat) * Math.sin(p1.position.lat) -
                                Math.sin(p0.position.lat) *
                                    Math.cos(p1.position.lat) *
                                    Math.cos(p1.position.lng - p0.position.lng)
                            tn.angle = (180 * Math.atan2(y, x)) / Math.PI
                            clock.clockOffset = currentOffset
                            clock.lastOffsetUpdate = performance.now()
                        },
                        onStartParams: [bus.animateInfo.totalTime - t0],
                    })
                }
                gsapObj = tl
            },
        )
        watch(
            () => bus.speed.timeScale,
            () => {
                gsapObj && gsapObj.timeScale(bus.speed.timeScale)
            },
        )
        watch(
            () => bus.current,
            () => {
                if (bus.animateState && bus.animateInfo.paused === false) return
                marker &&
                    marker.updateGeometries([
                        {
                            id: 'user',
                            styleId: 'userPNG', // 绑定样式
                            position: new TMap.LatLng(currentPoint.value.position.lat, currentPoint.value.position.lng), // 初始坐标位置
                        },
                    ])
                bus.currentPosition.lat = currentPoint.value.position.lat
                bus.currentPosition.lng = currentPoint.value.position.lng
                if (!bus.activeRoute) {
                    map.panTo(new TMap.LatLng(currentPoint.value.position.lat, currentPoint.value.position.lng))
                }
            },
        )
        watch(
            () => bus.animateInfo.paused,
            async (v) => {
                if (bus.animateState) {
                    if (bus.animateInfo.paused) {
                        pushLog('暂停')
                    } else {
                        pushLog('继续')
                    }
                }
                if (!gsapObj) return
                clock.lastOffsetUpdate = performance.now()
                if (v) {
                    gsapObj.pause()
                    if (bus.activeRoute && bus.activeRoute.pointSeq[0] !== 'tmp-point') {
                        genTmpPoint()
                    }
                } else {
                    gsapObj.resume()
                }
            },
        )
        return {
            mapEl,
            label,
            marker,
        }
    },
})
</script>

<template>
    <div id="map" ref="mapEl"></div>
</template>

<style lang="scss">
#map {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
}
</style>
