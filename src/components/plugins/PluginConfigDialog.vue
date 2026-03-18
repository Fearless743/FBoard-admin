<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  plugin: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const configFields = ref([])
const formValues = ref({})

function normalizeConfig(config) {
  if (Array.isArray(config)) {
    return config.map((item, index) => ({
      key: item?.key || `FIELD-${index + 1}`,
      ...item,
    }))
  }

  if (config && typeof config === 'object') {
    return Object.entries(config).map(([key, value]) => ({
      key,
      ...value,
    }))
  }

  return []
}

function normalizeBoolean(value) {
  if (value === true || value === false) {
    return value
  }

  if (value === 'true' || value === '1' || value === 1) {
    return true
  }

  if (value === 'false' || value === '0' || value === 0) {
    return false
  }

  return Boolean(value)
}

function normalizeFieldValue(field) {
  const rawValue = field?.value ?? field?.default ?? ''
  const type = String(field?.type || '').toLowerCase()

  if (type === 'number') {
    const numericValue = Number(rawValue)
    return Number.isFinite(numericValue) ? numericValue : null
  }

  if (type === 'boolean') {
    return normalizeBoolean(rawValue)
  }

  if (type === 'json') {
    if (typeof rawValue === 'string') {
      return rawValue
    }

    if (rawValue && typeof rawValue === 'object') {
      return JSON.stringify(rawValue, null, 2)
    }

    return ''
  }

  return rawValue ?? ''
}

function getFieldComponent(type, options) {
  const normalized = String(type || '').toLowerCase()

  if (normalized === 'boolean') {
    return 'el-switch'
  }

  if (normalized === 'number') {
    return 'el-input-number'
  }

  if (normalized === 'text' || normalized === 'json') {
    return 'el-input'
  }

  if (Array.isArray(options) && options.length > 0) {
    return 'el-select'
  }

  return 'el-input'
}

function getFieldProps(field) {
  const type = String(field?.type || '').toLowerCase()
  const props = {}

  if (type === 'text' || type === 'json') {
    props.type = 'textarea'
    props.autosize = { minRows: 3, maxRows: 8 }
  }

  if (type === 'number') {
    props.controlsPosition = 'right'
  }

  if (field?.placeholder) {
    props.placeholder = field.placeholder
  }

  return props
}

function getFieldOptions(field) {
  if (!Array.isArray(field?.options)) {
    return []
  }

  return field.options.map((option, index) => {
    if (option && typeof option === 'object') {
      return {
        label: option.label ?? option.value ?? `选项 ${index + 1}`,
        value: option.value ?? option.label ?? option,
      }
    }

    return { label: String(option), value: option }
  })
}

watch(
  () => props.plugin,
  (plugin) => {
    const fields = normalizeConfig(plugin?.config)
    const values = {}

    fields.forEach((field) => {
      values[field.key] = normalizeFieldValue(field)
    })

    configFields.value = fields
    formValues.value = values
  },
  { immediate: true }
)
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="plugin?.name || '插件配置'"
    class="plugin-config__dialog"
    width="520px"
  >
    <el-form label-position="top" class="plugin-config">
      <el-form-item
        v-for="field in configFields"
        :key="field.key"
        :label="field.label || field.key"
        class="plugin-config__field"
      >
        <div class="plugin-config__control-wrap">
          <component
            :is="getFieldComponent(field.type, field.options)"
            v-model="formValues[field.key]"
            v-bind="getFieldProps(field)"
            class="plugin-config__control"
          >
            <el-option
              v-for="option in getFieldOptions(field)"
              v-if="getFieldComponent(field.type, field.options) === 'el-select'"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </component>
        </div>
        <p v-if="field.description" class="plugin-config__desc">
          {{ field.description }}
        </p>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.plugin-config__dialog :deep(.el-dialog) {
  max-width: 92vw;
}

.plugin-config__dialog :deep(.el-dialog__body) {
  padding: 12px 24px 24px;
}

.plugin-config {
  display: grid;
  gap: 16px;
}

.plugin-config__field {
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
}

.plugin-config__field :deep(.el-form-item__label) {
  margin-bottom: 8px;
  font-size: 12px;
  letter-spacing: 0.4px;
  color: var(--el-text-color-secondary);
}

.plugin-config__control-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.plugin-config__control {
  width: 100%;
}

.plugin-config__control :deep(.el-input__wrapper),
.plugin-config__control :deep(.el-textarea__inner) {
  border-radius: 10px;
}

.plugin-config__control :deep(.el-input-number) {
  width: 100%;
}

.plugin-config__control :deep(.el-input-number__increase),
.plugin-config__control :deep(.el-input-number__decrease) {
  background: transparent;
  border-left: 1px solid var(--el-border-color-lighter);
  color: var(--el-text-color-secondary);
}

.plugin-config__control :deep(.el-input-number__increase:hover),
.plugin-config__control :deep(.el-input-number__decrease:hover) {
  color: var(--el-color-primary);
}

.plugin-config__control :deep(.el-textarea__inner) {
  font-family: 'Fira Code', monospace;
}

.plugin-config__desc {
  margin: 8px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.5;
}
</style>
