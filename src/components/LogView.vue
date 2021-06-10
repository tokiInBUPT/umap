<script lang="ts">
import { log } from '@/modules/log'
import { defineComponent, nextTick, ref, watch } from 'vue'

export default defineComponent({
    setup() {
        const logbox = ref(null)
        watch(
            () => log,
            async () => {
                if (!logbox.value) return
                await nextTick()
                const ul = (logbox.value as unknown) as HTMLUListElement
                ul.scrollTop = ul.scrollHeight * 100
            },
            {
                deep: true,
            },
        )
        function exportFile() {
            const p = log.join('\r\n')
            const a = document.createElement('a')
            a.href = `data:text/plain,${p}`
            a.download = 'Log.txt'
            a.click()
        }
        return {
            log,
            logbox,
            exportFile,
        }
    },
})
</script>
<template>
    <el-popover placement="left" title="日志管理" :width="500" trigger="click">
        <div class="log">
            <el-empty v-show="log.length <= 0" description="暂无日志"></el-empty>
            <ul v-show="log.length > 0" ref="logbox" class="logbox">
                <li v-for="(i, a) in log" :key="a">
                    {{ i }}
                </li>
            </ul>
            <el-button style="float: right; margin-top: 20px" @click="exportFile">
                <fa-icon icon="file-download" /> 导出到文件
            </el-button>
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
    height: 400px;
    .el-empty,
    .logbox {
        margin: 0;
        height: 350px;
    }
    &::v-deep(.el-form-item) {
        margin-bottom: 0;
    }
    &::v-deep(.el-form-item__label) {
        padding-bottom: 0 !important;
        line-height: 20px;
    }
    .logbox {
        margin: 0;
        padding: 0;
        list-style: none;
        overflow-y: scroll;
        li {
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
    }
}
</style>
