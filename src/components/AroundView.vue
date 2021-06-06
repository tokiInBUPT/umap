<script lang="ts">
import { bus } from '@/bus'
import { defineComponent } from 'vue'
import { dijkstra } from '../algorithm/Dij_Ha'

export default defineComponent({
    setup() {
        function searchAround() {
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
            for (let i = 0; i < (memory.length < 5 ? memory.length : 5); i++) {
                pointAround.push(memory[i])
                console.log(bus.map.pointsMap[memory[i][0]].name)
                console.log(memory[i][1])
            }
            return pointAround
        }
        return { bus, searchAround }
    },
})
</script>
<template>
    <el-popover placement="top" title="附近地点" :width="300" trigger="click" @show="searchAround">
        <ul class="around">
            <li>
                <div class="title">教学楼N</div>
                <div class="desc">200m</div>
                <div class="action">
                    <el-button circle class="set-button" @click="position = 'jxl-n'">
                        <fa-icon icon="directions" />
                    </el-button>
                </div>
            </li>
            <li>
                <div class="title">教学楼S</div>
                <div class="desc">200m</div>
                <div class="action">
                    <el-button circle class="set-button" @click="position = 'jxl-s'">
                        <fa-icon icon="directions" />
                    </el-button>
                </div>
            </li>
            <li>
                <div class="title">图书馆</div>
                <div class="desc">200m</div>
                <div class="action">
                    <el-button circle class="set-button" @click="position = 'tsg'">
                        <fa-icon icon="directions" />
                    </el-button>
                </div>
            </li>
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
}
</style>
