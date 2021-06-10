<script lang="ts">
import { bus } from '@/bus'
import { defineComponent, ref } from 'vue'
import { dijkstra } from '../algorithm/Dij_Ha'
import { genTmpPoint } from '@/algorithm/genTmpPoint'

export default defineComponent({
    setup() {
        let pointsAround = ref([] as [string, number][])
        function searchAround() {
            if (bus.activeRoute && bus.activeRoute.pointSeq[0] !== 'tmp-point') {
                genTmpPoint()
            }
            const answer = dijkstra(
                bus.map.edgeMap,
                bus.map.pointsMap,
                bus.map.pointsMap[bus.current],
                bus.map.pointsMap[bus.current],
                0,
                0,
            )
            const memory: [string, number][] = []
            for (const idCur in answer[0]) {
                if (answer[0].hasOwnProperty(idCur)) {
                    if (!bus.map.pointsMap[idCur].name.includes('路口') && answer[0][idCur] > 0) {
                        memory.push([idCur, answer[0][idCur]])
                    }
                }
            }
            memory.sort(function (a, b) {
                return a[1] - b[1]
            })
            const pointAround: [string, number][] = []
            for (let i = 0; memory[i][1] < bus.aroundLimit; i++) {
                pointAround.push(memory[i])
            }
            pointsAround.value = pointAround
        }
        const showPopover = ref(false)
        return { bus, searchAround, pointsAround, showPopover }
    },
})
</script>
<template>
    <el-popover
        v-model:visible="showPopover"
        placement="top"
        title="附近地点"
        :width="300"
        trigger="click"
        @show="searchAround"
    >
        <ul class="around">
            <div class="around-list">
                <li v-for="i in pointsAround" :key="i[0]">
                    <div class="title">{{ bus.map.pointsMap[i[0]].name }}</div>
                    <div class="desc">{{ Math.round(i[1]) }}m</div>
                    <div class="action">
                        <el-button
                            circle
                            class="set-button"
                            @click="
                                ;(showPopover = false) ||
                                    ((!bus.animateState || bus.animateInfo.pause) && (bus.position = i[0]))
                            "
                        >
                            <fa-icon icon="directions" />
                        </el-button>
                    </div>
                </li>
            </div>
        </ul>
        <template #reference>
            <el-button class="float-around">
                <fa-icon icon="map-marked-alt" />
            </el-button>
        </template>
    </el-popover>
</template>

<style lang="scss" scoped>
.float-around {
    position: absolute;
    z-index: 4;
    bottom: 50px;
    right: 25px;
    width: 64px;
    height: 64px;
    border-radius: 100%;
    font-size: 22px;
    padding: 0;
}
.around {
    margin: 0 -12px;
    margin-bottom: -12px;
    padding: 0;

    li {
        list-style: none;
        padding: 5px 20px;
        position: relative;
        height: 50px;
        border-top: 1px solid #eee;
    }

    .action {
        position: absolute;
        right: 20px;
        top: 8px;
    }

    .title {
        font-size: 17px;
        padding-bottom: 2px;
    }
    .around-list {
        max-height: calc(100vh - 460px);
        overflow: auto;
    }
}
</style>
