<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { marked } from "marked";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
    CircleCheck,
    Close,
    Document,
    Lock,
    Minus,
    Loading,
    Monitor,
    SetUp,
    Upload,
} from "@element-plus/icons-vue";

import SectionCard from "../components/common/SectionCard.vue";
import PluginConfigDialog from "../components/plugins/PluginConfigDialog.vue";
import { useAdminStore } from "../stores/admin";

const adminStore = useAdminStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const pluginsLoadingFallback = ref(false);
const uploadDialogVisible = ref(false);
const uploadRef = ref(null);
const uploadFileList = ref([]);
const uploadSubmitting = ref(false);
const configDialogVisible = ref(false);
const activePlugin = ref(null);
const readmeDialogVisible = ref(false);
const readmePlugin = ref(null);

const renderedReadme = computed(() => {
    const content = readmePlugin.value?.readme || "";
    if (!content) {
        return "";
    }

    return marked.parse(content, {
        breaks: true,
    });
});

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

const typeOptions = computed(() => {
    const remoteTypes = adminStore.pluginTypes.map((type) => ({
        label: type.label || type.value,
        value: type.value,
        description: type.description,
        icon: type.icon,
    }));

    return [{ label: "全部", value: "all" }, ...remoteTypes];
});

const statusStyleMap = new Map([
    ["enabled", { type: "success", icon: CircleCheck }],
    ["disabled", { type: "info", icon: Minus }],
    ["not_installed", { type: "danger", icon: Close }],
    ["protected", { type: "primary", icon: Lock }],
    ["unknown", { type: "warning", icon: Monitor }],
]);

