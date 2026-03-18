<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
    CircleCheck,
    Close,
    Lock,
    Minus,
    Loading,
    Monitor,
    SetUp,
} from "@element-plus/icons-vue";

import DataTableCard from "../components/common/DataTableCard.vue";
import SectionCard from "../components/common/SectionCard.vue";
import PluginConfigDialog from "../components/plugins/PluginConfigDialog.vue";
import { useAdminStore } from "../stores/admin";

const adminStore = useAdminStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const pluginsLoadingFallback = ref(false);
const configDialogVisible = ref(false);
const activePlugin = ref(null);

const filters = reactive({
    keyword: "",
    status: "all",
    type: "all",
});

const statusOptions = [
    { label: "全部", value: "all" },
    { label: t("plugins.status.enabled"), value: "enabled" },
    { label: t("plugins.status.disabled"), value: "disabled" },
    { label: t("plugins.status.notInstalled"), value: "not_installed" },
];

const typeOptions = [
    { label: "全部", value: "all" },
    { label: t("plugins.types.feature"), value: "feature" },
    { label: t("plugins.types.payment"), value: "payment" },
    { label: t("plugins.types.other"), value: "other" },
];

const pluginColumns = [
    { label: "插件名称", minWidth: 220, prop: "name" },
    { label: "类型", minWidth: 120, slot: "type" },
    { label: "版本", minWidth: 120, prop: "version" },
    { label: "作者", minWidth: 140, prop: "author" },
    { label: "状态", minWidth: 120, slot: "status" },
    { label: "操作", minWidth: 220, slot: "actions" },
];

const statusStyleMap = new Map([
    ["enabled", { type: "success", icon: CircleCheck }],
    ["disabled", { type: "info", icon: Minus }],
    ["not_installed", { type: "danger", icon: Close }],
    ["protected", { type: "primary", icon: Lock }],
    ["unknown", { type: "warning", icon: Monitor }],
]);

function normalizeStatusKey(status) {
    const normalized = String(status || "").trim().toLowerCase();

    if (!normalized) {
        return "unknown";
    }

    if (normalized === "protected") {
        return "protected";
    }

    if (normalized === "enabled") {
        return "enabled";
    }

    if (normalized === "disabled") {
        return "disabled";
    }

    if (normalized === "not_installed") {
        return "not_installed";
    }

    return "unknown";
}

function resolveStatusLabel(status) {
    const normalized = normalizeStatusKey(status);

    if (normalized === "enabled") {
        return t("plugins.status.enabled");
    }

    if (normalized === "disabled") {
        return t("plugins.status.disabled");
    }

    if (normalized === "not_installed") {
        return t("plugins.status.notInstalled");
    }

    if (normalized === "protected") {
        return t("plugins.status.protected");
    }

    return status || "--";
}

function resolveStatusType(status) {
    const normalized = normalizeStatusKey(status);
    return statusStyleMap.get(normalized)?.type || "info";
}

function resolveStatusIcon(status) {
    const normalized = normalizeStatusKey(status);
    return statusStyleMap.get(normalized)?.icon || SetUp;
}

function resolveTypeLabel(type) {
    const normalized = String(type || "")
        .trim()
        .toLowerCase();

    if (normalized === "feature") {
        return t("plugins.types.feature");
    }

    if (normalized === "payment") {
        return t("plugins.types.payment");
    }

    if (normalized === "other") {
        return t("plugins.types.other");
    }

    return type || t("plugins.types.other");
}

function normalizeStatusFromQuery(status) {
    if (!status) {
        return "all";
    }

    const normalized = Array.isArray(status) ? status[0] : status;

    return statusOptions.find((option) => option.value === normalized)
        ? normalized
        : "all";
}

function normalizeTypeFromQuery(type) {
    if (!type) {
        return "all";
    }

    const normalized = Array.isArray(type) ? type[0] : type;
    const hasMatch = typeOptions.find((option) => option.value === normalized);

    return hasMatch ? normalized : "all";
}

function syncFiltersToRoute() {
    const nextQuery = { ...route.query };

    if (filters.status && filters.status !== "all") {
        nextQuery.status = filters.status;
    } else {
        delete nextQuery.status;
    }

    if (filters.type && filters.type !== "all") {
        nextQuery.type = filters.type;
    } else {
        delete nextQuery.type;
    }

    if (filters.keyword) {
        nextQuery.keyword = filters.keyword;
    } else {
        delete nextQuery.keyword;
    }

    router.replace({ query: nextQuery });
}

const filteredPlugins = computed(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return adminStore.plugins.filter((plugin) => {
        const matchKeyword = keyword
            ? [plugin.name, plugin.code, plugin.author]
                  .filter(Boolean)
                  .some((value) =>
                      String(value).toLowerCase().includes(keyword),
                  )
            : true;
        const matchStatus =
            filters.status === "all"
                ? true
                : filters.status === "enabled"
                  ? plugin.enabled
                  : filters.status === "disabled"
                    ? plugin.installed && !plugin.enabled
                    : filters.status === "not_installed"
                      ? !plugin.installed
                      : true;
        const matchType =
            filters.type === "all"
                ? true
                : String(plugin.type || "").toLowerCase() === filters.type;

        return matchKeyword && matchStatus && matchType;
    });
});

