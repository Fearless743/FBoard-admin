<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="activity-list">
    <div
      v-for="item in items"
      :key="item.title"
      class="activity-item"
    >
      <span class="activity-dot" :class="item.tone"></span>
      <div>
        <strong>{{ item.title }}</strong>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>