function normalizeStatusKey(status) {
    const normalized = String(status || "")
        .trim()
        .toLowerCase();

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
    const hasMatch = typeOptions.value.find(
        (option) => option.value === normalized,
    );

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
        await adminStore.loadPluginTypes();
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

function openUploadDialog() {
    uploadDialogVisible.value = true;
}

function handleUploadFileChange(file, fileList) {
    uploadFileList.value = fileList.slice(-1);
}

function handleUploadRemove(file, fileList) {
    uploadFileList.value = fileList;
}

function handleUploadExceed() {
    ElMessage.warning("一次只能上传一个插件包");
}

function resetUploadState() {
    uploadSubmitting.value = false;
    uploadFileList.value = [];
    uploadRef.value?.clearFiles();
}

async function handleUploadRequest(options) {
    const file = options?.file;

    if (!file) {
        ElMessage.warning("请选择插件包");
        options?.onError?.(new Error("缺少上传文件"));
        return;
    }

    uploadSubmitting.value = true;

    try {
        await adminStore.uploadPlugin(file);
        options?.onSuccess?.({}, file);
        ElMessage.success("插件上传成功");
        uploadDialogVisible.value = false;
        resetUploadState();
        await fetchPlugins();
    } catch (error) {
        options?.onError?.(error);
        ElMessage.error(error?.message || "插件上传失败");
    } finally {
        uploadSubmitting.value = false;
    }
}

function handleConfigure(plugin) {
    if (!plugin.config || plugin.configCount === 0) {
        ElMessage.info("该插件暂无可配置项");
        return;
    }

    activePlugin.value = plugin;
    configDialogVisible.value = true;
}

function handleReadme(plugin) {
    readmePlugin.value = plugin;
    readmeDialogVisible.value = true;
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

function handleInstall(plugin) {
    adminStore
        .installPlugin(plugin.code)
        .then(() => {
            ElMessage.success("插件安装成功");
            return fetchPlugins();
        })
        .catch((error) => {
            ElMessage.error(error?.message || "插件安装失败");
        });
}

function handleUninstall(plugin) {
    if (!plugin.deletable) {
        ElMessage.warning("系统插件不可卸载");
        return;
    }

    ElMessageBox.confirm(
        `确认卸载插件「${plugin.name || plugin.code}」？`,
        "卸载插件",
        {
            confirmButtonText: "确认卸载",
            cancelButtonText: "取消",
            type: "warning",
        },
    )
        .then(() =>
            adminStore.uninstallPlugin(plugin.code).then(() => {
                ElMessage.success("插件卸载成功");
                return fetchPlugins();
            }),
        )
        .catch((error) => {
            if (error !== "cancel") {
                ElMessage.error(error?.message || "插件卸载失败");
            }
        });
}

function handleDelete(plugin) {
    if (!plugin.deletable) {
        ElMessage.warning("系统插件不可删除");
        return;
    }

    ElMessageBox.confirm(
        `确认删除插件「${plugin.name || plugin.code}」？此操作不可恢复。`,
        "删除插件",
        {
            confirmButtonText: "确认删除",
            cancelButtonText: "取消",
            type: "error",
        },
    )
        .then(() =>
            adminStore.deletePlugin(plugin.code).then(() => {
                ElMessage.success("插件删除成功");
                return fetchPlugins();
            }),
        )
        .catch((error) => {
            if (error !== "cancel") {
                ElMessage.error(error?.message || "插件删除失败");
            }
        });
}

onMounted(() => {
    filters.status = normalizeStatusFromQuery(route.query.status);
    const initialType = normalizeTypeFromQuery(route.query.type);
    filters.type = initialType === "all" ? "feature" : initialType;
    filters.keyword =
        typeof route.query.keyword === "string" ? route.query.keyword : "";
    fetchPlugins();
});
</script>

<template>
    <section class="page-stack">
        <SectionCard>
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
                        class="primary-btn small"
                        type="primary"
                        @click="openUploadDialog"
                    >
                        <el-icon>
                            <Upload />
                        </el-icon>
                        上传插件
                    </el-button>
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

            <div
                v-loading="adminStore.pluginsLoading || pluginsLoadingFallback"
                class="plugin-card-grid"
            >
                <div v-if="filteredPlugins.length === 0" class="plugin-empty">
                    <el-empty description="暂无符合条件的插件" />
                </div>
                <article
                    v-for="plugin in filteredPlugins"
                    :key="plugin.code"
                    class="plugin-card"
                >
                    <header class="plugin-card__header">
                        <div class="plugin-card__title">
                            <h3>{{ plugin.name || "--" }}</h3>
                            <el-tag class="plugin-card__tag" effect="plain">
                                {{ resolveTypeLabel(plugin.type) }}
                            </el-tag>
                            <el-tag
                                :type="resolveStatusType(plugin.status)"
                                class="plugin-card__tag"
                                effect="dark"
                            >
                                <el-icon class="plugin-status__icon">
                                    <component
                                        :is="resolveStatusIcon(plugin.status)"
                                    />
                                </el-icon>
                                {{ resolveStatusLabel(plugin.status) }}
                            </el-tag>
                        </div>
                        <el-button
                            class="plugin-card__readme"
                            text
                            circle
                            v-if="plugin.readme"
                            @click="handleReadme(plugin)"
                        >
                            <el-icon>
                                <Document />
                            </el-icon>
                        </el-button>
                    </header>
                    <div class="plugin-card__meta">
                        <span class="plugin-card__code">{{ plugin.code }}</span>
                        <span>v{{ plugin.version || "--" }}</span>
                        <span>作者: {{ plugin.author || "--" }}</span>
                    </div>
                    <p class="plugin-card__desc">
                        {{ plugin.description || "暂无描述" }}
                    </p>
                    <footer class="plugin-card__actions">
                        <el-space wrap>
                            <el-button
                                v-if="plugin.installed && plugin.enabled"
                                class="ghost-btn small"
                                type="info"
                                plain
                                @click="handleConfigure(plugin)"
                            >
                                配置
                            </el-button>
                            <el-button
                                v-if="!plugin.installed"
                                class="primary-btn small"
                                type="success"
                                @click="handleInstall(plugin)"
                            >
                                安装
                            </el-button>
                            <el-button
                                v-else
                                class="primary-btn small"
                                type="success"
                                @click="handleToggle(plugin)"
                            >
                                {{ plugin.enabled ? "停用" : "启用" }}
                            </el-button>
                            <el-button
                                v-if="plugin.installed"
                                class="ghost-btn small"
                                type="warning"
                                plain
                                @click="handleUninstall(plugin)"
                            >
                                卸载
                            </el-button>
                            <el-button
                                v-if="!plugin.installed"
                                class="ghost-btn small"
                                type="danger"
                                plain
                                @click="handleDelete(plugin)"
                            >
                                删除
                            </el-button>
                        </el-space>
                    </footer>
                </article>
            </div>
        </SectionCard>
    </section>
    <PluginConfigDialog v-model="configDialogVisible" :plugin="activePlugin" />
    <el-dialog
        v-model="uploadDialogVisible"
        class="plugin-upload-dialog"
        title="上传插件"
        width="560px"
        @close="resetUploadState"
    >
        <el-upload
            ref="uploadRef"
            :auto-upload="true"
            :file-list="uploadFileList"
            :limit="1"
            accept=".zip"
            drag
            class="plugin-upload"
            :http-request="handleUploadRequest"
            @change="handleUploadFileChange"
            @remove="handleUploadRemove"
            @exceed="handleUploadExceed"
        >
            <div class="plugin-upload__hint">
                <el-icon class="plugin-upload__icon">
                    <Upload />
                </el-icon>
                <p class="plugin-upload__title">拖拽插件包到此处，或 浏览</p>
                <p class="plugin-upload__subtitle">仅支持 .zip 格式文件</p>
            </div>
        </el-upload>
    </el-dialog>
    <el-dialog
        v-model="readmeDialogVisible"
        :title="readmePlugin?.name || '插件说明'"
        width="640px"
    >
        <div class="plugin-readme">
            <el-scrollbar max-height="60vh">
                <div v-if="readmePlugin?.readme" v-html="renderedReadme"></div>
                <el-empty v-else description="暂无 README" />
            </el-scrollbar>
        </div>
    </el-dialog>
</template>

<style scoped>
.plugin-card-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
}


.plugin-upload :deep(.el-upload-dragger) {
    padding: 32px 20px;
    border-radius: 16px;
    border: 1px dashed var(--el-border-color-light);
    background: var(--el-fill-color-lighter);
}

.plugin-upload__hint {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: var(--el-text-color-regular);
}

.plugin-upload__icon {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: var(--el-color-primary);
    background: rgba(64, 158, 255, 0.12);
}

.plugin-upload__title {
    margin: 0;
    font-size: 14px;
    color: var(--el-text-color-primary);
}

.plugin-upload__subtitle {
    margin: 0;
    font-size: 12px;
    color: var(--el-text-color-secondary);
}

.plugin-empty {
    padding: 32px 0;
}

.plugin-card {
    padding: 18px 20px;
    border-radius: 16px;
    border: 1px solid var(--el-border-color-lighter);
    background: var(--el-bg-color);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
    display: grid;
    gap: 12px;
}

.plugin-card__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
}

