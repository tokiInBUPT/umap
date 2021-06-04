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
    <el-popover placement="left" title="日志管理" :width="300" trigger="click">
        <div class="log">
            <el-input type="textarea" disabled :model-value="log.join('\r\n') || '暂无日志'" rows="15"></el-input>
            <el-button style="float: right; margin-top: 20px"> <fa-icon icon="file-download" /> 导出到文件 </el-button>
        </div>
        <template #reference>
            <el-button class="logButton">
                <fa-icon icon="print" />
            </el-button>
        </template>
    </el-popover>
</template>

<style lang="scss" scoped>
.logButton {
    position: absolute;
    padding: 0;
    width: 40px;
    right: 30px;
    top: 189px;
    z-index: 3;
}
.log {
    &::v-deep(.el-form-item) {
        margin-bottom: 0;
    }
    &::v-deep(.el-form-item__label) {
        padding-bottom: 0 !important;
        line-height: 20px;
    }
}
</style>
