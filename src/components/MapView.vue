<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted } from 'vue'
// @ts-ignore
import car from '@/assets/car.png'
import { bus } from '@/bus'
//  @ts-ignore
const TMap: any = window.TMap
export default defineComponent({
    setup() {
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
                        rotate: 180, // 初始小车朝向（正北0度，逆时针一周为360度，180为正南）
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
                const path = []
                for (const r of route.pointSeq) {
                    const p = bus.map.pointsMap[r].position
                    const pos = new TMap.LatLng(p.lat, p.lng)
                    path.push(pos)
                }
                const points = [
                    {
                        id: bus.current,
                        styleId: 'start',
                        position: new TMap.LatLng(currentPoint.value.position.lat, currentPoint.value.position.lng),
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
                        id: bus.position + (bus.position === bus.current ? 'e' : ''),
                        styleId: 'end',
                        position: new TMap.LatLng(p.lat, bus.position === bus.current ? p.lng + 0.00005 : p.lng),
                    })
                }
                console.log(points)
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
                            paths: path,
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
                marker.moveAlong(
                    {
                        user: {
                            path,
                            speed: 200,
                        },
                    },
                    {
                        autoRotation: true,
                    },
                )
            },
        )
        watch(
            () => bus.current,
            () => {
                marker &&
                    marker.updateGeometries([
                        {
                            id: 'user',
                            styleId: 'car-down', // 绑定样式
                            position: new TMap.LatLng(currentPoint.value.position.lat, currentPoint.value.position.lng), // 初始坐标位置
                        },
                    ])
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
