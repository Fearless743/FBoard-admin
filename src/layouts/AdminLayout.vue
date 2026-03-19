<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
    ArrowDown,
    FolderOpened,
    Search,
    SwitchButton,
} from "@element-plus/icons-vue";

import { useAdminStore } from "../stores/admin";
import { useAuthStore } from "../stores/auth";

const HEADER_AVATAR_FALLBACK =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' fill='%23e2e8f0'/><circle cx='32' cy='26' r='12' fill='%2394a3b8'/><path d='M12 56c3.5-12 16-18 20-18s16.5 6 20 18' fill='%2394a3b8'/></svg>";

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const authStore = useAuthStore();
const { t, locale } = useI18n();

const isMobile = ref(false);
const isMobileNavOpen = ref(false);
const isSidebarCollapsed = ref(false);

function updateViewportMode() {
    const nextIsMobile = window.innerWidth <= 980;

    if (isMobile.value !== nextIsMobile) {
        isMobile.value = nextIsMobile;

        if (!nextIsMobile) {
            isMobileNavOpen.value = false;
        }
    }
}

function toggleMobileNav() {
    isMobileNavOpen.value = !isMobileNavOpen.value;
}

function toggleSidebar() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
}

function closeMobileNav() {
    isMobileNavOpen.value = false;
}

const languageOptions = computed(function languageOptions() {
    return [
        {
            value: "zh-CN",
            label: t("app.languages.zhCN"),
        },
    ];
});

const pageTitle = computed(function pageTitle() {
    if (typeof window !== "undefined" && window.settings?.title) {
        return window.settings.title;
    }

    if (route.meta.titleKey) {
        return t(route.meta.titleKey);
    }

    return route.meta.title ?? t("routes.dashboard.title");
});

const pageEyebrow = computed(function pageEyebrow() {
    if (route.meta.eyebrowKey) {
        return t(route.meta.eyebrowKey);
    }

    return route.meta.eyebrow ?? t("routes.dashboard.eyebrow");
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
        : t("app.adminFallback");
});

const headerUserAvatar = computed(function headerUserAvatar() {
    const avatarUrl = adminStore.userInfo?.avatarUrl;

    if (avatarUrl) {
        return avatarUrl;
    }

    return HEADER_AVATAR_FALLBACK;
});

function resolveGroupTitle(group) {
    if (group?.titleKey) {
        return t(group.titleKey);
    }

    return group?.title || "";
}

function resolveItemLabel(item) {
    if (item?.labelKey) {
        return t(item.labelKey);
    }

    return item?.label || "";
}

function handleMenuSelect(routeName) {
    router.push({ name: routeName });
    closeMobileNav();
}

function handleAccountCommand(command) {
    if (command !== "logout") {
        return;
    }

    authStore.logout();
    router.push({ name: "login" });
}

onMounted(function attachResizeListener() {
    updateViewportMode();
    adminStore.loadUserInfo();
    window.addEventListener("resize", updateViewportMode);
});

onUnmounted(function detachResizeListener() {
    window.removeEventListener("resize", updateViewportMode);
});
</script>

<template>
    <el-container
        class="app-shell"
        :class="{
            'is-mobile-nav-open': isMobileNavOpen,
            'is-sidebar-collapsed': isSidebarCollapsed,
        }"
    >
        <div class="sidebar-backdrop" @click="closeMobileNav"></div>
        <el-aside class="sidebar" width="288px">
            <button
                v-if="!isMobile"
                class="sidebar-toggle"
                type="button"
                @click="toggleSidebar"
            >
                <span class="sidebar-toggle__icon">‹</span>
            </button>
            <div class="brand-panel">
                <div class="brand-mark">L</div>
                <div>
                    <strong>{{ pageTitle }}</strong>
                    <p>{{ t("app.console") }}</p>
                </div>
            </div>

            <el-input
                v-model="adminStore.searchKeyword"
                class="search-box"
                :placeholder="t('search.placeholder')"
            >
                <template #prefix>
                    <el-icon><Search /></el-icon>
                </template>
            </el-input>

            <div class="nav-groups">
                <section
                    v-for="group in adminStore.filteredNavigationGroups"
                    :key="group.titleKey || group.title"
                    class="nav-group"
                >
                    <div class="nav-title">{{ resolveGroupTitle(group) }}</div>

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
                            :key="`${group.titleKey || group.title}-${item.labelKey || item.label}`"
                            :index="item.routeName"
                            class="nav-item"
                            @click="handleMenuSelect(item.routeName)"
                        >
                            <el-icon><component :is="item.icon" /></el-icon>
                            <span>{{ resolveItemLabel(item) }}</span>
                        </el-menu-item>
                    </el-menu>
                </section>
            </div>
        </el-aside>

        <el-main class="main-panel">
            <header class="topbar">
                <button
                    v-if="isMobile"
                    class="mobile-nav-toggle"
                    type="button"
                    @click="toggleMobileNav"
                >
                    <el-icon><FolderOpened /></el-icon>
                </button>
                <div>
                    <h1>{{ pageTitle }}</h1>
                </div>

                <div class="topbar-actions">
                    <el-select
                        v-model="locale"
                        class="topbar-language"
                        size="small"
                        :placeholder="t('app.language')"
                    >
                        <el-option
                            v-for="option in languageOptions"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                        />
                    </el-select>
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
                                    :src="headerUserAvatar"
                                    :alt="headerUserEmail"
                                    class="header-account__avatar"
                                />
                            </div>

                            <el-icon class="header-account__arrow"
                                ><ArrowDown
                            /></el-icon>
                        </button>

                        <template #dropdown>
                            <el-dropdown-menu class="header-account__menu">
                                <el-dropdown-item command="logout">
                                    <el-icon><SwitchButton /></el-icon>
                                    <span>{{ t("auth.logout") }}</span>
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
