<script setup>
import DataTableCard from '../components/common/DataTableCard.vue'
import SectionCard from '../components/common/SectionCard.vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()

const userColumns = [
  { label: '邮箱', minWidth: 220, prop: 'email' },
  { label: '套餐', prop: 'plan' },
  { label: '余额', prop: 'balance' },
  { label: '状态', slot: 'status' },
]
</script>

<template>
  <section class="page-stack">
    <SectionCard
      description="统一用户列表、订阅套餐与余额状态，为后续接搜索筛选和操作列预留结构。"
      title="用户列表"
    >
      <template #actions>
        <el-button class="ghost-btn small" type="info" plain>批量导出</el-button>
      </template>

      <DataTableCard :columns="userColumns" :data="adminStore.users">
        <template #status="{ row }">
          <el-tag :type="adminStore.badgeType(row.status)" effect="dark">
            {{ row.status }}
          </el-tag>
        </template>
      </DataTableCard>
    </SectionCard>
  </section>
</template>
