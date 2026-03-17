<script setup>
import DataTableCard from '../components/common/DataTableCard.vue'
import SectionCard from '../components/common/SectionCard.vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()

const orderColumns = [
  { label: '订单号', minWidth: 180, prop: 'orderNo' },
  { label: '用户邮箱', minWidth: 220, prop: 'userEmail' },
  { label: '套餐', prop: 'plan' },
  { label: '金额', prop: 'amount' },
  { label: '渠道', prop: 'gateway' },
  { label: '状态', slot: 'status' },
]
</script>

<template>
  <section class="page-stack">
    <SectionCard
      description="还原后台常见订单列表视图，保留用户、套餐、渠道与支付状态等核心字段。"
      title="订单列表"
    >
      <template #actions>
        <el-space wrap>
          <el-button class="ghost-btn small" type="info" plain>筛选订单</el-button>
          <el-button class="primary-btn small" type="success">导出对账</el-button>
        </el-space>
      </template>

      <DataTableCard :columns="orderColumns" :data="adminStore.orders">
        <template #status="{ row }">
          <el-tag :type="adminStore.badgeType(row.status)" effect="dark">
            {{ row.status }}
          </el-tag>
        </template>
      </DataTableCard>
    </SectionCard>
  </section>
</template>
