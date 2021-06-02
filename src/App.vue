<script lang="ts">
import { defineComponent } from 'vue'
import MapView from './components/MapView.vue'
import SearchView from './components/SearchView.vue'
import AroundView from './components/AroundView.vue'
import NavigateView from './components/NavigateView.vue'
import gmView from './components/GMView.vue'
import logView from './components/LogView.vue'
export default defineComponent({
    components: {
        MapView,
        AroundView,
        SearchView,
        NavigateView,
        gmView,
        logView,
    },
    setup() {
        return {}
    },
})
</script>
<template>
    <map-view />
    <gm-view />
    <log-view />
    <around-view />
    <search-view />
    <navigate-view />
</template>

<style lang="scss"></style>
