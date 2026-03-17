<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  overview: {
    type: Object,
    required: true,
  },
  range: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['change-range'])

const activeMetric = ref('amount')
const dropdownRef = ref(null)
const customRange = ref([])

const metricOptions = [
  {
    label: '金额',
    value: 'amount',
    hint: '收入',
  },
  {
    label: '数量',
    value: 'count',
    hint: '订单',
  },
]

const chartWidth = 1120
const chartHeight = 320
const chartPadding = {
  top: 22,
  right: 18,
  bottom: 38,
  left: 64,
}

const rangeOptions = [
  { label: '最近7天', value: '7d' },
  { label: '最近30天', value: '30d' },
  { label: '最近90天', value: '90d' },
  { label: '最近180天', value: '180d' },
  { label: '最近一年', value: '365d' },
  { label: '自定义范围', value: 'custom' },
]

const currentRangeLabel = computed(function currentRangeLabel() {
  if (props.range?.label) {
    return props.range.label
  }

  const matchedOption = rangeOptions.find(function findOption(option) {
    return option.value === props.range?.key
  })

  return matchedOption ? matchedOption.label : '最近30天'
})

const selectedRangeKey = ref(props.range?.key || '30d')

watch(
  () => props.range?.key,
  function syncRangeKey(nextKey) {
    selectedRangeKey.value = nextKey || '30d'
  },
)

watch(
  () => [props.range?.startDate, props.range?.endDate, props.range?.key],
  function syncCustomRange([startDate, endDate, rangeKey]) {
    if (rangeKey === 'custom' && startDate && endDate) {
      customRange.value = [startDate, endDate]
      return
    }

    customRange.value = []
  },
  { immediate: true },
)

function handleRangeCommand(command) {
  selectedRangeKey.value = command?.key || '30d'

  if (command?.key === 'custom') {
    return
  }

  emit('change-range', command)
  dropdownRef.value?.handleClose?.()
}

function handleApplyCustomRange() {
  if (!Array.isArray(customRange.value) || customRange.value.length !== 2) {
    return
  }

  emit('change-range', {
    key: 'custom',
    startDate: customRange.value[0],
    endDate: customRange.value[1],
    label: '自定义范围',
  })

  dropdownRef.value?.handleClose?.()
}

function getPrimaryValue(point) {
  if (activeMetric.value === 'count') {
    return point.paidCount
  }

  return point.paidTotal / 100
}

function getSecondaryValue(point) {
  if (activeMetric.value === 'count') {
    return point.commissionCount
  }

  return point.commissionTotal / 100
}

function formatAxisValue(value) {
  if (activeMetric.value === 'count') {
    return `${Math.round(value)}`
  }

  return `¥${value.toFixed(2)}`
}

function formatPointValue(value) {
  if (activeMetric.value === 'count') {
    return `${Math.round(value)} 笔`
  }

  return `¥${value.toFixed(2)}`
}

function getNiceTickStep(maxValue, targetTickCount) {
  const safeMaxValue = Math.max(maxValue, 1)
  const roughStep = safeMaxValue / Math.max(targetTickCount, 1)
  const magnitude = 10 ** Math.floor(Math.log10(roughStep || 1))
  const normalizedStep = roughStep / magnitude

  if (normalizedStep <= 1) {
    return magnitude
  }

  if (normalizedStep <= 2) {
    return 2 * magnitude
  }

  if (normalizedStep <= 5) {
    return 5 * magnitude
  }

  return 10 * magnitude
}

function getCountChartScale(maxValue) {
  const targetTickCount = 5
  const step = getNiceTickStep(maxValue, targetTickCount)
  const tickCount = Math.max(3, Math.ceil(maxValue / step))
  const axisMax = Math.max(step * tickCount, step)

  return {
    step,
    tickCount,
    axisMax,
  }
}

