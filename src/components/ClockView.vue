<script lang="ts">
import { clock } from '@/bus'
import { computed, defineComponent } from 'vue'
function formatTime(value: number) {
    const result = value % (3600 * 24)
    const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
    const m =
        Math.floor((result / 60) % 60) < 10 ? '0' + Math.floor((result / 60) % 60) : Math.floor((result / 60) % 60)
    const s = Math.floor(result % 60) < 10 ? '0' + Math.floor(result % 60) : Math.floor(result % 60)
    return `${h}:${m}:${s}`
}
export default defineComponent({
    setup() {
        const timeText = computed(() => {
            return formatTime(clock.clockBase + clock.clockOffset)
        })
        return {
            timeText,
        }
    },
})
</script>
<template>
    <div class="clock">{{ timeText }}</div>
</template>

<style lang="scss" scoped>
.clock {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 5;
    font-size: 22px;
    font-family: Consolas, monospace;
    opacity: 0.5;
}
</style>
