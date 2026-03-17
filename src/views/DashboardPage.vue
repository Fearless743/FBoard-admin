<script setup>
import { onMounted } from 'vue'

import IncomeOverviewCard from '../components/dashboard/IncomeOverviewCard.vue'
import JobDetailCard from '../components/dashboard/JobDetailCard.vue'
import MetricsGrid from '../components/dashboard/MetricsGrid.vue'
import QueueStatusCard from '../components/dashboard/QueueStatusCard.vue'
import SystemLogCard from '../components/dashboard/SystemLogCard.vue'
import TrafficRankCard from '../components/dashboard/TrafficRankCard.vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()

function handleIncomeRangeChange(rangeSelection) {
  if (typeof rangeSelection === 'string') {
    adminStore.loadIncomeOverview({ key: rangeSelection })
    return
  }

  adminStore.loadIncomeOverview(rangeSelection)
}

onMounted(function loadStatsOnMount() {
  adminStore.loadDashboardStats()
  adminStore.loadIncomeOverview()
  adminStore.loadNodeTrafficRank()
  adminStore.loadQueueStats()
  adminStore.loadSystemStatus()
  adminStore.loadUserTrafficRank()
  adminStore.loadUserInfo()
})
</script>

<template>
  <section class="page-stack">
    <el-alert
      v-if="adminStore.dashboardStatsError"
      :closable="false"
      class="dashboard-alert"
      show-icon
      title="仪表盘统计接口加载失败，当前显示默认占位数据"
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
        title="收入概览接口加载失败，当前显示空图表占位"
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
        title="节点流量排行接口加载失败，当前显示空状态占位"
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
          description="按当前时间范围统计节点消耗流量"
          empty-text="暂无节点流量排行数据"
          title="节点流量排行"
        />

        <div class="page-stack compact-stack">
          <el-alert
            v-if="adminStore.userTrafficRankError"
            :closable="false"
            class="dashboard-alert"
            show-icon
            title="用户流量排行接口加载失败，当前显示空状态占位"
            type="warning"
          >
            <template #default>
              {{ adminStore.userTrafficRankError }}
            </template>
          </el-alert>

          <TrafficRankCard
            :loading="adminStore.userTrafficRankLoading"
            :rank-data="adminStore.userTrafficRank"
            description="按当前时间范围统计用户消耗流量"
            empty-text="暂无用户流量排行数据"
            title="用户流量排行"
          />
        </div>
      </div>

      <el-alert
        v-if="adminStore.queueStatsError"
        :closable="false"
        class="dashboard-alert"
        show-icon
        title="队列状态接口加载失败，当前显示默认占位数据"
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
        title="系统状态接口加载失败，当前显示默认占位数据"
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
