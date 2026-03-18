<script setup>
import { useI18n } from "vue-i18n";
const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: "节点流量排行",
    },
    emptyText: {
        type: String,
        default: "暂无流量排行数据",
    },
    rankData: {
        type: Object,
        required: true,
    },
});

const { t } = useI18n();

function progressWidth(value, maxValue) {
    if (!maxValue) {
        return "0%";
    }

    const percent = (value / maxValue) * 100;
    return `${Math.max(percent, 8)}%`;
}

function changeClass(change) {
    if (change > 0) {
        return "up";
    }

    if (change < 0) {
        return "down";
    }

    return "flat";
}
</script>

<template>
    <el-card
        v-loading="loading"
        class="section-card traffic-rank-card"
        shadow="never"
    >
        <div class="section-head traffic-rank-head">
            <div>
                <h3>{{ title }}</h3>
            </div>
            <span class="traffic-rank-badge">{{
                t("traffic.topLabel", { count: rankData.list.length })
            }}</span>
        </div>

        <div v-if="rankData.list.length" class="traffic-rank-list">
            <div
                v-for="item in rankData.list"
                :key="item.id"
                class="traffic-rank-item"
            >
                <div class="traffic-rank-meta">
                    <span class="traffic-rank-index">{{
                        String(item.rank).padStart(2, "0")
                    }}</span>
                    <div class="traffic-rank-copy">
                        <strong>{{ item.name }}</strong>
                        <small>{{
                            t("traffic.previousLabel", {
                                value: item.previousTrafficText,
                            })
                        }}</small>
                    </div>
                </div>

                <div class="traffic-rank-data">
                    <div class="traffic-rank-values">
                        <strong>{{ item.trafficText }}</strong>
                        <span
                            class="traffic-rank-change"
                            :class="changeClass(item.change)"
                        >
                            {{ item.changeText }}
                        </span>
                    </div>

                    <div class="traffic-rank-bar">
                        <span
                            class="traffic-rank-bar-fill"
                            :style="{
                                width: progressWidth(
                                    item.value,
                                    rankData.list[0]?.value || 0,
                                ),
                            }"
                        ></span>
                    </div>
                </div>
            </div>
        </div>

        <el-empty
            v-else
            :image-size="72"
            class="traffic-rank-empty"
            :description="emptyText"
        />
    </el-card>
</template>
