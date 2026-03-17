<script setup>
import DataTableCard from '../components/common/DataTableCard.vue'
import SectionCard from '../components/common/SectionCard.vue'
import MetricsGrid from '../components/dashboard/MetricsGrid.vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()

const planColumns = [
  { label: '套餐名称', prop: 'name' },
  { label: '流量', prop: 'transfer' },
  { label: '价格', prop: 'price' },
  { label: '周期', prop: 'cycle' },
  { label: '状态', slot: 'status' },
]

const planMetrics = adminStore.metrics.slice(0, 3)
</script>

<template>
  <section class="page-stack">
    <MetricsGrid :metrics="planMetrics" />

    <SectionCard
      description="集中展示套餐价格、周期与销售状态，方便继续拆出新增/编辑弹窗。"
      title="套餐列表"
    >
      <template #actions>
        <el-button class="primary-btn small" type="success">新建套餐</el-button>
      </template>

      <DataTableCard :columns="planColumns" :data="adminStore.plans">
        <template #status="{ row }">
          <el-tag :type="adminStore.badgeType(row.status)" effect="dark">
            {{ row.status }}
          </el-tag>
        </template>
      </DataTableCard>
    </SectionCard>
  </section>
</template>
