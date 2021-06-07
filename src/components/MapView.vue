<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted, nextTick } from 'vue'
// @ts-ignore
import car from '@/assets/user.png'
import { bus } from '@/bus'
import gsap from 'gsap'
//  @ts-ignore
const TMap: any = window.TMap
export default defineComponent({
    setup() {
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
                    // 底图设置（参数为：VectorBaseMap对象）
                    type: 'vector', // 类型：失量底图
                    features: ['base', 'building3d'],
                    // 仅渲染：道路及底面(base) + 2d建筑物(building2d)，以达到隐藏文字的效果
                },
            })
            marker = new TMap.MultiMarker({
                map: map,
                styles: {
                    // 样式设置
                    'car-down': new TMap.MarkerStyle({
                        width: 40, // 小车图片宽度（像素）
                        height: 40, // 高度
                        anchor: {
                            // 图片中心的像素位置（小车会保持车头朝前，会以中心位置进行转向）
                            x: 20,
                            y: 20,
                        },
                        faceTo: 'map', // 取’map’让小车贴于地面，faceTo取值说明请见下文图示
                        rotate: 0, // 初始小车朝向（正北0度，逆时针一周为360度，180为正南）
                        src: car, // 小车图片（图中小车车头向上，即正北0度）
                    }),
                },
                geometries: [
                    {
                        // 小车marker的位置信息
                        id: 'user', // 因MultiMarker支持包含多个点标记，因此要给小车一个id
                        styleId: 'car-down', // 绑定样式
                        position: new TMap.LatLng(
                            bus.map.pointsMap[bus.current].position.lat,
                            bus.map.pointsMap[bus.current].position.lng,
                        ), // 初始坐标位置
                    },
                ],
            })
            const labels: any[] = []
            let ii = 0
            for (const i of bus.map.points) {
                if (i.name.includes('路口')) {
                    continue
                }
                labels.push({
                    id: i.id,
                    position: new TMap.LatLng(i.position.lat, i.position.lng),
                    styleId: 'label',
                    content: i.name,
                    properties: {},
                    rank: ii++,
                })
            }
            label = new TMap.MultiLabel({
                map: map,
                enableCollision: true,
                styles: {
                    label: new TMap.LabelStyle({
                        color: '#5e5e5e', // 颜色属性
                        size: 15, // 文字大小属性
                        offset: { x: 0, y: 0 }, // 文字偏移属性单位为像素
                        angle: 0, // 文字旋转属性
                        alignment: 'center', // 文字水平对齐属性
                        verticalAlignment: 'middle', // 文字垂直对齐属性
                    }),
                },
                geometries: labels,
            })
            const eventClick = function (res: any) {
                const ress = res && res.geometry
                console.log('click')
                if (ress) {
                    bus.position = ress.id
                }
            }
            label.on('click', eventClick)
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
                    const p = bus.map.pointsMap[bus.position].position
                    points.push({
                        id: bus.position + (bus.position === firstPoint.id ? 'e' : ''),
                        styleId: 'end',
                        position: new TMap.LatLng(p.lat, bus.position === firstPoint.id ? p.lng + 0.00005 : p.lng),
                    })
                }
                routeLayer = new TMap.MultiPolyline({
                    map, // 绘制到目标地图
                    // 折线样式定义
                    styles: {
                        style_blue: new TMap.PolylineStyle({
                            color: '#3777FF', // 线填充色
                            width: 10, // 折线宽度
                            borderWidth: 1, // 边线宽度
                            borderColor: '#FFF', // 边线颜色
                            lineCap: 'round', // 线端头方式
                            showArrow: true,
                            arrowOptions: {
                                space: 70,
                            },
                        }),
                    },
                    geometries: [
                        {
                            styleId: 'style_blue',
                            rainbowPaths,
                        },
                    ],
                })
                middleMarkerLayer = new TMap.MultiMarker({
                    id: 'middle-marker-layer',
                    map: map,
                    styles: {
                        start: new TMap.MarkerStyle({
                            width: 25,
                            height: 35,
                            anchor: { x: 16, y: 32 },
                            src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/start.png',
                        }),
                        end: new TMap.MarkerStyle({
                            width: 25,
                            height: 35,
                            anchor: { x: 16, y: 32 },
                            src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/end.png',
                        }),
                        middle: new TMap.MarkerStyle({
                            width: 25,
                            height: 35,
                            anchor: { x: 16, y: 32 },
                            src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
                        }),
                    },
                    geometries: points,
                })
                let bounds = new TMap.LatLngBounds()
                route.pointSeq.forEach(function (item) {
                    // 若坐标点不在范围内，扩大bounds范围
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
                // 设置地图可视范围
                map.fitBounds(bounds, {
                    padding: 200, // 自适应边距
                })
            },
        )
        watch(
            () => bus.animateState,
            async (v) => {
                console.log('animateState changed')
                if (!v) {
                    if (gsapObj) {
                        gsapObj.kill()
                        gsapObj = null
                    }
                    marker.updateGeometries([
                        {
                            id: 'user',
                            styleId: 'car-down', // 绑定样式
                            position: new TMap.LatLng(currentPoint.value.position.lat, currentPoint.value.position.lng), // 初始坐标位置
                        },
                    ])
                    return
                }
                if (!bus.activeRoute) return
                const firstPoint = bus.map.pointsMap[bus.activeRoute.pointSeq[0]]
                const tn = {
                    lat: firstPoint.position.lat * 2e16,
                    lng: firstPoint.position.lng * 2e16,
                    angle: 0,
                }
                const tl = gsap.timeline({
                    smoothChildTiming: true,
                    autoRemoveChildren: true,
                    yoyo: false,
                    onUpdate() {
                        marker.updateGeometries([
                            {
                                id: 'user',
                                styleId: 'car-down',
                                position: new TMap.LatLng(tn.lat / 2e16, tn.lng / 2e16),
                                properties: {
                                    $angle: tn.angle,
                                },
                            },
                        ])
                        map._changeFPS()
                    },
                    // @ts-ignore
                    async onComplete() {
                        bus.log.push(`导航结束`)
                        bus.current = bus.animateInfo.next
                        map.panTo(new TMap.LatLng(currentPoint.value.position.lat, currentPoint.value.position.lng))
                        await nextTick()
                        bus.animateState = false
                        bus.animateInfo.paused = false
                    },
                })
                tl.timeScale(bus.speed.timeScale)
                marker.updateGeometries([
                    {
                        id: 'user',
                        styleId: 'car-down',
                        position: new TMap.LatLng(tn.lat / 2e16, tn.lng / 2e16),
                    },
                ])
                for (let i = 0; i < bus.activeRoute.edgeSeq.length; i++) {
                    const p0 = bus.map.pointsMap[bus.activeRoute.pointSeq[i + 0]]
                    const p1 = bus.map.pointsMap[bus.activeRoute.pointSeq[i + 1]]
                    const e0 = bus.map.edgeMap[bus.activeRoute.edgeSeq[i]]
                    const t0 = bus.activeRoute.pathTime[i]
                    tl.to(tn, {
                        lat: p1.position.lat * 2e16,
                        lng: p1.position.lng * 2e16,
                        ease: 'linear',
                        duration: t0,
                        onStart: () => {
                            if (i === 0) {
                                bus.log.push(`开始导航，前方 ${p1.name} 拥挤度 ${e0.congestionDegree.toFixed(2)}`)
                            } else {
                                bus.log.push(
                                    `到达 ${p0.name} ，前方 ${p1.name} 拥挤度 ${e0.congestionDegree.toFixed(2)}`,
                                )
                            }
                            bus.current = p0.id
                            bus.animateInfo.current = p0.id
                            bus.animateInfo.next = p1.id
                            const y = Math.sin(p1.position.lng - p0.position.lng) * Math.cos(p1.position.lat)
                            const x =
                                Math.cos(p0.position.lat) * Math.sin(p1.position.lat) -
                                Math.sin(p0.position.lat) *
                                    Math.cos(p1.position.lat) *
                                    Math.cos(p1.position.lng - p0.position.lng)
                            tn.angle = (180 * Math.atan2(y, x)) / Math.PI
                        },
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
                if (bus.animateState) return
                marker &&
                    marker.updateGeometries([
                        {
                            id: 'user',
                            styleId: 'car-down', // 绑定样式
                            position: new TMap.LatLng(currentPoint.value.position.lat, currentPoint.value.position.lng), // 初始坐标位置
                        },
                    ])
                if (!bus.activeRoute) {
                    map.panTo(new TMap.LatLng(currentPoint.value.position.lat, currentPoint.value.position.lng))
                }
            },
        )
        watch(
            () => bus.animateInfo.paused,
            async (v) => {
                if (!gsapObj) return
                if (v) {
                    gsapObj.pause()
                } else {
                    gsapObj.resume()
                }
            },
        )
        return {
            mapEl,
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
