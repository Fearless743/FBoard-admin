<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
    ArrowDown,
    FolderOpened,
    Promotion,
    Search,
    SwitchButton,
} from "@element-plus/icons-vue";

import { useAdminStore } from "../stores/admin";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const authStore = useAuthStore();

const pageTitle = computed(function pageTitle() {
    return route.meta.title ?? "仪表盘";
});

const pageEyebrow = computed(function pageEyebrow() {
    return route.meta.eyebrow ?? "LongtengCloud / 管理后台";
});

const activeMenu = computed(function activeMenu() {
    return route.name ?? "dashboard";
});

const headerUserInitial = computed(function headerUserInitial() {
    const email = adminStore.userInfo?.email || "";

    if (!email || email === "--") {
        return "LT";
    }

    return email.charAt(0).toUpperCase();
});

const headerUserEmail = computed(function headerUserEmail() {
    return adminStore.userInfo?.email && adminStore.userInfo.email !== "--"
        ? adminStore.userInfo.email
        : "LongtengCloud Admin";
});

function handleMenuSelect(routeName) {
    router.push({ name: routeName });
}

function handleAccountCommand(command) {
    if (command !== "logout") {
        return;
    }

    authStore.logout();
    router.push({ name: "login" });
}
</script>

<template>
    <el-container class="app-shell">
        <el-aside class="sidebar" width="288px">
            <div class="brand-panel">
                <div class="brand-mark">L</div>
                <div>
                    <strong>LongtengCloud</strong>
                    <p>V2Board · Admin Console</p>
                </div>
            </div>

            <el-input
                v-model="adminStore.searchKeyword"
                class="search-box"
                placeholder="搜索模块 / 用户 / 订单"
            >
                <template #prefix>
                    <el-icon><Search /></el-icon>
                </template>
            </el-input>

            <div class="nav-groups">
                <section
                    v-for="group in adminStore.filteredNavigationGroups"
                    :key="group.title"
                    class="nav-group"
                >
                    <div class="nav-title">{{ group.title }}</div>

                    <el-menu
                        :default-active="String(activeMenu)"
                        :router="false"
                        class="nav-menu"
                        background-color="transparent"
                        text-color="#dce7f4"
                        active-text-color="#86efac"
                    >
                        <el-menu-item
                            v-for="item in group.items"
                            :key="`${group.title}-${item.label}`"
                            :index="item.routeName"
                            class="nav-item"
                            @click="handleMenuSelect(item.routeName)"
                        >
                            <el-icon><component :is="item.icon" /></el-icon>
                            <span>{{ item.label }}</span>
                        </el-menu-item>
                    </el-menu>
                </section>
            </div>

            <div class="sidebar-footer">
                <span class="status-dot"></span>
                <span>系统运行正常 · 队列与支付服务在线</span>
            </div>
        </el-aside>

        <el-main class="main-panel">
            <header class="topbar">
                <div>
                    <div class="eyebrow">{{ pageEyebrow }}</div>
                    <h1>{{ pageTitle }}</h1>
                </div>

                <div class="topbar-actions">
                    <el-dropdown
                        class="header-account"
                        :class="{ loading: adminStore.userInfoLoading }"
                        placement="bottom-end"
                        trigger="click"
                        @command="handleAccountCommand"
                    >
                        <button class="header-account__trigger" type="button">
                            <div class="header-account__meta">
                                <strong>{{ headerUserEmail }}</strong>
                            </div>

                            <div class="header-account__avatar-wrap">
                                <img
                                    v-if="adminStore.userInfo.avatarUrl"
                                    :src="adminStore.userInfo.avatarUrl"
                                    :alt="headerUserEmail"
                                    class="header-account__avatar"
                                />
                                <div
                                    v-else
                                    class="header-account__avatar header-account__avatar--fallback"
                                >
                                    {{ headerUserInitial }}
                                </div>
                            </div>

                            <el-icon class="header-account__arrow"
                                ><ArrowDown
                            /></el-icon>
                        </button>

                        <template #dropdown>
                            <el-dropdown-menu class="header-account__menu">
                                <el-dropdown-item command="logout">
                                    <el-icon><SwitchButton /></el-icon>
                                    <span>退出登录</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </header>

            <router-view />
        </el-main>
    </el-container>
</template>
