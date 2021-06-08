/* eslint-disable max-params */
import { edgeMap, pointMap, mapPoint } from '@/typings/map'
import Worker from 'worker-loader?inline=no-fallback!./worker'
import { RpcProvider } from 'worker-rpc'
const worker = new Worker()
const rpcProvider = new RpcProvider((message, transfer) => {
    // @ts-ignore
    worker.postMessage(message, transfer)
})
worker.onmessage = (e) => rpcProvider.dispatch(e.data)
export async function dijkstra(
    myEdgeMap: edgeMap,
    myPointMap: pointMap,
    startPoint: mapPoint,
    endPoint: mapPoint,
    /** distance: 0, time:1 */
    timeOrDis: number,
    bike: number,
): Promise<[number, string[], string[], number[]]> {
    return await rpcProvider.rpc(
        'dijkstra',
        JSON.parse(
            JSON.stringify({
                myEdgeMap,
                myPointMap,
                startPoint,
                endPoint,
                timeOrDis,
                bike,
            }),
        ),
    )
}

export async function SA(
    myEdgeMap: edgeMap,
    myPointMap: pointMap,
    startPoint: mapPoint,
    endPoint: mapPoint,
    wayPointList: mapPoint[],
    /** distance: 0, time:1 */
    timeOrDis: number,
    bike: number,
): Promise<[number, string[], string[], number[]]> {
    return await rpcProvider.rpc(
        'SA',
        JSON.parse(
            JSON.stringify({
                myEdgeMap,
                myPointMap,
                startPoint,
                wayPointList,
                endPoint,
                timeOrDis,
                bike,
            }),
        ),
    )
}

export async function Ha(
    myEdgeMap: edgeMap,
    myPointMap: pointMap,
    startPoint: mapPoint,
    endPoint: mapPoint,
    wayPointList: mapPoint[],
    /** distance: 0, time:1 */
    timeOrDis: number,
    bike: number,
): Promise<[number, string[], string[], number[]]> {
    return await rpcProvider.rpc(
        'Ha',
        JSON.parse(
            JSON.stringify({
                myEdgeMap,
                myPointMap,
                startPoint,
                wayPointList,
                endPoint,
                timeOrDis,
                bike,
            }),
        ),
    )
}
