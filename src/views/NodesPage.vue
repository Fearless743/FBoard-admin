<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
    DataLine,
    Delete,
    Edit,
    Monitor,
    Refresh,
    Search,
    CopyDocument,
    Plus,
} from "@element-plus/icons-vue";

import { useAdminStore } from "../stores/admin";
import NodeConfigDialog from "../components/nodes/NodeConfigDialog.vue";

const adminStore = useAdminStore();
const route = useRoute();
const router = useRouter();

function createFallbackNodeModel(node, index) {
    return {
        id: `NODE-${1000 + index}`,
        name: node.name,
        type: node.type,
        rate: node.rate,
        status: node.status === "正常" ? "在线" : node.status,
        load:
            node.status === "高负载"
                ? 86
                : node.status === "维护中"
                  ? 0
                  : 42 + index * 11,
        onlineUsers: node.status === "维护中" ? 0 : 132 + index * 37,
        lastCheck: index === 0 ? "刚刚" : index === 1 ? "2 分钟前" : "9 分钟前",
        priority: index + 1,
        groupIds: [],
        groupNames: [],
        tags:
            index === 0
                ? ["主力", "低延迟"]
                : index === 1
                  ? ["备用"]
                  : ["维护"],
        remark: "",
        lastPushAt: "--",
        cacheKey: "--",
    };
}

function cloneManagedNode(node) {
    return {
        ...node,
        groupIds: Array.isArray(node.groupIds) ? [...node.groupIds] : [],
        groupNames: Array.isArray(node.groupNames) ? [...node.groupNames] : [],
        tags: Array.isArray(node.rawTags)
            ? [...node.rawTags]
            : Array.isArray(node.tags)
              ? [...node.tags]
              : [],
    };
}

function buildNodeListFromStore() {
    if (adminStore.managedNodes.length > 0) {
        return adminStore.managedNodes.map(function mapManagedNode(node) {
            return cloneManagedNode(node);
        });
    }

    return adminStore.nodes.map(function mapFallbackNode(node, index) {
        return createFallbackNodeModel(node, index);
    });
}

const nodeList = ref(buildNodeListFromStore());
const nodeDialogVisible = ref(false);
const nodeDialogMode = ref("create");
const nodeDialogProtocol = ref("shadowsocks");
const activeNode = ref(null);

const filters = reactive({
    keyword: adminStore.managedNodesFilters?.word || "",
    protocol: adminStore.managedNodesFilters?.type || "all",
    status: "all",
    group: "all",
    abnormalOnly: false,
});

const statusOptions = ["all", "1", "2", "0"];
const statusLabelMap = new Map([
    ["在线", "1"],
    ["异常", "2"],
    ["离线", "0"],
]);

function normalizeStatusFromQuery(status) {
    if (!status) {
        return "all";
    }

    const normalized = Array.isArray(status) ? status[0] : status;
    const mapped = statusLabelMap.get(normalized);

    if (statusOptions.includes(normalized)) {
        return normalized;
    }

    return statusOptions.includes(mapped) ? mapped : "all";
}

function resolveStatusLabel(status) {
    if (status === "1") {
        return "在线";
    }

    if (status === "2") {
        return "异常";
    }

    if (status === "0") {
        return "离线";
    }

    return status;
}

function syncStatusToRoute(status) {
    const nextStatus = status && status !== "all" ? status : "";
    const nextQuery = { ...route.query };

    if (nextStatus) {
        nextQuery.status = nextStatus;
    } else {
        delete nextQuery.status;
    }

    if (
        (nextQuery.status || "") === (route.query.status || "") &&
        Object.keys(nextQuery).length === Object.keys(route.query).length
    ) {
        return;
    }

    router.replace({ query: nextQuery });
}

const fallbackPagination = {
    page: 1,
    limit: 10,
    total: 0,
};

let keywordDebounceTimer = null;

watch(
    function watchManagedNodes() {
        return adminStore.managedNodes;
    },
    function syncManagedNodes() {
        nodeList.value = buildNodeListFromStore();
    },
    {
        deep: true,
    },
);

onMounted(function loadManagedNodesOnMount() {
    const initialStatus = normalizeStatusFromQuery(route.query.status);
    filters.status = initialStatus;

    adminStore.loadManagedNodes({
        page: 1,
        limit: pagination.value.limit,
        filters: {
            type: filters.protocol,
            word: filters.keyword,
            status: initialStatus,
        },
    });
    adminStore.loadManagedNodeGroups();
    adminStore.loadManagedNodeRoutes();
});

watch(
    function watchManagedNodeFilters() {
        return adminStore.managedNodesFilters?.type;
    },
    function syncManagedNodeType(type) {
        filters.protocol = type || "all";
    },
);

watch(
    function watchManagedNodeStatus() {
        return adminStore.managedNodesFilters?.status;
    },
    function syncManagedNodeStatus(status) {
        filters.status = status || "all";
    },
);

