<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <el-table :data="data" v-loading="loading" class="dashboard-table">
    <template v-for="column in columns" :key="column.prop ?? column.label">
      <el-table-column
        v-if="!column.slot"
        :label="column.label"
        :min-width="column.minWidth"
        :prop="column.prop"
      />
      <el-table-column
        v-else
        :label="column.label"
        :min-width="column.minWidth"
      >
        <template #default="scope">
          <slot :name="column.slot" :row="scope.row" />
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>
