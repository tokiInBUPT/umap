<script lang="ts">
import { defineComponent, ref, nextTick } from 'vue'
import MapView from './components/MapView.vue'
import SearchView from './components/SearchView.vue'
import AroundView from './components/AroundView.vue'
import NavigateView from './components/NavigateView.vue'
import gmView from './components/GMView.vue'
import logView from './components/LogView.vue'
import clockView from './components/ClockView.vue'
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
            await nextTick()
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
    <navigate-view />
</template>

<style lang="scss"></style>