watch(
    function watchRouteStatus() {
        return route.query.status;
    },
    function syncRouteStatus(nextStatus) {
        const normalizedStatus = normalizeStatusFromQuery(nextStatus);

        if (filters.status === normalizedStatus) {
            return;
        }

        filters.status = normalizedStatus;
        handleStatusChange(normalizedStatus);
    },
);

watch(
    function watchKeywordInput() {
        return filters.keyword;
    },
    function debounceKeywordSearch(nextKeyword) {
        if (nextKeyword === (adminStore.managedNodesFilters?.word || "")) {
            return;
        }

        if (keywordDebounceTimer) {
            clearTimeout(keywordDebounceTimer);
        }

        keywordDebounceTimer = setTimeout(function runDebouncedSearch() {
            handleKeywordSearch();
        }, 450);
    },
);

const pagination = computed(function pagination() {
    const storePagination =
        adminStore.managedNodesPagination || fallbackPagination;

    return {
        page: Number(storePagination.page || 1),
        limit: Number(storePagination.limit || 10),
        total: Number(storePagination.total || 0),
    };
});

const protocolOptions = ref([
    "shadowsocks",
    "trojan",
    "vmess",
    "hysteria",
    "vless",
    "anytls",
    "mieru",
    "tuic",
]);

const groupNameById = computed(function groupNameById() {
    return adminStore.managedNodeGroups.reduce(function reduceGroups(
        map,
        group,
    ) {
        map.set(group.id, group.name);
        return map;
    }, new Map());
});

const groupIdByName = computed(function groupIdByName() {
    return adminStore.managedNodeGroups.reduce(function reduceGroups(
        map,
        group,
    ) {
        const name = String(group.name || "").trim();
        if (name) {
            map.set(name, String(group.id));
        }
        return map;
    }, new Map());
});

const groupOptions = computed(function groupOptions() {
    if (adminStore.managedNodeGroups.length > 0) {
        return adminStore.managedNodeGroups.map(function mapGroup(group) {
            return {
                value: group.id,
                label: group.name,
            };
        });
    }

    const fallbackNames = new Set();
    nodeList.value.forEach(function collectFallbackGroups(node) {
        (node.groupNames || []).forEach(function collectName(name) {
            if (name) {
                fallbackNames.add(name);
            }
        });
    });

    return Array.from(fallbackNames).map(function mapFallbackName(name) {
        return {
            value: name,
            label: name,
        };
    });
});

const parentNodeOptions = computed(function parentNodeOptions() {
    return nodeList.value.map(function mapNode(node) {
        return {
            value: String(node.id),
            label: `${node.name} (${node.id})`,
        };
    });
});

const routeGroupOptions = computed(function routeGroupOptions() {
    if (adminStore.managedNodeRoutes.length > 0) {
        return adminStore.managedNodeRoutes.map(function mapRoute(route) {
            return {
                value: route.id,
                label: `${route.remarks} · ${route.action}`,
            };
        });
    }

    const fallbackNames = new Set();
    nodeList.value.forEach(function collectRouteGroup(node) {
        const routeId = String(node.routeId || node.routeGroup || "").trim();
        if (routeId) {
            fallbackNames.add(routeId);
        }
    });

    return Array.from(fallbackNames).map(function mapFallbackRoute(routeId) {
        return {
            value: routeId,
            label: `路由组 ${routeId}`,
        };
    });
});

const filteredNodes = computed(function filteredNodes() {
    return nodeList.value.filter(function filterNode(node) {
        const shouldFilterStatus = adminStore.managedNodes.length === 0;
        const expectedStatus = resolveStatusLabel(filters.status);
        const matchesStatus =
            !shouldFilterStatus ||
            filters.status === "all" ||
            node.status === expectedStatus;
        const normalizedGroup = String(filters.group || "all").trim();
        const nodeGroupIds = Array.isArray(node.groupIds)
            ? node.groupIds.map(String)
            : [];
        const nodeGroupNames = Array.isArray(node.groupNames)
            ? node.groupNames.map(String)
            : [];
        const resolvedGroups = resolveNodeGroups(node).map(String);
        const matchesGroup =
            normalizedGroup === "all" ||
            nodeGroupIds.includes(normalizedGroup) ||
            nodeGroupNames.includes(normalizedGroup) ||
            resolvedGroups.includes(normalizedGroup);
        const matchesAbnormal =
            !filters.abnormalOnly ||
            node.status === "高负载" ||
            node.status === "维护中";

        return matchesStatus && matchesGroup && matchesAbnormal;
    });
});

const stats = computed(function stats() {
    const total = nodeList.value.length;
    const healthy = nodeList.value.filter(function isHealthy(node) {
        return node.status === "在线";
    }).length;
    const idle = nodeList.value.filter(function isIdle(node) {
        return node.status === "异常";
    }).length;
    const offline = nodeList.value.filter(function isOffline(node) {
        return node.status === "离线";
    }).length;

    return {
        total,
        healthy,
        idle,
        offline,
    };
});