.plugin-card__title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
}

.plugin-card__title h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
}

.plugin-card__readme {
    align-self: flex-start;
    color: var(--el-text-color-secondary);
}

.plugin-card__readme:hover {
    color: var(--el-color-primary);
}

.plugin-card__tag {
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
}

.plugin-card__tag :deep(.el-tag__content) {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.plugin-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
}

.plugin-card__code {
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--el-fill-color-lighter);
    font-family: "Fira Code", monospace;
    color: var(--el-text-color-regular);
}

.plugin-card__desc {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--el-text-color-regular);
}

.plugin-card__actions {
    display: flex;
    justify-content: flex-end;
}

.plugin-readme {
    font-size: 13px;
    line-height: 1.7;
    color: var(--el-text-color-regular);
}

.plugin-readme :deep(h1),
.plugin-readme :deep(h2),
.plugin-readme :deep(h3) {
    margin: 16px 0 8px;
    font-weight: 600;
    color: var(--el-text-color-primary);
}

.plugin-readme :deep(p) {
    margin: 0 0 10px;
}

.plugin-readme :deep(ul),
.plugin-readme :deep(ol) {
    margin: 0 0 10px 18px;
    padding: 0;
}

.plugin-readme :deep(code) {
    padding: 2px 6px;
    border-radius: 6px;
    background: var(--el-fill-color-lighter);
    font-family: "Fira Code", monospace;
    font-size: 12px;
}

.plugin-readme :deep(pre) {
    margin: 10px 0 14px;
    padding: 12px 14px;
    border-radius: 10px;
    background: var(--el-fill-color-lighter);
    overflow: auto;
}

.plugin-readme :deep(pre code) {
    padding: 0;
    background: transparent;
}

.plugin-status__icon {
    margin-right: 0;
    display: inline-flex;
    align-items: center;
}

@media (max-width: 720px) {
    .plugin-card {
        padding: 16px;
    }

    .plugin-card__actions {
        justify-content: flex-start;
    }
}
</style>
