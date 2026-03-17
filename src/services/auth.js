const AUTH_STORAGE_KEY = 'ltc-admin-auth'
const DEFAULT_LOGIN_URL = 'https://example.invalid/api/v2/passport/auth/login'

function getLoginUrl() {
  return import.meta.env.VITE_AUTH_LOGIN_URL || DEFAULT_LOGIN_URL
}

function parseAuthStorage(rawValue) {
  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue)
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function readStoredAuth() {
  if (typeof localStorage === 'undefined') {
    return null
  }

  return parseAuthStorage(localStorage.getItem(AUTH_STORAGE_KEY))
}

export function persistAuthSession(session) {
  if (typeof localStorage === 'undefined') {
    return
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearAuthSession() {
  if (typeof localStorage === 'undefined') {
    return
  }

  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function hasStoredAuthSession() {
  const session = readStoredAuth()
  return Boolean(session?.authData)
}

export async function loginWithPassword(payload) {
  const response = await fetch(getLoginUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
  })

  let result = null

  try {
    result = await response.json()
  } catch {
    throw new Error('登录接口返回了无法解析的数据')
  }

  if (!response.ok || result?.status !== 'success' || !result?.data?.auth_data) {
    throw new Error(result?.message || '登录失败，请检查邮箱或密码')
  }

  return {
    token: result.data.token || '',
    authData: result.data.auth_data,
    isAdmin: Boolean(result.data.is_admin),
  }
}