const statusSummary = computed(function statusSummary() {
    const healthy = nodeList.value.filter(function isHealthy(node) {
        return node.status === "在线";
    }).length;
    const idle = nodeList.value.filter(function isIdle(node) {
        return node.status === "异常";
    }).length;
    const offline = nodeList.value.filter(function isOffline(node) {
        return node.status === "离线";
    }).length;

    return [
        { value: "all", label: "全部节点", count: nodeList.value.length },
        { value: "1", label: "在线节点", count: healthy },
        { value: "2", label: "异常节点", count: idle },
        { value: "0", label: "离线节点", count: offline },
    ];
});

function resolveStatusType(status) {
    if (status === "在线" || status === "正常") {
        return "success";
    }

    if (status === "异常") {
        return "warning";
    }

    return "danger";
}

function resolveNodeTypeTagClass(type) {
    const normalizedType = String(type || "").toLowerCase();

    if (normalizedType === "shadowsocks") {
        return "node-type-tag--shadowsocks";
    }

    if (normalizedType === "trojan") {
        return "node-type-tag--trojan";
    }

    if (normalizedType === "vmess") {
        return "node-type-tag--vmess";
    }

    if (normalizedType === "hysteria") {
        return "node-type-tag--hysteria";
    }

    if (normalizedType === "vless") {
        return "node-type-tag--vless";
    }

    if (normalizedType === "anytls") {
        return "node-type-tag--anytls";
    }

    if (normalizedType === "mieru") {
        return "node-type-tag--mieru";
    }

    if (normalizedType === "tuic") {
        return "node-type-tag--tuic";
    }

    return "node-type-tag--default";
}

const copyAddress = (node) => {
    const address = `${node.host}:${node.port}`;
    navigator.clipboard.writeText(address);
};

function resolveNodeGroups(node) {
    if (Array.isArray(node.groupNames) && node.groupNames.length > 0) {
        return node.groupNames;
    }

    if (Array.isArray(node.groupIds) && node.groupIds.length > 0) {
        return node.groupIds.map(function mapGroupId(groupId) {
            return groupNameById.value.get(groupId) || `组#${groupId}`;
        });
    }

    return ["未分组"];
}

function handleCreateNodeCommand(protocol) {
    openCreateNodeDialog(protocol);
}

function runBatchHealthCheck() {
    adminStore.loadManagedNodes({
        page: pagination.value.page,
        limit: pagination.value.limit,
        filters: {
            type: filters.protocol,
            word: filters.keyword,
            status: filters.status,
        },
    });
    ElMessage.success("已刷新当前节点列表");
}

function openCreateNodeDialog(protocol = "shadowsocks") {
    nodeDialogMode.value = "create";
    nodeDialogProtocol.value = String(protocol || "shadowsocks").toLowerCase();
    activeNode.value = null;
    nodeDialogVisible.value = true;
}

function openEditNodeDialog(node) {
    nodeDialogMode.value = "edit";
    nodeDialogProtocol.value = String(node?.type || "shadowsocks").toLowerCase();
    const nextNode = cloneManagedNode(node);

    if (Array.isArray(nextNode.groupNames) && nextNode.groupNames.length > 0) {
        const mappedGroupIds = nextNode.groupNames
            .map(function mapGroupName(name) {
                return groupIdByName.value.get(String(name || "").trim()) || "";
            })
            .filter(Boolean);

        if (mappedGroupIds.length > 0) {
            nextNode.groupIds = Array.from(new Set(mappedGroupIds));
        }
    }

    activeNode.value = nextNode;
    nodeDialogVisible.value = true;
}

async function handleDeleteNode(node) {
    try {
        await ElMessageBox.confirm(
            `确认删除节点「${node?.name || ""}」吗？`,
            "删除节点",
            {
                type: "warning",
                confirmButtonText: "删除",
                cancelButtonText: "取消",
            },
        );
        await adminStore.deleteManagedNodeItem(node?.rawId || node?.id);
        await adminStore.loadManagedNodes({
            page: pagination.value.page,
            limit: pagination.value.limit,
            filters: {
                type: filters.protocol,
                word: filters.keyword,
                status: filters.status,
            },
        });
        ElMessage.success("节点已删除");
    } catch (error) {
        if (error === "cancel") {
            return;
        }
        ElMessage.error(
            error instanceof Error ? error.message : "删除节点失败",
        );
    }
}

async function handleCopyNode(node) {
    try {
        await adminStore.copyManagedNodeItem(node?.rawId || node?.id);
        await adminStore.loadManagedNodes({
            page: pagination.value.page,
            limit: pagination.value.limit,
            filters: {
                type: filters.protocol,
                word: filters.keyword,
                status: filters.status,
            },
        });
        ElMessage.success("节点已复制");
    } catch (error) {
        ElMessage.error(
            error instanceof Error ? error.message : "复制节点失败",
        );
    }
}

