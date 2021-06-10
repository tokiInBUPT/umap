import { computed, reactive } from 'vue'
import { mapPoint, edge, logicPosition, timeListItem } from './typings/map'
// @ts-ignore
import shahe_points from '@/data/shahe_point_06012334.json'
// @ts-ignore
import shahe_edges from '@/data/shahe_edge_06012334.json'
// @ts-ignore
import benbu_points from '@/data/benbu_point_06012334.json'
// @ts-ignore
import logic_position from '@/data/logicPosition.json'
// @ts-ignore
import busTimeList from '@/data/bus_time.json'
// @ts-ignore
import benbu_edges from '@/data/benbu_edge_06012334.json'
import { IRoute } from './typings/route'

import * as config from './config'

const M_CONFIG = ((<any>window)._M_CONFIG || {}) as {
    logicPosition: logicPosition[]
    busTimeList: timeListItem[]
}

export const bus = reactive({
    type: '',
    current: config.startPoint,
    hasTmpPoint: false,
    position: '',
    aroundLimit: 200,
    currentPosition: {
        lat: 0,
        lng: 0,
    },
    middle: new Set<string>(),
    map: {
        points: [...shahe_points, ...benbu_points] as mapPoint[],
        pointsMap: {} as Record<string, mapPoint>,
        edges: [...shahe_edges, ...benbu_edges] as edge[],
        edgeMap: {} as Record<string, edge>,
        logics: M_CONFIG.logicPosition ? M_CONFIG.logicPosition : (logic_position as logicPosition[]),
        busTimeList: M_CONFIG.busTimeList ? M_CONFIG.busTimeList : ([...busTimeList] as timeListItem[]),
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
        type: 0,
    },
    routes: [] as IRoute[],
    restaurantPersonCount: [10, 11, 15, 20, 25, 30],
    log: [] as string[],
})
for (const i of bus.map.points) {
    // @ts-ignore
    bus.map.pointsMap[i.id] = i
}
bus.currentPosition.lat = bus.map.pointsMap[config.startPoint].position.lat
bus.currentPosition.lng = bus.map.pointsMap[config.startPoint].position.lng
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
