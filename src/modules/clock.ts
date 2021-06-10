import { bus } from '@/bus'
import * as config from '@/config'
import { reactive, computed } from 'vue'
import { formatTime } from '@/utils/clock'
export const clock = reactive({
    clockBase: config.clockBase,
    clockOffset: 0,
    lastBaseUpdate: performance.now(),
    lastOffsetUpdate: performance.now(),
})
const updateClock = (now: DOMHighResTimeStamp) => {
    if (bus.animateState) {
        requestAnimationFrame(updateClock)
        return
    }
    clock.clockOffset += ((now - clock.lastOffsetUpdate) / 1000) * bus.speed.timeScale
    clock.clockOffset = clock.clockOffset % (3600 * 24)
    clock.lastOffsetUpdate = now
    requestAnimationFrame(updateClock)
}
requestAnimationFrame(updateClock)
export const timeText = computed(() => {
    return formatTime(clock.clockBase + clock.clockOffset)
})