async function handleNodeDialogSubmit(payload) {
    const isEditing = nodeDialogMode.value === "edit";
    const protocolType = String(
        payload.protocol || nodeDialogProtocol.value || "shadowsocks",
    ).toLowerCase();
    const selectedRouteId = String(payload.routeGroup || "").trim();
    const protocolSettings =
        protocolType === "vmess"
            ? {
                  tls: payload.tls === "tls" ? 1 : 0,
                  network: String(payload.transportProtocol || "tcp"),
                  transport_config: String(payload.transportConfig || "").trim(),
              }
            : {
                  cipher: payload.encryption,
                  plugin: payload.plugin === "None" ? "" : payload.plugin,
                  plugin_opts: "",
                  client_fingerprint: "chrome",
              };

    try {
        await adminStore.saveManagedNodeItem({
            id: isEditing ? Number(activeNode.value?.rawId || activeNode.value?.id || 0) || null : null,
            specificKey: null,
            code: "",
            show: false,
            name: payload.name,
            rate: String(payload.baseRate || 1),
            rateTimeEnable: Boolean(payload.dynamicRate),
            rateTimeRanges: Array.isArray(payload.dynamicRules)
                ? payload.dynamicRules
                : [],
            tags: Array.isArray(payload.tags) ? payload.tags : [],
            excludes: [],
            ips: [],
            groupIds: Array.isArray(payload.groupIds) ? payload.groupIds : [],
            host: payload.host,
            port: payload.port,
            serverPort: payload.serverPort,
            parentId: payload.parentId || "0",
            routeIds: selectedRouteId ? [selectedRouteId] : [],
            protocolSettings,
            type: protocolType,
        });

        await adminStore.loadManagedNodes({
            page: pagination.value.page,
            limit: pagination.value.limit,
            filters: {
                type: filters.protocol,
                word: filters.keyword,
                status: filters.status,
            },
        });

        nodeDialogVisible.value = false;
        activeNode.value = null;

        if (isEditing) {
            ElMessage.success("节点已更新");
        } else {
            ElMessage.success(
                `${protocolType.toUpperCase()} 节点已添加`,
            );
        }
    } catch (error) {
        ElMessage.error(
            error instanceof Error ? error.message : "保存节点失败",
        );
    }
}

function applyQuickStatus(status) {
    filters.status = status;
    handleStatusChange(status);
}

function handleProtocolChange(protocol) {
    adminStore.loadManagedNodes({
        page: 1,
        limit: pagination.value.limit,
        filters: {
            type: protocol,
            word: filters.keyword,
            status: filters.status,
        },
    });
}

function handleStatusChange(status) {
    syncStatusToRoute(status);
    adminStore.loadManagedNodes({
        page: 1,
        limit: pagination.value.limit,
        filters: {
            type: filters.protocol,
            word: filters.keyword,
            status,
        },
    });
}

function handleKeywordSearch() {
    if (keywordDebounceTimer) {
        clearTimeout(keywordDebounceTimer);
        keywordDebounceTimer = null;
    }

    adminStore.loadManagedNodes({
        page: 1,
        limit: pagination.value.limit,
        filters: {
            type: filters.protocol,
            word: filters.keyword,
            status: filters.status,
        },
    });
}

function handleKeywordClear() {
    handleKeywordSearch();
}

function handlePageSizeChange(limit) {
    adminStore.loadManagedNodes({
        page: 1,
        limit,
        filters: {
            type: filters.protocol,
            word: filters.keyword,
            status: filters.status,
        },
    });
}

function handlePageChange(page) {
    adminStore.loadManagedNodes({
        page,
        limit: pagination.value.limit,
        filters: {
            type: filters.protocol,
            word: filters.keyword,
            status: filters.status,
        },
    });
}

onUnmounted(function clearDebounceOnUnmount() {
    if (keywordDebounceTimer) {
        clearTimeout(keywordDebounceTimer);
        keywordDebounceTimer = null;
    }
});
</script>

