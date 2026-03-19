import { readStoredAuth } from './auth'
import i18n from '../i18n'

const DEFAULT_API_ORIGIN = 'https://example.invalid'
const DEFAULT_SECURE_PATH = 'change-me'

function getApiOrigin() {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_ORIGIN
}

function getDashboardSecurePath() {
  return import.meta.env.VITE_DASHBOARD_SECURE_PATH || DEFAULT_SECURE_PATH
}

function getNormalizedApiOrigin() {
  return getApiOrigin().replace(/\/$/, '')
}

function getNormalizedSecurePath() {
  return getDashboardSecurePath().replace(/^\//, '')
}

export function buildDashboardApiUrl(endpointPath, queryEntries = []) {
  const apiOrigin = getNormalizedApiOrigin()
  const securePath = getNormalizedSecurePath()
  const url = new URL(`${apiOrigin}/api/v3/${securePath}/${endpointPath}`)

  queryEntries.forEach(function appendQueryEntry([key, value]) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  url.searchParams.set('t', String(Date.now()))

  return url.toString()
}

export function buildSecureV2ApiUrl(endpointPath, queryEntries = []) {
  const apiOrigin = getNormalizedApiOrigin()
  const securePath = getNormalizedSecurePath()
  const normalizedEndpoint = String(endpointPath || '').replace(/^\//, '')
  const url = new URL(`${apiOrigin}/api/v2/${securePath}/${normalizedEndpoint}`)

  queryEntries.forEach(function appendQueryEntry([key, value]) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  url.searchParams.set('t', String(Date.now()))

  return url.toString()
}

export function buildCommonApiUrl(endpointPath, queryEntries = []) {
  const apiOrigin = getNormalizedApiOrigin()
  const normalizedPath = String(endpointPath || '').replace(/^\//, '')
  const url = new URL(`${apiOrigin}/api/v2/${normalizedPath}`)

  queryEntries.forEach(function appendQueryEntry([key, value]) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  url.searchParams.set('t', String(Date.now()))

  return url.toString()
}

export function getDashboardApiHeaders() {
  const storedSession = readStoredAuth()
  const storedAuthData = storedSession?.authData
  const apiToken = import.meta.env.VITE_DASHBOARD_API_TOKEN
  const authorizationValue =
    storedAuthData || (apiToken ? `Bearer ${apiToken}` : '')
  const headers = {
    Accept: 'application/json, text/plain, */*',
  }

  if (authorizationValue) {
    headers.Authorization = authorizationValue
  }

  return headers
}

export async function requestDashboardApi(url) {
  const response = await fetch(url, {
    headers: getDashboardApiHeaders(),
  })

  if (response.status === 401 || response.status === 403) {
    throw new Error(resolveMessage('defaults.dashboardStatsAuthFailed'))
  }

  if (!response.ok) {
    throw new Error(resolveMessage('defaults.dashboardRequestFailed', {
      status: response.status,
    }))
  }

  const payload = await response.json()

  if (payload?.status && payload.status !== 'success') {
    throw new Error(payload.message || resolveMessage('defaults.dashboardStatusFailed'))
  }

  if (payload?.code !== undefined && Number(payload.code) !== 0) {
    throw new Error(payload.message || resolveMessage('defaults.dashboardCodeFailed'))
  }

  return payload
}

export async function requestDashboardMutation(url, payload, method = 'POST') {
  const headers = {
    ...getDashboardApiHeaders(),
    'Content-Type': 'application/json',
  }
  const response = await fetch(url, {
    method,
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
  })

  if (response.status === 401 || response.status === 403) {
    throw new Error(resolveMessage('defaults.dashboardStatsAuthFailed'))
  }

  if (!response.ok) {
    throw new Error(resolveMessage('defaults.dashboardRequestFailed', {
      status: response.status,
    }))
  }

  const responsePayload = await response.json()

  if (responsePayload?.status && responsePayload.status !== 'success') {
    throw new Error(responsePayload.message || resolveMessage('defaults.dashboardStatusFailed'))
  }

  if (
    responsePayload?.code !== undefined &&
    Number(responsePayload.code) !== 0
  ) {
    throw new Error(responsePayload.message || resolveMessage('defaults.dashboardCodeFailed'))
  }

  return responsePayload
}

export async function requestDashboardUpload(url, formData, method = 'POST') {
  const headers = {
    ...getDashboardApiHeaders(),
  }
  const response = await fetch(url, {
    method,
    headers,
    body: formData,
  })

  if (response.status === 401 || response.status === 403) {
    throw new Error(resolveMessage('defaults.dashboardStatsAuthFailed'))
  }

  if (!response.ok) {
    throw new Error(resolveMessage('defaults.dashboardRequestFailed', {
      status: response.status,
    }))
  }

  const responsePayload = await response.json()

  if (responsePayload?.status && responsePayload.status !== 'success') {
    throw new Error(responsePayload.message || resolveMessage('defaults.dashboardStatusFailed'))
  }

  if (
    responsePayload?.code !== undefined &&
    Number(responsePayload.code) !== 0
  ) {
    throw new Error(responsePayload.message || resolveMessage('defaults.dashboardCodeFailed'))
  }

  return responsePayload
 }

function resolveMessage(key, values) {
  if (i18n?.global?.te?.(key)) {
    return i18n.global.t(key, values)
  }

  const fallbackMap = {
    'defaults.dashboardStatsAuthFailed':
      '仪表盘接口鉴权失败，请先重新登录后再重试',
    'defaults.dashboardRequestFailed': `Dashboard request failed: ${values?.status ?? ''}`,
    'defaults.dashboardStatusFailed': '仪表盘接口返回失败状态',
    'defaults.dashboardCodeFailed': '仪表盘接口返回异常状态码',
  }

  return fallbackMap[key] || key
}
