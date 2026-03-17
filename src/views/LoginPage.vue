<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { MagicStick, Message, Lock, Right } from '@element-plus/icons-vue'

import { useAuthStore } from '../stores/auth'

const loginForm = reactive({
  email: '',
  password: '',
})

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const formRef = ref()

const loginRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

function resolveRedirectPath() {
  if (typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')) {
    return route.query.redirect
  }

  return '/'
}

async function handleLogin() {
  if (!formRef.value) {
    return
  }

  const isValid = await formRef.value.validate().catch(function onValidateError() {
    return false
  })

  if (!isValid) {
    return
  }

  try {
    await authStore.login({
      email: loginForm.email,
      password: loginForm.password,
    })

    ElMessage.success('登录成功，正在进入后台')
    await router.push(resolveRedirectPath())
  } catch {
    ElMessage.error(authStore.loginError || '登录失败，请稍后重试')
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__locale">
      <span class="login-page__flag">🇨🇳</span>
      <span>CN</span>
    </div>

    <div class="login-page__content">
      <header class="login-page__brand">
        <h1>LongtengCloud</h1>
      </header>

      <el-card shadow="never" class="login-card">
        <div class="login-card__head">
          <h2>登录</h2>
          <p>请输入您的邮箱和密码登录系统</p>
        </div>

        <el-form
          ref="formRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="top"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-alert
            v-if="authStore.loginError"
            type="error"
            :closable="false"
            class="login-form__alert"
            show-icon
            :title="authStore.loginError"
          />

          <el-form-item label="邮箱地址" prop="email">
            <el-input
              v-model="loginForm.email"
              placeholder="name@example.com"
              size="large"
              autocomplete="username"
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
              <template #suffix>
                <span class="login-form__suffix-badge">
                  <el-icon><MagicStick /></el-icon>
                </span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              size="large"
              type="password"
              show-password
              autocomplete="current-password"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <div class="login-form__meta">
            <button class="login-form__link" type="button">忘记密码？</button>
          </div>

          <el-button
            type="primary"
            size="large"
            class="login-form__submit"
            :loading="authStore.loginLoading"
            @click="handleLogin"
          >
            <span>登录</span>
            <el-icon><Right /></el-icon>
          </el-button>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
