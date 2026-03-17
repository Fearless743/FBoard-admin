<script setup>
import SectionCard from '../components/common/SectionCard.vue'
import SettingsForm from '../components/settings/SettingsForm.vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()
</script>

<template>
  <section class="page-stack">
    <SectionCard
      description="将系统参数集中到统一的 Element Plus 表单结构中，方便后续对接真实配置 API。"
      title="站点基础配置"
    >
      <template #actions>
        <el-button class="primary-btn small" type="success">保存配置</el-button>
      </template>

      <SettingsForm
        :config-fields="adminStore.configFields"
        :form="adminStore.configForm"
        :switch-fields="adminStore.switchFields"
      />
    </SectionCard>
  </section>
</template>
