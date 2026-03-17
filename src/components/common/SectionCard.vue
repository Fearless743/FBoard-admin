<script setup>
defineProps({
  description: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <el-card class="section-card" shadow="never">
    <div class="section-head">
      <div>
        <h3>{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>

      <slot name="actions" />
    </div>

    <slot />
  </el-card>
</template>