<template>
    <section class="page-stack nodes-page">
        <el-alert
            v-if="adminStore.managedNodesError"
            :closable="false"
            :title="adminStore.managedNodesError"
            class="dashboard-alert"
            type="warning"
        >
            <template #default>
                节点接口加载失败，当前展示的是本地兜底节点数据。
            </template>
        </el-alert>

        <el-card class="section-card nodes-hero" shadow="never">
            <div class="nodes-hero__intro">
                <div>
                    <span class="nodes-hero__eyebrow">Node Control Center</span>
                    <h2>节点管理</h2>
                    <p>
                        保留当前深色配色，并将节点列表重组为更接近参考图的运营视图：顶部摘要、快捷筛选、紧凑表格与分页操作。
                    </p>
                </div>

                <el-space wrap>
                    <el-button
                        class="ghost-btn"
                        type="primary"
                        @click="openCreateNodeDialog('shadowsocks')"
                    >
                        <el-icon><Plus /></el-icon>
                        添加 Shadowsocks
                    </el-button>
                    <el-button
                        class="ghost-btn"
                        type="primary"
                        plain
                        @click="openCreateNodeDialog('vmess')"
                    >
                        <el-icon><Plus /></el-icon>
                        添加 VMess
                    </el-button>
                    <el-button
                        class="ghost-btn"
                        type="info"
                        plain
                        @click="runBatchHealthCheck"
                    >
                        <el-icon><Refresh /></el-icon>
                        刷新节点
                    </el-button>
                </el-space>
            </div>
        </el-card>

        <el-card class="section-card nodes-workspace" shadow="never">
            <template #header>
                <div class="section-head">
                    <div>
                        <h3>节点列表</h3>
                        <p>
                            通过类型、状态筛选快速定位节点，先聚焦真实可用的列表管理能力。
                        </p>
                    </div>
                </div>
            </template>

            <div class="node-toolbar">
                <el-input
                    v-model="filters.keyword"
                    clearable
                    placeholder="搜索节点名称/地区"
                    class="node-search"
                    @keyup.enter="handleKeywordSearch"
                    @clear="handleKeywordClear"
                >
                    <template #prefix>
                        <el-icon><Search /></el-icon>
                    </template>
                </el-input>

                <el-select
                    v-model="filters.protocol"
                    class="node-select"
                    placeholder="协议"
                    @change="handleProtocolChange"
                >
                    <el-option label="全部协议" value="all" />
                    <el-option
                        v-for="protocol in protocolOptions"
                        :key="protocol"
                        :label="protocol"
                        :value="protocol"
                    />
                </el-select>

                <el-select
                    v-model="filters.status"
                    class="node-select"
                    placeholder="状态"
                    @change="handleStatusChange"
                >
                    <el-option label="全部状态" value="all" />
                    <el-option label="在线" value="1" />
                    <el-option label="异常" value="2" />
                    <el-option label="离线" value="0" />
                </el-select>
            </div>

            <el-table
                :data="filteredNodes"
                v-loading="adminStore.managedNodesLoading"
                class="dashboard-table node-table"
            >
                <el-table-column label="ID" min-width="80">
                    <template #default="{ row }">
                        <div class="node-name-cell">
                            <el-tag
                                :class="[
                                    'node-type-tag',
                                    resolveNodeTypeTagClass(row.type),
                                ]"
                                type="info"
                                effect="dark"
                            >
                                {{ row.id }}
                                <a v-if="row.parentId != 0 && row.parentId">
                                    -> {{ row.parentId }}
                                </a>
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="节点" min-width="120">
                    <template #default="{ row }">
                        <div class="node-name-cell">
                            <strong>{{ row.name }}</strong>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="地址" min-width="200">
                    <template #default="{ row }">
                        <div class="node-name-cell">
                            <strong
                                >{{ row.host }}:{{ row.port }}({{
                                    row.serverPort
                                }})<el-button
                                    type="text"
                                    @click="copyAddress(row)"
                                >
                                    <el-icon
                                        ><CopyDocument
                                    /></el-icon> </el-button
                            ></strong>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="倍率" min-width="40" prop="rate" />

                <el-table-column
                    label="在线用户"
                    min-width="40"
                    prop="onlineUsers"
                />

                <el-table-column label="状态" min-width="50">
                    <template #default="{ row }">
                        <el-tag
                            :type="resolveStatusType(row.status)"
                            effect="dark"
                        >
                            {{ row.status }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="权限组" min-width="80">
                    <template #default="{ row }">
                        <div class="node-tags">
                            <el-tag
                                v-for="groupName in resolveNodeGroups(row)"
                                :key="`${row.id}-group-${groupName}`"
                                effect="plain"
                                size="small"
                            >
                                {{ groupName }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="90" fixed="right">
                    <template #default="{ row }">
                        <el-dropdown trigger="click">
                            <el-button class="node-action-trigger" type="primary" plain>
                                ...
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu class="node-action-menu">
                                    <el-dropdown-item @click="openEditNodeDialog(row)">
                                        <el-icon><Edit /></el-icon>
                                        编辑
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="handleCopyNode(row)">
                                        <el-icon><CopyDocument /></el-icon>
                                        复制
                                    </el-dropdown-item>
                                    <el-dropdown-item
                                        class="node-action-menu__danger"
                                        @click="handleDeleteNode(row)"
                                    >
                                        <el-icon><Delete /></el-icon>
                                        删除
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>

            <div class="node-pagination">
                <div class="node-pagination__summary">
                    <span class="node-pagination__eyebrow">分页导航</span>
                    <strong>
                        第 {{ pagination.page }} 页 · 共
                        {{
                            Math.max(
                                1,
                                Math.ceil(
                                    (pagination.total || 0) / pagination.limit,
                                ),
                            )
                        }}
                        页
                    </strong>
                    <span>
                        当前每页 {{ pagination.limit }} 条，累计
                        {{ pagination.total }} 条节点记录
                    </span>
                </div>

                <el-pagination
                    background
                    :current-page="pagination.page"
                    :page-size="pagination.limit"
                    :page-sizes="[10, 20, 50, 100, 500]"
                    :total="pagination.total"
                    :disabled="adminStore.managedNodesLoading"
                    layout="sizes, prev, pager, next, jumper"
                    @current-change="handlePageChange"
                    @size-change="handlePageSizeChange"
                />
            </div>
        </el-card>

        <node-config-dialog
            v-model="nodeDialogVisible"
            :mode="nodeDialogMode"
            :protocol="nodeDialogProtocol"
            :node="activeNode"
            :group-options="groupOptions"
            :parent-options="parentNodeOptions"
            :route-options="routeGroupOptions"
            @submit="handleNodeDialogSubmit"
        />
    </section>
</template>

<style scoped>
.nodes-page {
    gap: 18px;
}

.nodes-hero {
    border: 1px solid var(--line);
    background:
        radial-gradient(
            circle at top left,
            rgba(59, 130, 246, 0.14),
            transparent 34%
        ),
        radial-gradient(
            circle at bottom right,
            rgba(34, 197, 94, 0.12),
            transparent 30%
        ),
        linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(8, 17, 34, 0.92));
}

.nodes-hero__intro {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 18px;
}

.nodes-hero__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background: rgba(8, 17, 34, 0.58);
    color: #cbd5e1;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
}

