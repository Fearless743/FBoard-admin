import {
  buildDashboardApiUrl,
  buildSecureV2ApiUrl,
  requestDashboardApi,
  requestDashboardMutation,
  requestDashboardUpload,
} from './api'

export function createEmptyPlugins() {
  return []
}

export function createEmptyPluginsPagination() {
  return {
    page: 1,
    limit: 50,
    total: 0,
  }
}

export function createEmptyPluginsFilters() {
  return {
    type: 'all',
    status: 'all',
  }
}

export function createEmptyPluginTypes() {
  return []
}

function normalizePluginStatus(plugin) {
  const installed = Boolean(plugin?.is_installed)
  const enabled = Boolean(plugin?.is_enabled)
  const protectedFlag = Boolean(plugin?.is_protected)

  if (!installed) {
    return 'not_installed'
  }

  if (enabled) {
    return 'enabled'
  }

  return protectedFlag ? 'protected' : 'disabled'
}

function normalizePluginType(type) {
  const normalizedType = String(type || '').trim()

  if (!normalizedType) {
    return '--'
  }

  return normalizedType.toUpperCase()
}

function normalizePlugin(plugin, index) {
  const status = normalizePluginStatus(plugin)
  const canDelete = Boolean(plugin?.can_be_deleted)

  return {
    id: String(plugin?.code || `PLUGIN-${index + 1}`),
    code: String(plugin?.code || '--'),
    name: plugin?.name || `插件 ${index + 1}`,
    version: plugin?.version || '--',
    author: plugin?.author || '--',
    type: normalizePluginType(plugin?.type),
    status,
    installed: Boolean(plugin?.is_installed),
    enabled: Boolean(plugin?.is_enabled),
    protected: Boolean(plugin?.is_protected),
    deletable: canDelete,
    needUpgrade: Boolean(plugin?.need_upgrade),
    description: plugin?.description || '暂无插件说明',
    configCount: Array.isArray(plugin?.config)
      ? plugin.config.length
      : plugin?.config && typeof plugin.config === 'object'
        ? Object.keys(plugin.config).length
        : 0,
    config: plugin?.config,
    readme: plugin?.readme || '',
  }
}

function mapPluginList(payload) {
  const rawData = payload?.data ?? payload ?? {}
  const list = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData?.list)
      ? rawData.list
      : Array.isArray(rawData)
        ? rawData
        : []

  return list
}

export async function fetchPlugins(options = {}) {
  const status = options.status && options.status !== 'all' ? options.status : ''
  const type = options.type && options.type !== 'all' ? options.type : ''
  const apiUrl = buildSecureV2ApiUrl('plugin/getPlugins', [
    ['status', status],
    ['type', type],
  ])
  const payload = await requestDashboardApi(apiUrl)
  const listSource = mapPluginList(payload)
  const normalized = listSource.map(function mapPlugin(plugin, index) {
    return normalizePlugin(plugin, index)
  })

  return {
    list: normalized,
    pagination: {
      page: 1,
      limit: normalized.length || 50,
      total: normalized.length,
    },
  }
}

export async function fetchPluginTypes() {
  const apiUrl = buildSecureV2ApiUrl('plugin/types')
  const payload = await requestDashboardApi(apiUrl)
  const rawData = payload?.data ?? payload ?? {}
  const list = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData)
      ? rawData
      : []

  return list.map((item) => ({
    value: String(item?.value ?? ''),
    label: item?.label ?? item?.value ?? '--',
    description: item?.description ?? '',
    icon: item?.icon ?? '',
  }))
}

export async function enablePlugin(code) {
  if (!code) {
    throw new Error('缺少插件标识')
  }

  const apiUrl = buildSecureV2ApiUrl('plugin/enable')
  return requestDashboardMutation(apiUrl, {
    code,
  })
}

export async function disablePlugin(code) {
  if (!code) {
    throw new Error('缺少插件标识')
  }

  const apiUrl = buildSecureV2ApiUrl('plugin/disable')
  return requestDashboardMutation(apiUrl, {
    code,
  })
}

export async function installPlugin(code) {
  if (!code) {
    throw new Error('缺少插件标识')
  }

  const apiUrl = buildDashboardApiUrl('plugin/install')
  return requestDashboardMutation(apiUrl, {
    code,
  })
}

export async function uninstallPlugin(code) {
  if (!code) {
    throw new Error('缺少插件标识')
  }

  const apiUrl = buildDashboardApiUrl('plugin/uninstall')
  return requestDashboardMutation(apiUrl, {
    code,
  })
}

export async function deletePlugin(code) {
  if (!code) {
    throw new Error('缺少插件标识')
  }

  const apiUrl = buildSecureV2ApiUrl('plugin/delete')
  return requestDashboardMutation(apiUrl, {
    code,
  })
}

export async function uploadPlugin(file) {
  if (!file) {
    throw new Error('缺少插件文件')
  }

  const formData = new FormData()
  formData.append('file', file)
  const apiUrl = buildSecureV2ApiUrl('plugin/upload')
  return requestDashboardUpload(apiUrl, formData)
}

export async function savePluginConfig(code, config) {
  if (!code) {
    throw new Error('缺少插件标识')
  }

  const apiUrl = buildSecureV2ApiUrl('plugin/config')
  return requestDashboardMutation(apiUrl, {
    code,
    config,
  })
}
