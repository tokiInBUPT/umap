<script lang="ts">
import { bus } from '@/bus'
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        return bus
    },
})
</script>
<template>
    <el-card v-show="animateState" class="navigateView">
        <div class="bigicon">
            <fa-icon icon="angle-double-left" />
        </div>
        <div class="bigdesc">
            前方 {{ map.pointsMap[animateInfo.next] ? map.pointsMap[animateInfo.next].name : '未知点' }}
        </div>
        <div class="timestat">用时30秒 预计还需9分钟</div>
        <div class="actions">
            <el-button @click="animateState = false"> <fa-icon icon="times" /> 取消 </el-button>
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
            width: 80px;
            height: 90px;
            border: 0;
            svg {
                display: block;
                font-size: 30px;
                margin: 0 auto;
                margin-bottom: 4px;
            }
        }
    }

    .bigicon {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 79px;
        font-size: 55px;
        text-align: center;
        line-height: 90px;
    }

    .bigdesc {
        font-size: 26px;
        padding-top: 15px;
        padding-bottom: 3px;
        padding-left: 80px;
    }

    .timestat {
        font-size: 14px;
        color: #777;
        padding-left: 80px;
    }
}
</style>