.nodes-hero__intro h2 {
    margin: 14px 0 10px;
    font-size: 30px;
    line-height: 1.15;
}

.nodes-hero__intro p {
    max-width: 760px;
    margin: 0;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.7;
}

.node-stat-grid--flat {
    gap: 16px;
}

.node-stat-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
}

.node-stat-card {
    padding: 20px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: linear-gradient(
        180deg,
        rgba(15, 23, 42, 0.96),
        rgba(8, 17, 34, 0.9)
    );
    box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.05);
}

.node-stat-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--muted);
    font-size: 13px;
}

.node-stat-card strong {
    display: block;
    margin-top: 2px;
    font-family: "Fira Code", monospace;
    font-size: 30px;
    line-height: 1.2;
}

.node-stat-card p {
    margin: 10px 0 0;
    color: var(--muted);
    font-size: 12px;
}

.nodes-workspace {
    border: 1px solid var(--line);
}

.nodes-workspace__meta {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 10px;
    color: var(--muted);
    font-size: 12px;
}

.nodes-workspace__meta span {
    padding: 7px 12px;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background: rgba(8, 17, 34, 0.48);
}

.node-status-tabs {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 14px;
}

.node-status-tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 15px 16px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: rgba(8, 17, 34, 0.5);
    color: var(--muted);
    cursor: pointer;
    transition: 0.2s ease;
}

.node-status-tab span {
    font-size: 13px;
    font-weight: 600;
}

.node-status-tab strong {
    color: var(--text);
    font-family: "Fira Code", monospace;
    font-size: 18px;
}

.node-status-tab:hover,
.node-status-tab.active {
    border-color: rgba(74, 222, 128, 0.34);
    background: linear-gradient(
        145deg,
        rgba(34, 197, 94, 0.16),
        rgba(59, 130, 246, 0.08)
    );
    color: #dbeafe;
}

.node-toolbar {
    display: grid;
    grid-template-columns: minmax(260px, 2.2fr) repeat(3, minmax(140px, 1fr));
    gap: 12px;
    margin-bottom: 14px;
}

.node-toolbar--sub {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
}

.node-toolbar__hint {
    padding: 11px 14px;
    border-radius: 14px;
    border: 1px solid var(--line);
    background: rgba(8, 17, 34, 0.42);
    color: var(--muted);
    font-size: 13px;
}

.node-toolbar__hint strong {
    color: var(--text);
    font-family: "Fira Code", monospace;
}

.node-search,
.node-select {
    width: 100%;
}

.node-table :deep(.el-progress) {
    margin-bottom: 6px;
}

.node-table :deep(.el-table__inner-wrapper::before) {
    background: rgba(148, 163, 184, 0.14);
}

.node-table :deep(.el-table__header-wrapper th) {
    background: rgba(10, 18, 32, 0.92);
    color: #c9d5e5;
    border-bottom: 1px solid rgba(148, 163, 184, 0.14);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.node-table :deep(.el-table__header-wrapper th.is-leaf) {
    border-bottom: 1px solid rgba(148, 163, 184, 0.14);
}

.node-table :deep(.el-table__body-wrapper td) {
    background: rgba(5, 11, 24, 0.72);
    border-bottom: 1px solid rgba(148, 163, 184, 0.08);
    transition: background 0.2s ease;
}

.node-table :deep(.el-table__row:hover > td) {
    background: rgba(16, 28, 48, 0.88) !important;
}

.node-table :deep(.el-table__body tr.current-row > td) {
    background: rgba(24, 39, 66, 0.9);
}

.node-table :deep(.el-table__body tr:hover .node-type-tag) {
    transform: translateY(-1px);
}

.node-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px solid rgba(148, 163, 184, 0.12);
}

