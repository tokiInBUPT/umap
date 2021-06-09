import { computed, reactive } from 'vue'
import { mapPoint, edge, logicPosition } from './typings/map'
// @ts-ignore
import shahe_points from '@/data/shahe_point_06012334.json'
// @ts-ignore
import shahe_edges from '@/data/shahe_edge_06012334.json'
// @ts-ignore
import benbu_points from '@/data/benbu_point_06012334.json'
// @ts-ignore
import logic_position from '@/data/logicPosition.json'
// @ts-ignore
import benbu_edges from '@/data/benbu_edge_06012334.json'
import { IRoute } from './typings/route'
import { formatTime } from './utils/clock'

import * as config from './config'

export const bus = reactive({
    type: '',
    current: config.startPoint,
    position: '',
    middle: new Set<string>(),
    map: {
        points: [...shahe_points, ...benbu_points] as mapPoint[],
        pointsMap: {} as Record<string, mapPoint>,
        edges: [...shahe_edges, ...benbu_edges] as edge[],
        edgeMap: {} as Record<string, edge>,
        logics: logic_position as logicPosition[],
    },
    speed: {
        ...config.speed,
        timeScale: config.defaultTimeScale,
    },
    activeRoute: null as IRoute | null,
    animateState: false,
    animateInfo: {
        paused: false,
        current: '',
        next: '',
        edge: '',
        totalTime: 0,
    },
    routes: [] as IRoute[],
    restaurantPersonCount: [10, 11, 15, 20, 25, 30],
    log: [] as string[],
})
for (const i of bus.map.points) {
    // @ts-ignore
    bus.map.pointsMap[i.id] = i
}
for (const i of bus.map.edges) {
    // @ts-ignore
    bus.map.edgeMap[i.id] = i
}
export const currentPoint = computed(() => {
    return bus.map.pointsMap[bus.current]
})

export const realPosition = computed(() => {
    return bus.position.split('@')[0]
})

export const clock = reactive({
    clockBase: config.clockBase,
    clockOffset: 0,
    lastBaseUpdate: performance.now(),
    lastOffsetUpdate: performance.now(),
})
const updateClock = () => {
    if (bus.animateState) {
        requestAnimationFrame(updateClock)
        return
    }
    const now = performance.now()
    clock.clockOffset += ((now - clock.lastOffsetUpdate) / 1000) * bus.speed.timeScale
    clock.clockOffset = clock.clockOffset % (3600 * 24)
    clock.lastOffsetUpdate = now
    requestAnimationFrame(updateClock)
}
requestAnimationFrame(updateClock)
export const timeText = computed(() => {
    return formatTime(clock.clockBase + clock.clockOffset)
})

export function pushLog(str: string) {
    bus.log.push(`[${timeText.value}] ${str}`)
}
