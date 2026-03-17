<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  queueStatus: {
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
  <el-card v-loading="loading" class="section-card queue-card" shadow="never">
    <div class="section-head queue-card__head">
      <div>
        <h3>队列状态</h3>
        <p>展示队列整体吞吐、失败任务与工作进程状态。</p>
      </div>

      <el-tag :type="statusTagType(queueStatus.statusTone)" effect="dark">
        {{ queueStatus.statusText }}
      </el-tag>
    </div>

    <div class="queue-card__metrics">
      <article>
        <span>每分钟任务</span>
        <strong>{{ queueStatus.jobsPerMinute }}</strong>
      </article>
      <article>
        <span>近期任务</span>
        <strong>{{ queueStatus.recentJobs }}</strong>
      </article>
      <article>
        <span>失败任务</span>
        <strong>{{ queueStatus.failedJobs }}</strong>
      </article>
      <article>
        <span>近周期失败</span>
        <strong>{{ queueStatus.failedPeriodJobs }}</strong>
      </article>
    </div>

    <div class="queue-card__footer">
      <div>
        <span>暂停 Master</span>
        <strong>{{ queueStatus.pausedMasters }}</strong>
      </div>
      <div>
        <span>活跃进程</span>
        <strong>{{ queueStatus.processes }}</strong>
      </div>
    </div>
  </el-card>
</template>
