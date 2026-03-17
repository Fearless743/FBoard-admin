<script setup>
import {
  Coin,
  Connection,
  DataLine,
  Download,
  Money,
  Monitor,
  Tickets,
  Upload,
  User,
  UserFilled,
} from '@element-plus/icons-vue'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  metrics: {
    type: Array,
    required: true,
  },
})

const metricIconMap = {
  收入: Coin,
  佣金: Money,
  工单: Tickets,
  用户: User,
  上传: Upload,
  下载: Download,
  节点: Connection,
  设备: Monitor,
  流量: DataLine,
}

function resolveMetricIcon(label) {
  const matchedKeyword = Object.keys(metricIconMap).find(function findKeyword(keyword) {
    return String(label || '').includes(keyword)
  })

  return matchedKeyword ? metricIconMap[matchedKeyword] : UserFilled
}

function resolveTrendClass(changeText) {
  const text = String(changeText || '')

  if (text.includes('↑') || text.includes('+')) {
    return 'up'
  }

  if (text.includes('↘') || text.includes('-')) {
    return 'down'
  }

  return 'neutral'
}

function resolveTrendText(changeText) {
  const state = resolveTrendClass(changeText)

  if (state === 'up') {
    return '上升'
  }

  if (state === 'down') {
    return '下降'
  }

  return '稳定'
}

function isSplitMetric(metric) {
  return Boolean(metric?.compact && String(metric?.label || '').includes(' / ') && String(metric?.value || '').includes(' / '))
}

function splitMetricText(text) {
  return String(text || '')
    .split(' / ')
    .map(function trimPart(part) {
      return part.trim()
    })
}

function resolveMetricSegments(metric) {
  const labels = splitMetricText(metric.label)
  const values = splitMetricText(metric.value)

  return labels.map(function mapSegment(label, index) {
    return {
      label,
      value: values[index] || '--',
    }
  })
}
</script>

<template>
  <div class="metric-grid">
    <el-card
      v-for="metric in metrics"
      :key="metric.label"
      v-loading="loading"
      class="metric-card"
      :class="['metric-card--unified', { 'metric-card--compact': metric.compact }]"
      shadow="never"
    >
      <div class="metric-head">
        <span class="metric-label-wrap">
          <el-icon class="metric-icon"><component :is="resolveMetricIcon(metric.label)" /></el-icon>
          <span v-if="!isSplitMetric(metric)" class="metric-label">{{ metric.label }}</span>
          <span v-else class="metric-label metric-label--split">{{ splitMetricText(metric.label).join(' · ') }}</span>
        </span>
        <span class="metric-tag" :class="resolveTrendClass(metric.change)">{{ resolveTrendText(metric.change) }}</span>
      </div>
      <div v-if="isSplitMetric(metric)" class="metric-split-value">
        <div v-for="segment in resolveMetricSegments(metric)" :key="segment.label" class="metric-split-value__item">
          <span class="metric-split-value__label">{{ segment.label }}</span>
          <strong class="metric-split-value__number">{{ segment.value }}</strong>
        </div>
      </div>
      <strong v-else class="metric-value">{{ metric.value }}</strong>
      <span class="metric-change" :class="`metric-change--${resolveTrendClass(metric.change)}`">{{ metric.change }}</span>
    </el-card>
  </div>
</template>
