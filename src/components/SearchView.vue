<script lang="ts">
import { bus, currentPoint } from '@/bus'
import { defineComponent, nextTick, ref, watch } from 'vue'
import { dijkstra, SA, Ha } from '@/algorithm/workerClient'
import { mapPoint } from '@/typings/map'
import { IRoute } from '@/typings/route'

export default defineComponent({
    setup() {
        const loading = ref(false)
        // eslint-disable-next-line complexity
        async function calcRoutes() {
            loading.value = true
            await nextTick()
            console.log(bus.middle.size)
            if (bus.middle.size <= 7 && bus.middle.size > 0) {
                const wayPointList: mapPoint[] = []
                for (let wayPoint of bus.middle) {
                    wayPointList.push(bus.map.pointsMap[wayPoint])
                }
                const distanceRoute = await Ha(
                    bus.map.edgeMap,
                    bus.map.pointsMap,
                    currentPoint.value,
                    bus.map.pointsMap[bus.position],
                    wayPointList,
                    0,
                    0,
                )
                let time = 0
                for (const pathTimeItem of distanceRoute[3]) {
                    time += pathTimeItem
                }
                const distanceRouteObj = {
                    name: '最短路程',
                    description: `约${Math.round(distanceRoute[0])}米, 约${(time / 60).toFixed(0)}分钟${(
                        time % 60
                    ).toFixed(0)}秒`,
                    avgDistance: distanceRoute[0],
                    pointSeq: distanceRoute[1],
                    edgeSeq: distanceRoute[2],
                    pathTime: distanceRoute[3],
                }
                if (distanceRoute[0] > 1000) {
                    distanceRouteObj.description = `约${(distanceRoute[0] / 1000).toFixed(2)}千米, 约${(
                        time / 60
                    ).toFixed(0)}分钟${(time % 60).toFixed(0)}秒`
                }

                bus.routes.push(distanceRouteObj)
            } else if (bus.middle.size > 7) {
                const wayPointList: mapPoint[] = []
                for (let wayPoint of bus.middle) {
                    wayPointList.push(bus.map.pointsMap[wayPoint])
                }
                const distanceRoute = await SA(
                    bus.map.edgeMap,
                    bus.map.pointsMap,
                    currentPoint.value,
                    bus.map.pointsMap[bus.position],
                    wayPointList,
                    0,
                    0,
                )
                let time = 0
                for (const pathTimeItem of distanceRoute[3]) {
                    time += pathTimeItem
                }
                const distanceRouteObj = {
                    name: '最短路程',
                    description: `约${Math.round(distanceRoute[0])}米, 约${(time / 60).toFixed(0)}分钟${(
                        time % 60
                    ).toFixed(0)}秒`,
                    avgDistance: distanceRoute[0],
                    pointSeq: distanceRoute[1],
                    edgeSeq: distanceRoute[2],
                    pathTime: distanceRoute[3],
                }
                if (distanceRoute[0] > 1000) {
                    distanceRouteObj.description = `约${(distanceRoute[0] / 1000).toFixed(2)}千米, 约${(
                        time / 60
                    ).toFixed(0)}分钟${(time % 60).toFixed(0)}秒`
                }

                bus.routes.push(distanceRouteObj)
            } else {
                const wayPointList: mapPoint[] = []
                for (let wayPoint of bus.middle) {
                    wayPointList.push(bus.map.pointsMap[wayPoint])
                }
                const timeRoute = await dijkstra(
                    bus.map.edgeMap,
                    bus.map.pointsMap,
                    currentPoint.value,
                    bus.map.pointsMap[bus.position],
                    1,
                    0,
                )
                let time = 0
                for (const pathTimeItem of timeRoute[3]) {
                    time += pathTimeItem
                }
                const timeRouteObj = {
                    name: '最短时间',
                    description: `约${(time / 60).toFixed(0)}分钟${(time % 60).toFixed(0)}秒, 约${Math.round(
                        timeRoute[0],
                    )}米`,
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
                const distanceRoute = await dijkstra(
                    bus.map.edgeMap,
                    bus.map.pointsMap,
                    currentPoint.value,
                    bus.map.pointsMap[bus.position],
                    0,
                    0,
                )
                time = 0
                for (const pathTimeItem of distanceRoute[3]) {
                    time += pathTimeItem
                }
                const distanceRouteObj = {
                    name: '最短路程',
                    description: `约${Math.round(distanceRoute[0])}米, 约${(time / 60).toFixed(0)}分钟${(
                        time % 60
                    ).toFixed(0)}秒`,
                    avgDistance: distanceRoute[0],
                    pointSeq: distanceRoute[1],
                    edgeSeq: distanceRoute[2],
                    pathTime: distanceRoute[3],
                }
                if (distanceRoute[0] > 1000) {
                    distanceRouteObj.description = `约${(distanceRoute[0] / 1000).toFixed(2)}千米, 约${(
                        time / 60
                    ).toFixed(0)}分钟${(time % 60).toFixed(0)}秒`
                }
                const timeRouteBike = await dijkstra(
                    bus.map.edgeMap,
                    bus.map.pointsMap,
                    currentPoint.value,
                    bus.map.pointsMap[bus.position],
                    1,
                    1,
                )
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
                const distanceRouteBike = await dijkstra(
                    bus.map.edgeMap,
                    bus.map.pointsMap,
                    currentPoint.value,
                    bus.map.pointsMap[bus.position],
                    0,
                    1,
                )
                time = 0
                for (const pathTimeItem of distanceRouteBike[3]) {
                    time += pathTimeItem
                }
                const distanceRouteBikeObj = {
                    name: '最短路程(骑行)',
                    description: `约${Math.round(distanceRouteBike[0])}米, 约${(time / 60).toFixed(0)}分钟${(
                        time % 60
                    ).toFixed(0)}秒`,
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
                bus.routes.push(timeRouteObj)
                bus.routes.push(distanceRouteObj)
                bus.routes.push(timeRouteBikeObj)
                bus.routes.push(distanceRouteBikeObj)
            }
            loading.value = false
            showPath(bus.routes[0])
        }
        watch(
            () => bus.middle,
            () => {
                if (bus.position) {
                    bus.routes = []
                    if (bus.middle.size <= 7) {
                        calcRoutes()
                    }
                }
            },
            {
                deep: true,
            },
        )
        watch(
            () => bus.position,
            () => {
                bus.activeRoute = null
                if (bus.position) {
                    bus.routes = []
                    if (bus.middle.size <= 7) {
                        calcRoutes()
                    }
                } else {
                    bus.middle.clear()
                }
            },
        )
        watch(
            () => bus.current,
            () => {
                if (bus.animateState) return
                if (bus.position) {
                    bus.routes = []
                    if (bus.middle.size <= 7) {
                        calcRoutes()
                    }
                }
            },
        )
        function showPath(i: IRoute) {
            if (bus.animateState) return
            bus.activeRoute = i
        }
        async function moveAlongPath(i: IRoute) {
            if (bus.activeRoute !== i) {
                bus.activeRoute = i
                await new Promise((resolve) => {
                    setTimeout(resolve, 500)
                })
            }
            bus.animateState = false
            bus.current = i.pointSeq[0]
            await nextTick()
            bus.animateState = true
        }
        return {
            bus,
            calcRoutes,
            loading,
            showPath,
            moveAlongPath,
        }
    },
})
</script>
<template>
    <section class="searchView">
        <el-select v-model="bus.type" class="typeBox">
            <el-option label="全部" value=""> </el-option>
            <el-option label="物理" value="physic"> </el-option>
            <el-option label="逻辑" value="logic"> </el-option>
        </el-select>
        <el-select v-model="bus.position" clearable class="searchBox" filterable placeholder="输入或搜索目的地">
            <template v-if="bus.type === ''">
                <template v-for="item in bus.map.logics" :key="item.id">
                    <el-option :label="item.name + '(逻辑)'" :value="item.id"> </el-option>
                </template>
                <template v-for="item in bus.map.points" :key="item.id">
                    <el-option v-if="!item.name.includes('路口')" :label="item.name" :value="item.id"> </el-option>
                </template>
            </template>
            <template v-else-if="bus.type === 'physic'">
                <template v-for="item in bus.map.points" :key="item.id">
                    <el-option v-if="!item.name.includes('路口')" :label="item.name" :value="item.id"> </el-option>
                </template>
            </template>
            <template v-else>
                <template v-for="item in bus.map.logics" :key="item.id">
                    <el-option :label="item.name + '(逻辑)'" :value="item.id"> </el-option>
                </template>
            </template>
        </el-select>
        <transition name="el-zoom-in-top">
            <el-card v-if="bus.position" class="operationCard">
                <div class="middle">
                    <el-select
                        model-value=""
                        size="small"
                        clearable
                        filterable
                        placeholder="输入或搜索途径点"
                        @change="$event && bus.middle.add($event)"
                    >
                        <template v-for="item in bus.map.points" :key="item.id">
                            <el-option
                                v-if="!bus.middle.has(item.id) && !item.name.includes('路口')"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </template>
                    </el-select>
                    <div class="middle-list">
                        <el-tag
                            v-for="one in bus.middle"
                            :key="one"
                            closable
                            :disable-transitions="false"
                            @close="bus.middle.delete(one)"
                        >
                            <fa-icon icon="map-marker-alt" />
                            {{ bus.map.pointsMap[one].name }}
                        </el-tag>
                    </div>
                </div>
                <ul v-loading="loading" class="routes">
                    <li
                        v-for="(i, a) in bus.routes"
                        :key="a"
                        :class="{ active: i === bus.activeRoute }"
                        @click="showPath(i)"
                    >
                        <div class="name">{{ i.name }}</div>
                        <div class="desc">{{ i.description }}</div>
                        <el-button
                            circle
                            plain
                            class="go-button"
                            :type="i === bus.activeRoute ? 'primary' : 'default'"
                            @click.stop.prevent="moveAlongPath(i)"
                        >
                            <fa-icon icon="directions" />
                        </el-button>
                    </li>
                    <li v-if="bus.routes.length <= 0" class="not-calculated">
                        <el-button @click="calcRoutes"> 计算路线 </el-button>
                    </li>
                </ul>
            </el-card>
        </transition>
    </section>
</template>

<style lang="scss" scoped>
.searchView {
    position: absolute;
    top: 25px;
    left: 25px;
    z-index: 2;
    width: 295px;
    min-height: 100px;
    text-align: center;
    .typeBox {
        width: 77px;
    }
    .operationCard {
        margin-top: 10px;
    }
    &::v-deep(.el-card__body) {
        padding: 0;
    }
    .middle {
        .el-select {
            margin: 10px 0;
        }
        .el-tag {
            display: block;
            text-align: left;
            padding: 0 15px;
            position: relative;
            &::v-deep(.el-tag__close) {
                position: absolute;
                right: 10px;
                top: 7px;
            }
            border-radius: 0;
        }
    }
    .routes {
        margin: 0;
        padding: 0;
        min-height: 70px;
        li {
            list-style: none;
            padding: 10px 15px;
            height: 70px;
            box-sizing: border-box;
            text-align: left;
            font-size: 20px;
            border-top: 1px solid #ddd;
            transition: all 0.2s;
            position: relative;
            .go-button {
                position: absolute;
                right: 15px;
                top: 15px;
            }
            &:hover {
                background: #f5f5f5;
            }
            &.active {
                background: #ecf5ff;
                color: #2c80d7;
                .desc {
                    color: #409eff;
                }
                &:hover {
                    background: #d9ecff;
                }
            }
            &.not-calculated {
                text-align: center;
            }
        }
        .desc {
            font-size: 15px;
            color: #888;
        }
    }
    .middle-list {
        max-height: calc(100vh - 360px);
        overflow: auto;
    }
}
</style>
