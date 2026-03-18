<script setup>
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";

import IncomeOverviewCard from "../components/dashboard/IncomeOverviewCard.vue";
import JobDetailCard from "../components/dashboard/JobDetailCard.vue";
import MetricsGrid from "../components/dashboard/MetricsGrid.vue";
import QueueStatusCard from "../components/dashboard/QueueStatusCard.vue";
import SystemLogCard from "../components/dashboard/SystemLogCard.vue";
import TrafficRankCard from "../components/dashboard/TrafficRankCard.vue";
import { useAdminStore } from "../stores/admin";

const adminStore = useAdminStore();
const { t } = useI18n();

function handleIncomeRangeChange(rangeSelection) {
    if (typeof rangeSelection === "string") {
        adminStore.loadIncomeOverview({ key: rangeSelection });
        return;
    }

    adminStore.loadIncomeOverview(rangeSelection);
}

onMounted(function loadStatsOnMount() {
    adminStore.loadDashboardStats();
    adminStore.loadIncomeOverview();
    adminStore.loadNodeTrafficRank();
    adminStore.loadQueueStats();
    adminStore.loadSystemStatus();
    adminStore.loadUserTrafficRank();
    adminStore.loadUserInfo();
});
</script>

<template>
    <section class="page-stack">
        <el-alert
            v-if="adminStore.dashboardStatsError"
            :closable="false"
            class="dashboard-alert"
            show-icon
            :title="t('dashboard.statsError')"
            type="warning"
        >
            <template #default>
                {{ adminStore.dashboardStatsError }}
            </template>
        </el-alert>

        <MetricsGrid
            :loading="adminStore.dashboardStatsLoading"
            :metrics="adminStore.dashboardMetrics"
        />

        <section class="hero-grid">
            <el-alert
                v-if="adminStore.incomeOverviewError"
                :closable="false"
                class="dashboard-alert"
                show-icon
                :title="t('dashboard.incomeError')"
                type="warning"
            >
                <template #default>
                    {{ adminStore.incomeOverviewError }}
                </template>
            </el-alert>

            <IncomeOverviewCard
                :loading="adminStore.incomeOverviewLoading"
                :overview="adminStore.incomeOverview"
                :range="adminStore.incomeOverviewRange"
                @change-range="handleIncomeRangeChange"
            />

            <el-alert
                v-if="adminStore.nodeTrafficRankError"
                :closable="false"
                class="dashboard-alert"
                show-icon
                :title="t('dashboard.nodeTrafficError')"
                type="warning"
            >
                <template #default>
                    {{ adminStore.nodeTrafficRankError }}
                </template>
            </el-alert>

            <div class="traffic-rank-grid">
                <TrafficRankCard
                    :loading="adminStore.nodeTrafficRankLoading"
                    :rank-data="adminStore.nodeTrafficRank"
                    :empty-text="t('traffic.emptyNode')"
                    :title="t('traffic.nodeTitle')"
                />

                <div class="page-stack compact-stack">
                    <el-alert
                        v-if="adminStore.userTrafficRankError"
                        :closable="false"
                        class="dashboard-alert"
                        show-icon
                        :title="t('dashboard.userTrafficError')"
                        type="warning"
                    >
                        <template #default>
                            {{ adminStore.userTrafficRankError }}
                        </template>
                    </el-alert>

                    <TrafficRankCard
                        :loading="adminStore.userTrafficRankLoading"
                        :rank-data="adminStore.userTrafficRank"
                        :empty-text="t('traffic.emptyUser')"
                        :title="t('traffic.userTitle')"
                    />
                </div>
            </div>

            <el-alert
                v-if="adminStore.queueStatsError"
                :closable="false"
                class="dashboard-alert"
                show-icon
                :title="t('dashboard.queueError')"
                type="warning"
            >
                <template #default>
                    {{ adminStore.queueStatsError }}
                </template>
            </el-alert>

            <div class="queue-card-grid">
                <QueueStatusCard
                    :loading="adminStore.queueStatsLoading"
                    :queue-status="adminStore.queueStats.queueStatus"
                />

                <JobDetailCard
                    :job-detail="adminStore.queueStats.jobDetail"
                    :loading="adminStore.queueStatsLoading"
                />
            </div>

            <el-alert
                v-if="adminStore.systemStatusError"
                :closable="false"
                class="dashboard-alert"
                show-icon
                :title="t('dashboard.systemError')"
                type="warning"
            >
                <template #default>
                    {{ adminStore.systemStatusError }}
                </template>
            </el-alert>

            <SystemLogCard
                :loading="adminStore.systemStatusLoading"
                :runtime-status="adminStore.systemStatus.runtimeStatus"
                :system-logs="adminStore.systemStatus.systemLogs"
            />
        </section>
    </section>
</template>
