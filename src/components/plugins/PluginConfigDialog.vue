<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

import { useAdminStore } from '../../stores/admin'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'

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

const adminStore = useAdminStore()

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
const jsonEditors = new Map()
const saving = ref(false)

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

function parseJsonValue(value) {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  if (typeof value === 'object') {
    return value
  }

  try {
    return JSON.parse(String(value))
  } catch (error) {
    return null
  }
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

  if (type === 'text') {
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

function initJsonEditor(container, field) {
  if (!container || jsonEditors.has(field.key)) {
    return
  }

  const editor = new JSONEditor(container, {
    mode: 'code',
    modes: ['code'],
    search: true,
    history: true,
    statusBar: false,
    navigationBar: false,
    mainMenuBar: false,
    onChangeJSON: (value) => {
      formValues.value[field.key] = JSON.stringify(value, null, 2)
    },
  })

  const parsedValue = parseJsonValue(formValues.value[field.key])
  if (parsedValue !== null) {
    editor.set(parsedValue)
  } else {
    editor.set({})
  }

  jsonEditors.set(field.key, editor)
}

function destroyJsonEditors() {
  jsonEditors.forEach((editor) => {
    editor.destroy()
  })
  jsonEditors.clear()
}

function buildConfigPayload() {
  const payload = {}

  configFields.value.forEach((field) => {
    const key = field.key
    const type = String(field?.type || '').toLowerCase()
    const value = formValues.value[key]

    if (type === 'json') {
      if (value === '' || value === null || value === undefined) {
        payload[key] = null
      } else {
        payload[key] = String(value)
      }
      return
    }

    payload[key] = value
  })

  return payload
}

async function handleSave() {
  if (!props.plugin?.code) {
    ElMessage.error('缺少插件标识')
    return
  }

  saving.value = true

  try {
    const configPayload = buildConfigPayload()
    await adminStore.savePluginConfig(props.plugin.code, configPayload)
    ElMessage.success('配置更新成功')
    visible.value = false
  } catch (error) {
    ElMessage.error(error?.message || '配置保存失败')
  } finally {
    saving.value = false
  }
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
    destroyJsonEditors()
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

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) {
      destroyJsonEditors()
    }
  }
)

onUnmounted(() => {
  destroyJsonEditors()
})
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
        :label="String(field.type || '').toLowerCase() === 'boolean'
          ? ''
          : field.label || field.key"
        class="plugin-config__field"
      >
        <div
          v-if="String(field.type || '').toLowerCase() === 'boolean'"
          class="plugin-config__switch-card"
        >
          <div class="plugin-config__switch-content">
            <p class="plugin-config__switch-title">
              {{ field.label || field.key }}
            </p>
            <p v-if="field.description" class="plugin-config__switch-desc">
              {{ field.description }}
            </p>
          </div>
          <el-switch v-model="formValues[field.key]" />
        </div>
        <div v-else-if="String(field.type || '').toLowerCase() === 'json'" class="plugin-config__json">
          <div
            class="plugin-config__json-editor"
            :ref="(el) => initJsonEditor(el, field)"
          ></div>
        </div>
        <div v-else class="plugin-config__control-wrap">
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
        <p
          v-if="field.description && String(field.type || '').toLowerCase() !== 'boolean'"
          class="plugin-config__desc"
        >
          {{ field.description }}
        </p>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="handleSave">
        保存配置
      </el-button>
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
  width: 100%;
}

.plugin-config__json {
  width: 100%;
}

.plugin-config__switch-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
}

.plugin-config__switch-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.plugin-config__switch-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.plugin-config__switch-desc {
  margin: 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.plugin-config__json-editor {
  width: 100%;
  min-height: 220px;
  border-radius: 10px;
  border: 1px solid var(--el-border-color-lighter);
  overflow: hidden;
}

.plugin-config__control {
  width: 100%;
}

.plugin-config__control :deep(.el-input__wrapper),
.plugin-config__control :deep(.el-textarea__inner) {
  border-radius: 10px;
}

.plugin-config__control :deep(.el-input),
.plugin-config__control :deep(.el-select),
.plugin-config__control :deep(.el-textarea),
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
