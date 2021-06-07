import { RpcProvider } from 'worker-rpc'
import { dijkstra } from '@/algorithm/Dij'
import { SA } from '@/algorithm/SA'
import { Ha } from '@/algorithm/Ha_byDij'
import { edgeMap, pointMap, mapPoint } from '@/typings/map'
onmessage = (e) => rpcProvider.dispatch(e.data)
const rpcProvider = new RpcProvider((message, transfer) => {
    // @ts-ignore
    postMessage(message, transfer)
})

const reg = rpcProvider.registerRpcHandler.bind(rpcProvider) as (id: string, cb: (payload: any) => any) => any

reg(
    'dijkstra',
    (params: {
        myEdgeMap: edgeMap
        myPointMap: pointMap
        startPoint: mapPoint
        endPoint: mapPoint
        /** distance: 0, time:1 */
        timeOrDis: number
        bike: number
    }) => {
        console.log('dijkstra in worker')
        return dijkstra(params)
    },
)
reg(
    'SA',
    (params: {
        myEdgeMap: edgeMap
        myPointMap: pointMap
        startPoint: mapPoint
        endPoint: mapPoint
        wayPointList: mapPoint[]
        /** distance: 0, time:1 */
        timeOrDis: number
        bike: number
    }) => {
        console.log('SA in worker')
        return SA(params)
    },
)

reg(
    'Ha',
    (params: {
        myEdgeMap: edgeMap
        myPointMap: pointMap
        startPoint: mapPoint
        endPoint: mapPoint
        wayPointList: mapPoint[]
        /** distance: 0, time:1 */
        timeOrDis: number
        bike: number
    }) => {
        console.log('Ha in worker')
        return Ha(params)
    },
)