.node-pagination__summary {
    display: grid;
    gap: 4px;
}

.node-pagination__eyebrow {
    color: rgba(148, 163, 184, 0.72);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.node-pagination__summary strong {
    color: var(--text);
    font-size: 15px;
    font-weight: 700;
}

.node-pagination__summary span:last-child {
    color: var(--muted);
    font-size: 13px;
}

.node-pagination :deep(.el-pagination) {
    --el-pagination-bg-color: transparent;
    --el-pagination-text-color: var(--muted);
    --el-pagination-button-color: var(--text);
    --el-pagination-button-bg-color: rgba(15, 23, 42, 0.8);
    --el-pagination-button-disabled-bg-color: rgba(15, 23, 42, 0.35);
    --el-pagination-button-disabled-color: rgba(148, 163, 184, 0.45);
    --el-pagination-hover-color: #86efac;
    --el-pagination-font-size: 13px;
}

.node-pagination :deep(.el-pagination__sizes) {
    margin-right: 10px;
}

.node-pagination :deep(.btn-prev),
.node-pagination :deep(.btn-next),
.node-pagination :deep(.number),
.node-pagination :deep(.el-select .el-input__wrapper) {
    border: 1px solid rgba(148, 163, 184, 0.14);
    box-shadow: none;
}

.node-pagination :deep(.btn-prev),
.node-pagination :deep(.btn-next),
.node-pagination :deep(.number) {
    min-width: 34px;
    border-radius: 10px;
}

.node-pagination :deep(.el-select .el-input__wrapper) {
    border-radius: 10px;
    background: rgba(15, 23, 42, 0.82);
}

.node-pagination :deep(.number.is-active) {
    background: linear-gradient(
        135deg,
        rgba(34, 197, 94, 0.22),
        rgba(59, 130, 246, 0.2)
    );
    border-color: rgba(96, 165, 250, 0.24);
    color: #f8fafc;
}

.node-pagination :deep(.el-pagination__total),
.node-pagination :deep(.el-pagination__jump) {
    color: var(--muted);
}

.node-name-cell {
    display: grid;
    gap: 8px;
}

.node-name-cell strong {
    font-family: "Fira Code", monospace;
    color: #f8fafc;
}

.node-name-cell span {
    color: #8fa3ba;
    font-size: 12px;
    line-height: 1.5;
}

.node-type-tag {
    border: 1px solid transparent;
    color: #eff6ff;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        border-color 0.2s ease;
}

.node-type-tag.node-type-tag--shadowsocks {
    background: linear-gradient(
        135deg,
        rgba(37, 99, 235, 0.46),
        rgba(59, 130, 246, 0.2)
    );
    border-color: rgba(147, 197, 253, 0.28);
}

.node-type-tag.node-type-tag--trojan {
    background: linear-gradient(
        135deg,
        rgba(126, 34, 206, 0.46),
        rgba(168, 85, 247, 0.2)
    );
    border-color: rgba(216, 180, 254, 0.28);
}

.node-type-tag.node-type-tag--vmess {
    background: linear-gradient(
        135deg,
        rgba(8, 145, 178, 0.46),
        rgba(14, 165, 233, 0.2)
    );
    border-color: rgba(165, 243, 252, 0.28);
}

.node-type-tag.node-type-tag--hysteria {
    background: linear-gradient(
        135deg,
        rgba(234, 88, 12, 0.46),
        rgba(249, 115, 22, 0.22)
    );
    border-color: rgba(253, 186, 116, 0.3);
}

.node-type-tag.node-type-tag--vless {
    background: linear-gradient(
        135deg,
        rgba(22, 163, 74, 0.46),
        rgba(34, 197, 94, 0.2)
    );
    border-color: rgba(134, 239, 172, 0.28);
}

.node-type-tag.node-type-tag--anytls {
    background: linear-gradient(
        135deg,
        rgba(219, 39, 119, 0.46),
        rgba(236, 72, 153, 0.2)
    );
    border-color: rgba(249, 168, 212, 0.3);
}

.node-type-tag.node-type-tag--mieru {
    background: linear-gradient(
        135deg,
        rgba(202, 138, 4, 0.46),
        rgba(234, 179, 8, 0.22)
    );
    border-color: rgba(253, 224, 71, 0.3);
    color: #fef9c3;
}

.node-type-tag.node-type-tag--tuic {
    background: linear-gradient(
        135deg,
        rgba(124, 58, 237, 0.5),
        rgba(79, 70, 229, 0.24)
    );
    border-color: rgba(167, 139, 250, 0.34);
    color: #ede9fe;
}

.node-type-tag.node-type-tag--default {
    background: linear-gradient(
        135deg,
        rgba(51, 65, 85, 0.58),
        rgba(71, 85, 105, 0.26)
    );
    border-color: rgba(148, 163, 184, 0.24);
}

.node-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.node-tags :deep(.el-tag) {
    border-color: rgba(96, 165, 250, 0.18);
    background: rgba(15, 23, 42, 0.88);
    color: #dbeafe;
}

.node-table :deep(.el-tag--dark.el-tag--success) {
    border-color: rgba(74, 222, 128, 0.26);
    background: rgba(20, 83, 45, 0.82);
    color: #dcfce7;
}

.node-table :deep(.el-tag--dark.el-tag--warning) {
    border-color: rgba(250, 204, 21, 0.24);
    background: rgba(113, 63, 18, 0.82);
    color: #fef3c7;
}

.node-table :deep(.el-tag--dark.el-tag--danger) {
    border-color: rgba(248, 113, 113, 0.22);
    background: rgba(127, 29, 29, 0.82);
    color: #fee2e2;
}

.node-action-menu :global(.el-dropdown-menu__item) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    min-height: 32px;
    border-radius: 10px;
    color: #e5e7eb;
}

