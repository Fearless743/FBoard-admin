<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  userInfo: {
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

function booleanText(value) {
  return value ? '开启' : '关闭'
}
</script>

<template>
  <el-card v-loading="loading" class="section-card user-info-card" shadow="never">
    <div class="section-head user-info-head">
      <div>
        <h3>当前用户信息</h3>
        <p>基于 /api/v2/user/info 接口展示当前登录管理员的账户状态。</p>
      </div>

      <el-tag :type="statusTagType(userInfo.statusTone)" effect="dark">
        {{ userInfo.statusText }}
      </el-tag>
    </div>

    <div class="user-info-profile">
      <img
        v-if="userInfo.avatarUrl"
        :src="userInfo.avatarUrl"
        alt="User avatar"
        class="user-info-avatar"
      />
      <div v-else class="user-info-avatar user-info-avatar--fallback">
        {{ userInfo.email.slice(0, 1).toUpperCase() }}
      </div>

      <div class="user-info-copy">
        <strong>{{ userInfo.email }}</strong>
        <span>套餐 {{ userInfo.planId }} · 佣金比例 {{ userInfo.commissionRate }}</span>
      </div>
    </div>

    <div class="user-info-metrics">
      <article>
        <span>账户余额</span>
        <strong>{{ userInfo.balance }}</strong>
      </article>
      <article>
        <span>佣金余额</span>
        <strong>{{ userInfo.commissionBalance }}</strong>
      </article>
      <article>
        <span>总流量</span>
        <strong>{{ userInfo.transferEnable }}</strong>
      </article>
      <article>
        <span>到期时间</span>
        <strong>{{ userInfo.expiredAt }}</strong>
      </article>
    </div>

    <div class="user-info-grid">
      <div class="user-info-item">
        <span>最近登录</span>
        <strong>{{ userInfo.lastLoginAt }}</strong>
      </div>
      <div class="user-info-item">
        <span>注册时间</span>
        <strong>{{ userInfo.createdAt }}</strong>
      </div>
      <div class="user-info-item">
        <span>Telegram ID</span>
        <strong>{{ userInfo.telegramId }}</strong>
      </div>
      <div class="user-info-item">
        <span>到期提醒</span>
        <strong>{{ booleanText(userInfo.remindExpire) }}</strong>
      </div>
      <div class="user-info-item">
        <span>流量提醒</span>
        <strong>{{ booleanText(userInfo.remindTraffic) }}</strong>
      </div>
      <div class="user-info-item user-info-item--wide">
        <span>UUID</span>
        <strong>{{ userInfo.uuid }}</strong>
      </div>
    </div>
  </el-card>
</template>