function createSmoothPath(points) {
  if (!points.length) {
    return ''
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`
  }

  let path = `M ${points[0].x} ${points[0].y}`

  for (let index = 0; index < points.length - 1; index += 1) {
    const currentPoint = points[index]
    const nextPoint = points[index + 1]
    const controlX = (currentPoint.x + nextPoint.x) / 2

    path += ` C ${controlX} ${currentPoint.y}, ${controlX} ${nextPoint.y}, ${nextPoint.x} ${nextPoint.y}`
  }

  return path
}

function createAreaPath(points, baseline) {
  if (!points.length) {
    return ''
  }

  const linePath = createSmoothPath(points)
  const lastPoint = points[points.length - 1]
  const firstPoint = points[0]

  return `${linePath} L ${lastPoint.x} ${baseline} L ${firstPoint.x} ${baseline} Z`
}

function getBarWidth(pointsLength) {
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right
  const groupWidth = plotWidth / Math.max(pointsLength, 1)

  return Math.min(Math.max(groupWidth * 0.28, 8), 18)
}

const chartMaxValue = computed(function chartMaxValue() {
  const values = props.overview.chart.map(function mapPoint(point) {
    return getPrimaryValue(point)
  })

  const maxValue = Math.max(...values, 0)
  return maxValue > 0 ? maxValue : 1
})

const chartTicks = computed(function chartTicks() {
  const isCountMode = activeMetric.value === 'count'
  const countScale = getCountChartScale(chartMaxValue.value)
  const axisMax = isCountMode ? countScale.axisMax : chartMaxValue.value
  const tickCount = isCountMode ? countScale.tickCount : 4
  const tickValues = []

  for (let index = 0; index <= tickCount; index += 1) {
    const value = axisMax - (axisMax / tickCount) * index
    const ratio = axisMax > 0 ? value / axisMax : 0

    tickValues.push({
      value,
      label: formatAxisValue(value),
      y: chartPadding.top + ratio * (chartHeight - chartPadding.top - chartPadding.bottom),
    })
  }

  return tickValues
})

const chartSeries = computed(function chartSeries() {
  const points = props.overview.chart
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom
  const safeDivisor = points.length > 1 ? points.length - 1 : 1
  const baseline = chartHeight - chartPadding.bottom
  const isCountMode = activeMetric.value === 'count'
  const axisMax = isCountMode
    ? getCountChartScale(chartMaxValue.value).axisMax
    : chartMaxValue.value
  const barWidth = isCountMode ? getBarWidth(points.length) * 1.18 : getBarWidth(points.length)
  const minimumVisualBarHeight = isCountMode ? 14 : 2

  const mappedPoints = points.map(function mapPoint(point, index) {
    const primaryValue = getPrimaryValue(point)
    const secondaryValue = getSecondaryValue(point)
    const x = chartPadding.left + (plotWidth / safeDivisor) * index
    const primaryRawHeight = axisMax > 0 ? (primaryValue / axisMax) * plotHeight : 0
    const secondaryRawHeight = axisMax > 0 ? (secondaryValue / axisMax) * plotHeight : 0
    const primaryBarHeight = primaryValue > 0
      ? Math.max(primaryRawHeight, minimumVisualBarHeight)
      : 0
    const secondaryBarHeight = secondaryValue > 0
      ? Math.max(secondaryRawHeight, minimumVisualBarHeight)
      : 0
    const primaryY = baseline - primaryBarHeight
    const secondaryY = baseline - secondaryBarHeight

    return {
      ...point,
      x,
      barWidth,
      primaryValue,
      secondaryValue,
      primaryY,
      secondaryY,
      primaryBarHeight,
      secondaryBarHeight,
      primaryDisplayValue: formatPointValue(primaryValue),
      secondaryDisplayValue: formatPointValue(secondaryValue),
    }
  })

  const primaryPoints = mappedPoints.map(function mapPrimary(point) {
    return { x: point.x, y: point.primaryY }
  })

  const secondaryPoints = mappedPoints.map(function mapSecondary(point) {
    return { x: point.x, y: point.secondaryY }
  })

  return {
    points: mappedPoints,
    primaryPath: createSmoothPath(primaryPoints),
    primaryAreaPath: createAreaPath(primaryPoints, baseline),
  }
})
</script>

<template>
  <el-card v-loading="loading" class="section-card income-overview-card themed-chart-card" shadow="never">
    <div class="income-overview-toolbar">
      <div>
        <h3>收入概览</h3>
        <p>{{ overview.range.startDate || '--' }} 至 {{ overview.range.endDate || '--' }}</p>
      </div>

      <div class="income-overview-actions">
        <el-dropdown
          ref="dropdownRef"
          class="income-range-dropdown"
          :hide-on-click="false"
          placement="bottom-end"
          trigger="click"
          @command="handleRangeCommand"
        >
          <button class="income-range-button" type="button">
            <span>{{ currentRangeLabel }}</span>
            <el-icon><ArrowDown /></el-icon>
          </button>

          <template #dropdown>
            <el-dropdown-menu class="income-range-menu">
              <el-dropdown-item
                v-for="option in rangeOptions"
                :key="option.value"
                :command="{ key: option.value, label: option.label }"
                :class="{ 'is-active': option.value === selectedRangeKey }"
              >
                <span>{{ option.label }}</span>
                <span v-if="option.value === selectedRangeKey" class="income-range-check">✓</span>
              </el-dropdown-item>
            </el-dropdown-menu>

            <div v-if="selectedRangeKey === 'custom'" class="income-range-custom" @click.stop>
              <span class="income-range-custom__label">自定义范围</span>
              <el-date-picker
                v-model="customRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                unlink-panels
              />
              <el-button
                type="primary"
                size="small"
                :disabled="customRange.length !== 2"
                @click="handleApplyCustomRange"
              >
                应用范围
              </el-button>
            </div>
          </template>
        </el-dropdown>

        <el-segmented v-model="activeMetric" :options="metricOptions" class="income-overview-toggle">
          <template #default="scope">
            <span class="income-overview-toggle__option">
              <span class="income-overview-toggle__title">{{ scope.item.label }}</span>
              <small class="income-overview-toggle__hint">{{ scope.item.hint }}</small>
            </span>
          </template>
        </el-segmented>
      </div>
    </div>

    <div class="income-overview-summary">
      <div class="income-kpi hero">
        <span>总收入</span>
        <strong>{{ overview.summary.paidTotal }}</strong>
        <small>共 {{ overview.summary.paidCount }} 笔交易</small>
        <small>平均订单金额: {{ overview.summary.avgPaidAmount }}</small>
      </div>
      <div class="income-kpi hero">
        <span>总佣金</span>
        <strong>{{ overview.summary.commissionTotal }}</strong>
        <small>共 {{ overview.summary.commissionCount }} 笔交易</small>
        <small>佣金比例: {{ overview.summary.commissionRate }}</small>
      </div>
    </div>

    <div class="income-chart-surface">
      <div class="income-chart-yaxis">
        <span
          v-for="tick in chartTicks"
          :key="tick.label"
          class="income-chart-yaxis-label"
          :style="{ top: `${tick.y}px` }"
        >
          {{ tick.label }}
        </span>
      </div>

      <svg
        class="income-line-chart"
        :class="{ 'is-count-mode': activeMetric === 'count' }"
        :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
        aria-label="收入概览图表"
        preserveAspectRatio="none"
        role="img"
      >
        <defs>
          <linearGradient id="incomePrimaryAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#22c55e" stop-opacity="0.24" />
            <stop offset="100%" stop-color="#22c55e" stop-opacity="0.02" />
          </linearGradient>
          <linearGradient id="incomeSecondaryAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.16" />
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.01" />
          </linearGradient>
        </defs>

        <g>
          <line
            v-for="tick in chartTicks"
            :key="`grid-${tick.label}`"
            class="income-grid-line"
            :x1="chartPadding.left"
            :x2="chartWidth - chartPadding.right"
            :y1="tick.y"
            :y2="tick.y"
          />
        </g>

        <template v-if="activeMetric === 'amount'">
          <path class="income-primary-area" :d="chartSeries.primaryAreaPath" />
          <path class="income-primary-line" :d="chartSeries.primaryPath" />

          <g v-for="point in chartSeries.points" :key="point.date" class="income-point-group">
            <line
              class="income-hover-guide"
              :x1="point.x"
              :x2="point.x"
              :y1="chartPadding.top"
              :y2="chartHeight - chartPadding.bottom"
            />
            <circle class="income-point-shadow" :cx="point.x" :cy="point.primaryY" r="6" />
            <circle class="income-point" :cx="point.x" :cy="point.primaryY" r="4" />
          </g>
        </template>

        <template v-else>
          <g v-for="point in chartSeries.points" :key="point.date" class="income-bar-group">
            <line
              class="income-hover-guide"
              :x1="point.x"
              :x2="point.x"
              :y1="chartPadding.top"
              :y2="chartHeight - chartPadding.bottom"
            />
            <rect
              class="income-primary-bar"
              :x="point.x - point.barWidth / 2"
              :y="point.primaryY"
              :width="point.barWidth"
              :height="Math.max(point.primaryBarHeight, 2)"
              rx="5"
            />
          </g>
        </template>
      </svg>

      <div class="income-chart-tooltips">
        <div
          v-for="point in chartSeries.points"
          :key="`${point.date}-tip`"
          class="income-chart-tooltip-hit"
          :style="{ left: `${((point.x - chartPadding.left) / (chartWidth - chartPadding.left - chartPadding.right)) * 100}%` }"
        >
          <div class="income-chart-tooltip">
            <strong>{{ point.date }}</strong>
            <span>{{ activeMetric === 'count' ? '交易数' : '收入' }} {{ point.primaryDisplayValue }}</span>
            <small v-if="activeMetric === 'count'">佣金笔数 {{ point.secondaryDisplayValue }}</small>
          </div>
        </div>
      </div>

      <div class="income-chart-xaxis">
        <div
          v-for="point in chartSeries.points"
          :key="`${point.date}-label`"
          class="income-chart-xaxis-label"
        >
          {{ point.shortDate }}
        </div>
      </div>
    </div>
  </el-card>
</template>
