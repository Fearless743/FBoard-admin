<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  runtimeStatus: {
    type: Object,
    required: true,
  },
  systemLogs: {
    type: Object,
    required: true,
  },
})

function statusTagType(tone) {
  const typeMap = {
    danger: 'danger',
    success: 'success',
  }

  return typeMap[tone] || 'info'
}
</script>

<template>
  <el-card v-loading="loading" class="section-card system-log-card" shadow="never">
    <div class="section-head queue-card__head">
      <div>
        <h3>系统日志</h3>
        <p>展示调度器、Horizon 状态与日志级别分布。</p>
      </div>

      <div class="system-log-statuses">
        <el-tag :type="statusTagType(runtimeStatus.scheduleStatusTone)" effect="dark">
          Schedule {{ runtimeStatus.scheduleStatusText }}
        </el-tag>
        <el-tag :type="statusTagType(runtimeStatus.horizonStatusTone)" effect="dark">
          Horizon {{ runtimeStatus.horizonStatusText }}
        </el-tag>
      </div>
    </div>

    <div class="system-log-grid">
      <article class="system-log-item system-log-item--info">
        <span>信息</span>
        <strong>{{ systemLogs.info }}</strong>
      </article>

      <article class="system-log-item system-log-item--warning">
        <span>警告</span>
        <strong>{{ systemLogs.warning }}</strong>
      </article>

      <article class="system-log-item system-log-item--error">
        <span>错误</span>
        <strong>{{ systemLogs.error }}</strong>
      </article>
    </div>

    <div class="system-log-footer">
      <div>
        <span>总日志数</span>
        <strong>{{ systemLogs.total }}</strong>
      </div>

      <div>
        <span>最近调度</span>
        <strong>{{ runtimeStatus.scheduleLastRuntime }}</strong>
      </div>
    </div>
  </el-card>
</template>
