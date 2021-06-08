import { computed, reactive } from 'vue'
import { mapPoint, edge } from './typings/map'
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
import { logicPosition } from './algorithm/typing'
import { formatTime } from './utils/clock'

export const bus = reactive({
    type: '',
    current: 'd08cf367-be23-4c1d-a256-db4d8274ad60',
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
        walk: 1.4,
        bike: 5,
        bus: 16,
        timeScale: 60,
    },
    activeRoute: null as IRoute | null,
    animateState: false,
    animateInfo: {
        paused: false,
        current: '',
        next: '',
        totalTime: 0,
    },
    routes: [] as IRoute[],
    routes_: [
        {
            name: '最短距离',
            desc: '约100米',
        },
        {
            name: '最短时间',
            desc: '约十分钟',
        },
        {
            name: '骑车最快',
            desc: '约五分钟',
        },
    ],
    restaurantPersonCount: [10, 11, 15, 20],
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

export const clock = reactive({
    clockBase: 3600 * 23,
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
