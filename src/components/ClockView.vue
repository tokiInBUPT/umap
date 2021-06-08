<script lang="ts">
import { clock, timeText } from '@/bus'
import { computed, defineComponent, onMounted, Ref, ref, watch } from 'vue'

export default defineComponent({
    setup() {
        const canvas: Ref<null | HTMLCanvasElement> = ref(null)
        onMounted(() => {
            if (!canvas.value) return
            const ctx = canvas.value.getContext('2d')
            if (!ctx) return
            ctx.strokeStyle = '#000'
            ctx.font = '45px Consolas'
            ctx.fillText('00:00:00', 0, 40)
        })
        watch([() => clock.clockBase, () => clock.clockOffset], () => {
            if (!canvas.value) return
            const ctx = canvas.value.getContext('2d')
            if (!ctx) return
            ctx.clearRect(0, 0, 200, 50)
            ctx.fillText(timeText.value, 0, 40)
        })
        return {
            canvas,
        }
    },
})
</script>
<template>
    <canvas ref="canvas" class="clock" width="200" height="50"></canvas>
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
    width: 100px;
    height: 25px;
}
</style>
