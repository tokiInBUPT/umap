import { reactive } from 'vue'
import { timeText } from './clock'

export const log = reactive([] as string[])
export function pushLog(str: string) {
    log.push(`[${timeText.value}] ${str}`)
}
