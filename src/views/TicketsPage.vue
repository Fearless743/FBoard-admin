<script setup>
import DataTableCard from '../components/common/DataTableCard.vue'
import SectionCard from '../components/common/SectionCard.vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()

const ticketColumns = [
  { label: '工单号', prop: 'id' },
  { label: '主题', minWidth: 220, prop: 'subject' },
  { label: '用户邮箱', minWidth: 220, prop: 'userEmail' },
  { label: '优先级', slot: 'priority' },
  { label: '最近更新', prop: 'updatedAt' },
  { label: '状态', slot: 'status' },
]
</script>

<template>
  <section class="page-stack">
    <SectionCard
      description="工单页采用更贴近运营后台的列表结构，便于后续加入会话详情抽屉和客服分配。"
      title="工单列表"
    >
      <template #actions>
        <el-space wrap>
          <el-button class="ghost-btn small" type="info" plain>仅看未处理</el-button>
          <el-button class="primary-btn small" type="success">分配客服</el-button>
        </el-space>
      </template>

      <DataTableCard :columns="ticketColumns" :data="adminStore.tickets">
        <template #priority="{ row }">
          <el-tag :type="adminStore.badgeType(row.priority)" effect="dark">
            {{ row.priority }}
          </el-tag>
        </template>

        <template #status="{ row }">
          <el-tag :type="adminStore.badgeType(row.status)" effect="dark">
            {{ row.status }}
          </el-tag>
        </template>
      </DataTableCard>
    </SectionCard>
  </section>
</template>
