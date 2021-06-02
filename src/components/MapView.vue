<script lang="ts">
import { defineComponent } from 'vue'
// @ts-ignore
import car from '@/assets/car.png'
import { bus } from '@/bus'
//  @ts-ignore
const TMap: any = window.TMap
let map: any
let marker: any
export default defineComponent({
    components: {},
    data() {
        return {
            map: {},
            marker: {} as any,
        }
    },
    computed: {
        currentPoint() {
            return bus.map.pointsMap[bus.current]
        },
    },
    watch: {
        currentPoint(currentPoint) {
            marker &&
                marker.updateGeometries([
                    {
                        id: 'user',
                        styleId: 'car-down', // 绑定样式
                        position: new TMap.LatLng(currentPoint.position.lat, currentPoint.position.lng), // 初始坐标位置
                    },
                ])
        },
    },
    mounted() {
        const center = new TMap.LatLng(40.15756173403039, 116.2895435631267)
        map = new TMap.Map(this.$refs.map, {
            center: center,
            zoom: 17.2,
            pitch: 10,
            rotation: 0,
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
    },
})
</script>

<template>
    <div id="map" ref="map"></div>
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