.node-action-menu :global(.el-dropdown-menu__item .el-icon) {
    color: var(--muted);
}

.node-action-menu :global(.el-dropdown-menu__item:hover) {
    background: rgba(148, 163, 184, 0.12);
    color: #f8fafc;
}

.node-action-menu :global(.el-dropdown-menu__item:hover .el-icon) {
    color: #cbd5f5;
}

.node-action-menu :global(.el-dropdown-menu__item.is-disabled) {
    opacity: 0.6;
}

.node-action-menu :global(.el-dropdown-menu__item.is-disabled:hover) {
    background: transparent;
}

.node-action-menu :global(.el-dropdown-menu) {
    padding: 6px;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background: rgba(11, 18, 32, 0.98);
    box-shadow: 0 18px 40px rgba(2, 8, 23, 0.5);
    outline: none;
}

.node-action-menu :global(.el-popper__arrow::before) {
    background: rgba(11, 18, 32, 0.98);
    border: 1px solid rgba(148, 163, 184, 0.16);
}

.node-action-menu :global(.el-dropdown__popper) {
    border: none;
    box-shadow: none;
    background: transparent;
}

.node-action-menu :global(.el-popper),
.node-action-menu :global(.el-popper.is-light) {
    border: none;
    background: transparent;
    box-shadow: none;
}

.node-action-menu :global(.el-popper__arrow) {
    background: transparent;
}

.node-action-menu {
    --el-border-color-light: transparent;
    --el-bg-color-overlay: rgba(11, 18, 32, 0.98);
}

.node-action-menu__danger :global(.el-dropdown-menu__item) {
    color: #fca5a5;
}

.node-action-menu__danger :global(.el-dropdown-menu__item .el-icon) {
    color: #fca5a5;
}

.node-action-menu__danger :global(.el-dropdown-menu__item:hover) {
    background: rgba(248, 113, 113, 0.14);
    color: #fee2e2;
}

.node-action-menu__danger :global(.el-dropdown-menu__item:hover .el-icon) {
    color: #fecaca;
}

.node-action-trigger {
    padding: 0 10px;
    border-radius: 10px;
    border: 1px solid rgba(59, 130, 246, 0.25);
    background: rgba(15, 23, 42, 0.9);
    color: #93c5fd;
    font-weight: 600;
    letter-spacing: 1px;
}

.node-action-trigger:hover,
.node-action-trigger:focus {
    border-color: rgba(56, 189, 248, 0.4);
    background: rgba(15, 23, 42, 0.96);
    color: #38bdf8;
}

.node-load-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--muted);
    font-size: 12px;
}

.node-load-meta strong {
    font-family: "Fira Code", monospace;
    color: #dbeafe;
}

@media (max-width: 1380px) {
    .node-stat-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .nodes-hero__intro,
    .node-pagination {
        flex-direction: column;
        align-items: flex-start;
    }

    .node-status-tabs,
    .node-toolbar {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .node-toolbar--sub {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 900px) {
    .node-stat-grid,
    .node-status-tabs,
    .node-toolbar {
        grid-template-columns: 1fr;
    }

    .node-pagination {
        grid-template-columns: 1fr;
        display: grid;
    }

    .node-pagination {
        justify-content: stretch;
    }

    .node-pagination :deep(.el-pagination) {
        justify-content: flex-start;
        flex-wrap: wrap;
        row-gap: 10px;
    }

    .node-pagination__summary strong {
        line-height: 1.5;
    }
}
</style>
