<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  jobDetail: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <el-card v-loading="loading" class="section-card queue-card" shadow="never">
    <div class="section-head queue-card__head">
      <div>
        <h3>作业详情</h3>
        <p>展示最耗时队列、吞吐最高队列以及等待任务信息。</p>
      </div>
    </div>

    <div class="queue-detail-grid">
      <article class="queue-detail-item queue-detail-item--wide">
        <span>运行时间最长队列</span>
        <strong>{{ jobDetail.queueWithMaxRuntime }}</strong>
      </article>

      <article class="queue-detail-item queue-detail-item--wide">
        <span>吞吐最高队列</span>
        <strong>{{ jobDetail.queueWithMaxThroughput }}</strong>
      </article>

      <article class="queue-detail-item">
        <span>online_sync 等待数</span>
        <strong>{{ jobDetail.redisOnlineSyncWait }}</strong>
      </article>

      <article class="queue-detail-item">
        <span>近周期任务数</span>
        <strong>{{ jobDetail.recentPeriodJobs }}</strong>
      </article>
    </div>
  </el-card>
</template>
