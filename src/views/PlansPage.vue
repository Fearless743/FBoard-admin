<script setup>
import DataTableCard from '../components/common/DataTableCard.vue'
import SectionCard from '../components/common/SectionCard.vue'
import MetricsGrid from '../components/dashboard/MetricsGrid.vue'
import { useI18n } from 'vue-i18n'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()
const { t } = useI18n()

const planColumns = [
  { label: t('plans.columns.name'), prop: 'name' },
  { label: t('plans.columns.transfer'), prop: 'transfer' },
  { label: t('plans.columns.price'), prop: 'price' },
  { label: t('plans.columns.cycle'), prop: 'cycle' },
  { label: t('plans.columns.status'), slot: 'status' },
]

const planMetrics = adminStore.dashboardMetrics.slice(0, 3)
</script>

<template>
  <section class="page-stack">
    <MetricsGrid :metrics="planMetrics" />

    <SectionCard :description="t('plans.description')" :title="t('plans.title')">
      <template #actions>
        <el-button class="primary-btn small" type="success">
          {{ t('plans.create') }}
        </el-button>
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
