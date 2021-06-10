<script lang="ts">
import { bus } from '@/bus'
import { defineComponent } from 'vue'

export default defineComponent({
    emits: ['updateRoutes'],
    setup() {
        return bus
    },
})
</script>
<template>
    <el-popover placement="left" title="上帝模式" :width="300" trigger="click">
        <div class="gm">
            <el-form label-position="top">
                <el-form-item label="传送">
                    <el-select
                        model-value=""
                        filterable
                        placeholder="请选择传送点"
                        @change=";(current = $event) && $emit('updateRoutes')"
                    >
                        <el-option v-for="item in map.points" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间倍率">
                    <el-slider v-model="speed.timeScale" :min="10" :max="200" show-input></el-slider>
                </el-form-item>
                <el-form-item label="查询范围(m)">
                    <el-slider v-model="aroundLimit" :min="10" :max="10000" show-input></el-slider>
                </el-form-item>
                <el-form-item label="学一食堂人数">
                    <el-slider v-model="restaurantPersonCount[0]" :max="50" show-input></el-slider>
                </el-form-item>
                <el-form-item label="学三食堂人数">
                    <el-slider v-model="restaurantPersonCount[1]" :max="50" show-input></el-slider>
                </el-form-item>
                <el-form-item label="教二食堂人数">
                    <el-slider v-model="restaurantPersonCount[2]" :max="50" show-input></el-slider>
                </el-form-item>
                <el-form-item label="教三食堂人数">
                    <el-slider v-model="restaurantPersonCount[3]" :max="50" show-input></el-slider>
                </el-form-item>
                <el-form-item label="教四食堂人数">
                    <el-slider v-model="restaurantPersonCount[4]" :max="50" show-input></el-slider>
                </el-form-item>
                <el-form-item label="教五食堂人数">
                    <el-slider v-model="restaurantPersonCount[5]" :max="50" show-input></el-slider>
                </el-form-item>
            </el-form>
        </div>
        <template #reference>
            <el-button class="gmButton">GM</el-button>
        </template>
    </el-popover>
</template>

<style lang="scss" scoped>
.gmButton {
    position: absolute;
    padding: 0;
    width: 40px;
    right: 30px;
    top: 240px;
    z-index: 3;
}
.gm {
    &::v-deep(.el-form-item) {
        margin-bottom: 0;
    }
    &::v-deep(.el-form-item__label) {
        padding-bottom: 0 !important;
        line-height: 20px;
    }
}
</style>
