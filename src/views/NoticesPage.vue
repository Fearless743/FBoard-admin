<script setup>
import DataTableCard from '../components/common/DataTableCard.vue'
import SectionCard from '../components/common/SectionCard.vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()

const noticeColumns = [
  { label: '公告标题', minWidth: 240, prop: 'title' },
  { label: '可见范围', prop: 'audience' },
  { label: '发布时间', minWidth: 180, prop: 'publishAt' },
  { label: '状态', slot: 'status' },
]
</script>

<template>
  <section class="page-stack">
    <SectionCard
      description="公告页补齐了内容运营入口，让后台更接近原始 V2Board 的管理操作节奏。"
      title="公告列表"
    >
      <template #actions>
        <el-space wrap>
          <el-button class="ghost-btn small" type="info" plain>草稿箱</el-button>
          <el-button class="primary-btn small" type="success">发布公告</el-button>
        </el-space>
      </template>

      <DataTableCard :columns="noticeColumns" :data="adminStore.notices">
        <template #status="{ row }">
          <el-tag :type="adminStore.badgeType(row.status)" effect="dark">
            {{ row.status }}
          </el-tag>
        </template>
      </DataTableCard>
    </SectionCard>
  </section>
</template>
