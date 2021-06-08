<script lang="ts">
import { bus, clock } from '@/bus'
import { computed, defineComponent } from 'vue'
import { formatTimeR } from '@/utils/clock'
import { TRANSPORT } from '@/typings/map'

export default defineComponent({
    setup() {
        const timeUsed = computed(() => {
            if (!bus.animateState) return '导航未开始'
            const used = formatTimeR(clock.clockOffset)
            const remain = formatTimeR(bus.animateInfo.totalTime - clock.clockOffset)
            return `用时${used} 预计还需${remain}`
        })
        const frontText = computed(() => {
            if (!bus.animateState || !bus.map.edgeMap[bus.animateInfo.edge]) return '前方到'
            switch (bus.map.edgeMap[bus.animateInfo.edge].type) {
                case TRANSPORT.BUS:
                    return '乘车至'
                case TRANSPORT.BIKE:
                    return '骑行至'
                default:
                    return '步行至'
            }
        })
        return {
            bus,
            clock,
            timeUsed,
            frontText,
        }
    },
})
</script>
<template>
    <el-card v-show="bus.animateState" class="navigateView">
        <div class="bigdesc">
            {{ frontText }}
            {{ bus.map.pointsMap[bus.animateInfo.next] ? bus.map.pointsMap[bus.animateInfo.next].name : '未知点' }}
        </div>
        <div class="timestat">{{ timeUsed }}</div>
        <div class="actions">
            <el-button v-if="!bus.animateInfo.paused" @click="bus.animateInfo.paused = true">
                <fa-icon :icon="['far', 'pause-circle']" /> 暂停 </el-button
            ><el-button v-else @click="bus.animateInfo.paused = false">
                <fa-icon :icon="['far', 'play-circle']" /> 继续 </el-button
            ><el-button style="margin: 0" @click="bus.animateState = false">
                <fa-icon :icon="['far', 'times-circle']" /> 取消
            </el-button>
        </div>
        <div v-if="bus.animateInfo.totalTime > 0" class="progressBar">
            <div class="pginn" :style="{ width: `${(clock.clockOffset / bus.animateInfo.totalTime) * 100}%` }"></div>
        </div>
    </el-card>
</template>

<style lang="scss" scoped>
.navigateView {
    position: absolute;
    bottom: 50px;
    left: 25px;
    z-index: 3;
    width: 350px;
    height: 90px;
    &::v-deep(.el-card__body) {
        padding: 0;
    }

    .actions {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        .el-button {
            width: 65px;
            height: 90px;
            border: 0;
            padding: 0;
            svg {
                display: block;
                font-size: 30px;
                margin: 0 auto;
                margin-bottom: 4px;
            }
        }
    }
    .bigdesc {
        font-size: 18px;
        padding-top: 18px;
        padding-bottom: 6px;
        padding-left: 10px;
    }

    .timestat {
        font-size: 14px;
        color: #777;
        padding-left: 10px;
    }
    .progressBar {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 5px;
        background: #eee;
        .pginn {
            height: 5px;
            background: #409eff;
        }
    }
}
</style>
