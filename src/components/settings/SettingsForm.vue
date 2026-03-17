<script setup>
defineProps({
  configFields: {
    type: Array,
    required: true,
  },
  form: {
    type: Object,
    required: true,
  },
  switchFields: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <el-form :model="form" label-position="top" class="config-form">
    <div class="form-grid">
      <el-form-item
        v-for="field in configFields"
        :key="field.label"
        :label="field.label"
      >
        <el-input v-model="form[field.key]" />
      </el-form-item>

      <div
        v-for="item in switchFields"
        :key="item.label"
        class="switch-row"
      >
        <span>{{ item.label }}</span>
        <el-switch v-model="form[item.key]" />
      </div>
    </div>
  </el-form>
</template>
