import { computed, reactive } from 'vue'
import { mapPoint, edge } from './typings/map'
// @ts-ignore
import shahe_points from '@/data/shahe_point_06012334.json'
// @ts-ignore
import shahe_edges from '@/data/shahe_edge_06012334.json'
import { IRoute } from './typings/route'

export const bus = reactive({
    type: '',
    current: 'd08cf367-be23-4c1d-a256-db4d8274ad60',
    position: '',
    middle: new Set(),
    map: {
        points: [...shahe_points] as mapPoint[],
        pointsMap: {} as Record<string, mapPoint>,
        edges: [...shahe_edges] as edge[],
        edgeMap: {} as Record<string, edge>,
    },
    speed: {
        walk: 15,
        bike: 30,
        bus: 300,
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