const pluginSummary = computed(() => {
    const total = adminStore.plugins.length;
    const enabled = adminStore.plugins.filter(
        (plugin) => plugin.enabled,
    ).length;
    const installed = adminStore.plugins.filter(
        (plugin) => plugin.installed,
    ).length;
    const needUpgrade = adminStore.plugins.filter(
        (plugin) => plugin.needUpgrade,
    ).length;

    return {
        total,
        enabled,
        installed,
        needUpgrade,
    };
});

async function fetchPlugins() {
    pluginsLoadingFallback.value = true;

    try {
        await adminStore.loadPlugins({
            filters: {
                status: filters.status,
                type: filters.type,
            },
        });
    } catch (error) {
        ElMessage.error("插件列表加载失败，请稍后重试");
    } finally {
        pluginsLoadingFallback.value = false;
    }
}

function handleFilterChange() {
    syncFiltersToRoute();
    fetchPlugins();
}

function handleRefresh() {
    fetchPlugins();
}

function handleConfigure(plugin) {
    if (!plugin.config || plugin.configCount === 0) {
        ElMessage.info("该插件暂无可配置项");
        return;
    }

    activePlugin.value = plugin;
    configDialogVisible.value = true;
}

function handleToggle(plugin) {
    if (!plugin.installed) {
        ElMessage.warning("插件尚未安装，暂不可启用");
        return;
    }

    const shouldEnable = !plugin.enabled;

    adminStore
        .togglePlugin(plugin.code, shouldEnable)
        .then(() => {
            ElMessage.success(shouldEnable ? "插件启用成功" : "插件停用成功");
            return fetchPlugins();
        })
        .catch((error) => {
            ElMessage.error(error?.message || "插件操作失败");
        });
}

function handleDelete(plugin) {
    if (!plugin.deletable) {
        ElMessage.warning("系统插件不可删除");
        return;
    }

    ElMessage.success("后续可接入删除接口");
}

onMounted(() => {
    filters.status = normalizeStatusFromQuery(route.query.status);
    filters.type = normalizeTypeFromQuery(route.query.type);
    filters.keyword =
        typeof route.query.keyword === "string" ? route.query.keyword : "";
    fetchPlugins();
});
</script>

<template>
    <section class="page-stack">
        <section class="plugin-overview">
            <div class="plugin-overview__card">
                <span>全部插件</span>
                <strong>{{ pluginSummary.total }}</strong>
            </div>
            <div class="plugin-overview__card">
                <span>已安装</span>
                <strong>{{ pluginSummary.installed }}</strong>
            </div>
            <div class="plugin-overview__card">
                <span>已启用</span>
                <strong>{{ pluginSummary.enabled }}</strong>
            </div>
            <div class="plugin-overview__card">
                <span>待升级</span>
                <strong>{{ pluginSummary.needUpgrade }}</strong>
            </div>
        </section>

        <SectionCard
            description="集中查看插件版本、状态与配置项数量，后续可接入启用/停用与配置弹窗。"
            title="插件列表"
        >
            <template #actions>
                <el-space wrap>
                    <el-input
                        v-model="filters.keyword"
                        class="plugin-filter"
                        placeholder="搜索插件名称/标识/作者"
                        @input="handleFilterChange"
                    />
                    <el-select
                        v-model="filters.status"
                        class="plugin-filter"
                        placeholder="状态"
                        @change="handleFilterChange"
                    >
                        <el-option
                            v-for="option in statusOptions"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                        />
                    </el-select>
                    <el-select
                        v-model="filters.type"
                        class="plugin-filter"
                        placeholder="类型"
                        @change="handleFilterChange"
                    >
                        <el-option
                            v-for="option in typeOptions"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                        />
                    </el-select>
                    <el-button
                        class="ghost-btn small"
                        type="info"
                        plain
                        @click="handleRefresh"
                    >
                        刷新列表
                    </el-button>
                </el-space>
            </template>

            <el-alert
                v-if="adminStore.pluginsError"
                :closable="false"
                class="dashboard-alert"
                show-icon
                title="插件接口加载失败，已显示空数据"
                type="warning"
            >
                <template #default>
                    {{ adminStore.pluginsError }}
                </template>
            </el-alert>

            <DataTableCard
                :columns="pluginColumns"
                :data="filteredPlugins"
                :loading="adminStore.pluginsLoading || pluginsLoadingFallback"
            >
                <template #type="{ row }">
                    {{ resolveTypeLabel(row.type) }}
                </template>
                <template #status="{ row }">
                    <el-tag
                        :type="resolveStatusType(row.status)"
                        class="plugin-status"
                        effect="dark"
                    >
                        <el-icon class="plugin-status__icon">
                            <component :is="resolveStatusIcon(row.status)" />
                        </el-icon>
                        {{ resolveStatusLabel(row.status) }}
                    </el-tag>
                </template>
                <template #actions="{ row }">
                    <el-space wrap>
                        <el-button
                            class="ghost-btn small"
                            type="info"
                            plain
                            @click="handleConfigure(row)"
                        >
                            配置
                        </el-button>
                        <el-button
                            class="primary-btn small"
                            type="success"
                            @click="handleToggle(row)"
                        >
                            {{ row.enabled ? "停用" : "启用" }}
                        </el-button>
                        <el-button
                            class="ghost-btn small"
                            type="danger"
                            plain
                            @click="handleDelete(row)"
                        >
                            删除
                        </el-button>
                    </el-space>
                </template>
            </DataTableCard>
        </SectionCard>
  </section>
  <PluginConfigDialog v-model="configDialogVisible" :plugin="activePlugin" />
</template>
