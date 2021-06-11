<script lang="ts">
/* eslint-disable max-depth */
import { defineComponent, ref, nextTick } from 'vue'
import MapView from './components/MapView.vue'
import SearchView from './components/SearchView.vue'
import AroundView from './components/AroundView.vue'
import NavigateView from './components/NavigateView.vue'
import gmView from './components/GMView.vue'
import logView from './components/LogView.vue'
import clockView from './components/ClockView.vue'
import { bus } from '@/bus'
import { pushLog } from './modules/log'
export default defineComponent({
    components: {
        MapView,
        AroundView,
        SearchView,
        NavigateView,
        gmView,
        logView,
        clockView,
    },
    setup() {
        const searchView = ref(null as any)
        async function updateRoutes() {
            pushLog('传送')
            await nextTick()
            if (bus.current !== 'tmp-point') {
                if (bus.hasTmpPoint) {
                    bus.map.points.splice(bus.map.points.indexOf(bus.map.pointsMap['tmp-point']), 1)
                    delete bus.map.pointsMap['tmp-point']
                    bus.map.edges.splice(bus.map.edges.indexOf(bus.map.edgeMap['tmp-edge-1']), 1)
                    delete bus.map.edgeMap['tmp-edge-1']
                    bus.map.edges.splice(bus.map.edges.indexOf(bus.map.edgeMap['tmp-edge-2']), 1)
                    delete bus.map.edgeMap['tmp-edge-2']
                    if (bus.map.edgeMap['tmp-edge-3']) {
                        bus.map.edges.splice(bus.map.edges.indexOf(bus.map.edgeMap['tmp-edge-3']), 1)
                        delete bus.map.edgeMap['tmp-edge-3']
                        bus.map.edges.splice(bus.map.edges.indexOf(bus.map.edgeMap['tmp-edge-4']), 1)
                        delete bus.map.edgeMap['tmp-edge-4']
                    }
                    bus.hasTmpPoint = false
                    for (let i in bus.map.pointsMap) {
                        if (bus.map.pointsMap.hasOwnProperty(i)) {
                            const j = bus.map.pointsMap[i]
                            for (let k of j.neighborWalk) {
                                if (k.toPointId === 'tmp-point') {
                                    bus.map.pointsMap[i].neighborWalk.splice(
                                        bus.map.pointsMap[i].neighborWalk.indexOf(k),
                                    )
                                }
                            }
                            for (let k of j.neighborBike) {
                                if (k.toPointId === 'tmp-point') {
                                    bus.map.pointsMap[i].neighborBike.splice(
                                        bus.map.pointsMap[i].neighborBike.indexOf(k),
                                    )
                                }
                            }
                        }
                    }
                    for (let i of bus.map.points) {
                        for (let k of i.neighborWalk) {
                            if (k.toPointId === 'tmp-point') {
                                i.neighborWalk.splice(i.neighborWalk.indexOf(k))
                            }
                        }
                        for (let k of i.neighborBike) {
                            if (k.toPointId === 'tmp-point') {
                                i.neighborBike.splice(i.neighborBike.indexOf(k))
                            }
                        }
                    }
                }
            }
            bus.animateState = false
            searchView.value?.updateRoutes()
        }
        function onReady() {
            document.getElementById('loader')?.classList.add('hide')
            document.getElementById('app')?.classList.remove('hide')
        }
        return {
            onReady,
            searchView,
            updateRoutes,
        }
    },
})
</script>
<template>
    <map-view @ready="onReady" />
    <gm-view @updateRoutes="updateRoutes" />
    <log-view />
    <around-view />
    <search-view ref="searchView" />
    <clock-view />
    <navigate-view @updateRoutes="updateRoutes" />
</template>

<style lang="scss"></style>
