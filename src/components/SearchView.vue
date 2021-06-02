<script lang="ts">
import { bus, currentPoint } from '@/bus'
import { defineComponent, nextTick, ref, watch } from 'vue'
import { dijkstra } from '@/algorithm/Dij'
import { SA } from '@/algorithm/SA'
import { mapPoint } from '@/typings/map'

export default defineComponent({
    setup() {
        const loading = ref(false)
        async function calcRoutes() {
            loading.value = true
            await nextTick()
            console.log(bus.middle.size)
            if (bus.middle.size > 0) {
                const wayPointList: mapPoint[] = []
                for (let wayPoint of bus.middle) {
                    wayPointList.push(bus.map.pointsMap[wayPoint])
                }
                const timeRoute = SA(
                    bus.map.edgeMap,
                    bus.map.pointsMap,
                    currentPoint.value,
                    bus.map.pointsMap[bus.position],
                    wayPointList,
                    1,
                )
                const timeRouteObj = {
                    name: '最短时间',
                    description: `约${(timeRoute[0] / bus.speed.walk / 60).toFixed(0)}分钟`,
                    avgDistance: timeRoute[0],
                    pointSeq: timeRoute[1],
                    edgeSeq: timeRoute[2],
                }
                const distanceRoute = SA(
                    bus.map.edgeMap,
                    bus.map.pointsMap,
                    currentPoint.value,
                    bus.map.pointsMap[bus.position],
                    wayPointList,
                    0,
                )
                const distanceRouteObj = {
                    name: '最短路程',
                    description: `约${Math.round(distanceRoute[0])}米`,
                    avgDistance: distanceRoute[0],
                    pointSeq: distanceRoute[1],
                    edgeSeq: distanceRoute[2],
                }
                bus.routes.push(timeRouteObj)
                bus.routes.push(distanceRouteObj)
            } else {
                const timeRoute = dijkstra(
                    bus.map.edgeMap,
                    bus.map.pointsMap,
                    currentPoint.value,
                    bus.map.pointsMap[bus.position],
                    1,
                )
                const timeRouteObj = {
                    name: '最短时间',
                    description: `约${(timeRoute[0] / bus.speed.walk / 60).toFixed(0)}分钟`,
                    avgDistance: timeRoute[0],
                    pointSeq: timeRoute[1],
                    edgeSeq: timeRoute[2],
                }
                const distanceRoute = dijkstra(
                    bus.map.edgeMap,
                    bus.map.pointsMap,
                    currentPoint.value,
                    bus.map.pointsMap[bus.position],
                    0,
                )
                const distanceRouteObj = {
                    name: '最短路程',
                    description: `约${Math.round(distanceRoute[0])}米`,
                    avgDistance: distanceRoute[0],
                    pointSeq: distanceRoute[1],
                    edgeSeq: distanceRoute[2],
                }
                bus.routes.push(timeRouteObj)
                bus.routes.push(distanceRouteObj)
            }
            loading.value = false
        }
        watch(
            () => bus.middle,
            () => {
                bus.routes = []
                if (bus.middle.size <= 3) {
                    calcRoutes()
                }
            },
            {
                deep: true,
            },
        )
        watch(
            () => bus.position,
            () => {
                bus.routes = []
                if (bus.middle.size <= 3) {
                    calcRoutes()
                }
            },
        )
        return {
            bus,
            calcRoutes,
            loading,
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
            <template v-for="item in bus.map.points" :key="item.id">
                <el-option v-if="!item.name.includes('路口')" :label="item.name" :value="item.id"> </el-option>
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
                <ul v-loading="loading" class="routes">
                    <li v-for="(i, a) in bus.routes" :key="a">
                        <div class="name">{{ i.name }}</div>
                        <div class="desc">{{ i.description }}</div>
                        <el-button circle class="go-button">
                            <fa-icon icon="directions" />
                        </el-button>
                    </li>
                    <li v-if="bus.routes.length <= 0" class="not-calculated">
                        <el-button @click="calcRoutes">计算路线</el-button>
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
            &.not-calculated {
                text-align: center;
            }
        }
        .desc {
            font-size: 15px;
            color: #888;
        }
    }
}
</style>
