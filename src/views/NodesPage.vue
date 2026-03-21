<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
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
const { t } = useI18n();

function createFallbackNodeModel(node, index) {
    return {
        id: `NODE-${1000 + index}`,
        name: node.name,
        type: node.type,
        rate: node.rate,
        show: true,
        showUpdating: false,
        status: node.status === "正常" ? t("nodes.statusOnline") : node.status,
        load:
            node.status === "高负载"
                ? 86
                : node.status === "维护中"
                  ? 0
                  : 42 + index * 11,
        onlineUsers: node.status === "维护中" ? 0 : 132 + index * 37,
        lastCheck:
            index === 0
                ? t("time.justNow")
                : index === 1
                  ? t("time.minutesAgo", { count: 2 })
                  : t("time.minutesAgo", { count: 9 }),
        priority: index + 1,
        groupIds: [],
        groupNames: [],
        tags:
            index === 0
                ? [t("nodes.tags.primary"), t("nodes.tags.lowLatency")]
                : index === 1
                  ? [t("nodes.tags.backup")]
                  : [t("nodes.tags.maintenance")],
        remark: "",
        lastPushAt: "--",
        cacheKey: "--",
    };
}

function cloneManagedNode(node) {
    return {
        ...node,
        show: Boolean(node?.show),
        showUpdating: false,
        groupIds: Array.isArray(node.groupIds) ? [...node.groupIds] : [],
        groupNames: Array.isArray(node.groupNames) ? [...node.groupNames] : [],
        tags: Array.isArray(node.rawTags)
            ? [...node.rawTags]
            : Array.isArray(node.tags)
              ? [...node.tags]
              : [],
        children: Array.isArray(node.children)
            ? node.children.map(function mapChild(child) {
                  return {
                      id: String(child?.id || "").trim(),
                      name: String(child?.name || child?.id || "").trim(),
                  };
              })
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
    [t("nodes.statusOnline"), "1"],
    [t("nodes.statusAbnormal"), "2"],
    [t("nodes.statusOffline"), "0"],
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
        return t("nodes.statusOnline");
    }

    if (status === "2") {
        return t("nodes.statusAbnormal");
    }

    if (status === "0") {
        return t("nodes.statusOffline");
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
    "fbnode",
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
        {
            value: "all",
            label: t("nodes.summary.all"),
            count: nodeList.value.length,
        },
        { value: "1", label: t("nodes.summary.online"), count: healthy },
        { value: "2", label: t("nodes.summary.abnormal"), count: idle },
        { value: "0", label: t("nodes.summary.offline"), count: offline },
    ];
});

function resolveStatusType(status) {
    if (status === t("nodes.statusOnline") || status === "正常") {
        return "success";
    }

    if (status === t("nodes.statusAbnormal")) {
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

    if (normalizedType === "fbnode") {
        return "node-type-tag--fbnode";
    }

    if (normalizedType === "socks" || normalizedType === "socks5") {
        return "node-type-tag--socks";
    }

    if (normalizedType === "naive") {
        return "node-type-tag--naive";
    }

    if (normalizedType === "http") {
        return "node-type-tag--http";
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
            return (
                groupNameById.value.get(groupId) ||
                t("nodes.groupFallback", { id: groupId })
            );
        });
    }

    return [t("nodes.groupEmpty")];
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
    ElMessage.success(t("nodes.messages.listRefreshed"));
}

function openCreateNodeDialog(protocol = "shadowsocks") {
    nodeDialogMode.value = "create";
    nodeDialogProtocol.value = String(protocol || "shadowsocks").toLowerCase();
    activeNode.value = null;
    nodeDialogVisible.value = true;
}

function openEditNodeDialog(node) {
    nodeDialogMode.value = "edit";
    nodeDialogProtocol.value = String(
        node?.type || "shadowsocks",
    ).toLowerCase();
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
            t("nodes.messages.deleteConfirmMessage", {
                name: node?.name || "",
            }),
            t("nodes.messages.deleteConfirmTitle"),
            {
                type: "warning",
                confirmButtonText: t("nodes.messages.deleteConfirmOk"),
                cancelButtonText: t("nodes.messages.deleteConfirmCancel"),
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
        ElMessage.success(t("nodes.messages.deleteSuccess"));
    } catch (error) {
        if (error === "cancel") {
            return;
        }
        ElMessage.error(
            error instanceof Error
                ? error.message
                : t("nodes.messages.deleteFailed"),
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
        ElMessage.success(t("nodes.messages.copySuccess"));
    } catch (error) {
        ElMessage.error(
            error instanceof Error
                ? error.message
                : t("nodes.messages.copyFailed"),
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
                  transport_config: String(
                      payload.transportConfig || "",
                  ).trim(),
                  tls_settings:
                      payload.tls === "tls"
                          ? {
                                server_name: String(payload.sni || "").trim(),
                                allow_insecure: payload.allowInsecure ? 1 : 0,
                            }
                          : null,
              }
            : protocolType === "trojan"
              ? {
                    server_name: String(payload.sni || "").trim(),
                    allow_insecure: payload.allowInsecure ? 1 : 0,
                    network: String(payload.transportProtocol || "tcp"),
                    transport_config: String(
                        payload.transportConfig || "",
                    ).trim(),
                }
              : protocolType === "hysteria"
                ? {
                      version:
                          String(payload.hysteriaVersion || "v2") === "v1" ? 1 : 2,
                      bandwidth: {
                          up: payload.hysteriaUpMbps ?? 0,
                          down: payload.hysteriaDownMbps ?? 0,
                      },
                      obfs: {
                          open: Boolean(payload.hysteriaObfs),
                          type: String(payload.hysteriaObfsType || "salamander"),
                          password: String(payload.hysteriaObfsPassword || "").trim(),
                      },
                      tls: {
                          server_name: String(payload.sni || "").trim(),
                          allow_insecure: payload.allowInsecure ? 1 : 0,
                      },
                      hop_interval: payload.hysteriaHopInterval ?? null,
                  }
                : protocolType === "vless"
                  ? {
                        security: String(payload.vlessSecurity || "none"),
                        flow: String(payload.vlessFlow || "none"),
                        encryption:
                            payload.vlessEncryption === null
                                ? null
                                : payload.vlessEncryption,
                        encryption_settings:
                            payload.vlessEncryption === null
                                ? null
                                : {
                                      mode: String(payload.vlessEncMode || ""),
                                      rtt: String(payload.vlessEncRtt || ""),
                                      ticket: String(payload.vlessEncTicket || ""),
                                      server_padding: String(
                                          payload.vlessEncServerPadding || "",
                                      ),
                                      client_padding: String(
                                          payload.vlessEncClientPadding || "",
                                      ),
                                      private_key: String(
                                          payload.vlessEncPrivateKey || "",
                                      ),
                                      password: String(payload.vlessEncPassword || ""),
                                  },
                        network: String(payload.transportProtocol || "tcp"),
                        transport_config: String(
                            payload.transportConfig || "",
                        ).trim(),
                        tls:
                            payload.vlessSecurity === "reality"
                                ? 2
                                : payload.vlessSecurity === "tls"
                                  ? 1
                                  : 0,
                        tls_settings:
                            payload.vlessSecurity === "tls"
                                ? {
                                      server_name: String(payload.sni || "").trim(),
                                      allow_insecure: payload.allowInsecure ? 1 : 0,
                                  }
                                : null,
                        reality_settings:
                            payload.vlessSecurity === "reality"
                                ? {
                                      server_name: String(
                                          payload.vlessRealityDest || "",
                                      ).trim(),
                                      server_port: String(
                                          payload.vlessRealityPort || "",
                                      ).trim(),
                                      public_key: String(
                                          payload.vlessRealityPublicKey || "",
                                      ).trim(),
                                      private_key: String(
                                          payload.vlessRealityPrivateKey || "",
                                      ).trim(),
                                      short_id: String(
                                          payload.vlessRealityShortId || "",
                                      ).trim(),
                                      allow_insecure: payload.allowInsecure ? 1 : 0,
                                  }
                                : null,
                    }
                  : protocolType === "tuic"
                    ? {
                          version:
                              String(payload.tuicVersion || "v5") === "v5"
                                  ? 5
                                  : 5,
                          congestion_control: String(
                              payload.tuicCongestionControl || "bbr",
                          ).toLowerCase(),
                          alpn: Array.isArray(payload.tuicAlpn)
                              ? payload.tuicAlpn
                              : [],
                          udp_relay_mode: String(
                              payload.tuicUdpRelayMode || "native",
                          ).toLowerCase(),
                          tls: {
                              server_name: String(payload.sni || "").trim(),
                              allow_insecure: payload.allowInsecure ? 1 : 0,
                          },
                      }
                    : protocolType === "mieru"
                      ? {
                            transport: String(
                                payload.transportProtocol || "tcp",
                            ).toLowerCase(),
                            multiplexing: String(
                                payload.mieruBandwidth || "low",
                            ).toLowerCase(),
                        }
                      : protocolType === "fbnode"
                        ? {}
                      : {
                            cipher: payload.encryption,
                            plugin: payload.plugin === "None" ? "" : payload.plugin,
                            plugin_opts: payload.pluginOpts,
                        client_fingerprint: "chrome",
                    };

    try {
        await adminStore.saveManagedNodeItem(
            protocolType === "fbnode"
                ? {
                      id: isEditing
                          ? Number(
                                activeNode.value?.rawId || activeNode.value?.id || 0,
                            ) || null
                          : null,
                      type: protocolType,
                      name: payload.name,
                      children: Array.isArray(payload.fbnodeChildren)
                          ? payload.fbnodeChildren
                                .map(function mapChild(child) {
                                    return Number(child?.id || 0);
                                })
                                .filter(Boolean)
                          : [],
                  }
                : {
                      id: isEditing
                          ? Number(
                                activeNode.value?.rawId || activeNode.value?.id || 0,
                            ) || null
                          : null,
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
                      children:
                          protocolType === "fbnode" && Array.isArray(payload.fbnodeChildren)
                              ? payload.fbnodeChildren
                                    .map(function mapChild(child) {
                                        return Number(child?.id || 0);
                                    })
                                    .filter(Boolean)
                              : [],
                      type: protocolType,
                  },
        );

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
            ElMessage.success(t("nodes.messages.updated"));
        } else {
            ElMessage.success(
                t("nodes.messages.added", {
                    protocol: protocolType.toUpperCase(),
                }),
            );
        }
    } catch (error) {
        ElMessage.error(
            error instanceof Error
                ? error.message
                : t("nodes.messages.saveFailed"),
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

async function handleShowToggle(node, value) {
    const nextValue = Boolean(value);
    const previousValue = Boolean(node.show);
    const nodeId = node?.rawId || node?.id;

    if (!nodeId) {
        ElMessage.error(t("nodes.messages.showIdMissing"));
        return;
    }

    if (nextValue === previousValue) {
        return;
    }

    try {
        node.showUpdating = true;
        node.show = nextValue;
        await adminStore.updateManagedNodeShowItem(nodeId, nextValue);
        ElMessage.success(t("nodes.messages.showUpdated"));
    } catch (error) {
        node.show = previousValue;
        ElMessage.error(
            error instanceof Error
                ? error.message
                : t("nodes.messages.showUpdateFailed"),
        );
    } finally {
        node.showUpdating = false;
    }
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
                {{ t("nodes.loadFallback") }}
            </template>
        </el-alert>

        <div class="nodes-header">
            <div class="nodes-header__actions">
                <el-dropdown trigger="click" @command="handleCreateNodeCommand">
                    <el-button class="ghost-btn" type="primary">
                        <el-icon><Plus /></el-icon>
                        {{ t("nodes.add") }}
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu class="node-action-menu">
                            <el-dropdown-item
                                v-for="protocol in protocolOptions"
                                :key="protocol"
                                :command="protocol"
                                class="node-protocol-item"
                            >
                                <span
                                    :class="[
                                        'node-type-tag',
                                        'node-protocol-pill',
                                        resolveNodeTypeTagClass(protocol),
                                    ]"
                                >
                                    {{ protocol.toUpperCase() }}
                                </span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-button
                    class="ghost-btn"
                    type="info"
                    plain
                    @click="runBatchHealthCheck"
                >
                    <el-icon><Refresh /></el-icon>
                    {{ t("nodes.refresh") }}
                </el-button>
            </div>
        </div>

        <el-card class="section-card nodes-workspace" shadow="never">
            <div class="node-toolbar">
                <el-input
                    v-model="filters.keyword"
                    clearable
                    :placeholder="t('nodes.searchPlaceholder')"
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
                    :placeholder="t('nodes.protocolPlaceholder')"
                    @change="handleProtocolChange"
                >
                    <el-option :label="t('nodes.protocolAll')" value="all" />
                    <el-option
                        v-for="protocol in protocolOptions"
                        :key="protocol"
                        :label="protocol"
                        :value="protocol"
                    />
                </el-select>

                <el-select
                    v-model="filters.group"
                    class="node-select"
                    :placeholder="t('nodes.groupPlaceholder')"
                >
                    <el-option :label="t('nodes.groupAll')" value="all" />
                    <el-option
                        v-for="group in groupOptions"
                        :key="group.value"
                        :label="group.label"
                        :value="String(group.value)"
                    />
                </el-select>

                <el-select
                    v-model="filters.status"
                    class="node-select"
                    :placeholder="t('nodes.statusPlaceholder')"
                    @change="handleStatusChange"
                >
                    <el-option :label="t('nodes.statusAll')" value="all" />
                    <el-option :label="t('nodes.statusOnline')" value="1" />
                    <el-option :label="t('nodes.statusAbnormal')" value="2" />
                    <el-option :label="t('nodes.statusOffline')" value="0" />
                </el-select>
            </div>

            <el-table
                :data="filteredNodes"
                v-loading="adminStore.managedNodesLoading"
                class="dashboard-table node-table"
            >
                <el-table-column :label="t('nodes.table.id')" min-width="90">
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
                <el-table-column :label="t('nodes.table.visible')" width="60">
                    <template #default="{ row }">
                        <el-switch
                            :model-value="Boolean(row.show)"
                            size="small"
                            :loading="row.showUpdating"
                            @change="handleShowToggle(row, $event)"
                        />
                    </template>
                </el-table-column>

                <el-table-column
                    :label="t('nodes.table.status')"
                    min-width="70"
                >
                    <template #default="{ row }">
                        <el-tag
                            :type="resolveStatusType(row.status)"
                            effect="dark"
                        >
                            {{ row.status }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column :label="t('nodes.table.node')" min-width="160">
                    <template #default="{ row }">
                        <div class="node-name-cell">
                            <strong>{{ row.name }}</strong>
                            <span>{{ row.type }}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                    :label="t('nodes.table.address')"
                    min-width="220"
                >
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

                <el-table-column
                    :label="t('nodes.table.onlineUsers')"
                    min-width="80"
                    prop="onlineUsers"
                >
                    <template #default="{ row }">
                        <div class="node-online">
                            <el-icon><Monitor /></el-icon>
                            {{ row.onlineUsers }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                    :label="t('nodes.table.rate')"
                    min-width="60"
                    prop="rate"
                />

                <el-table-column
                    :label="t('nodes.table.groups')"
                    min-width="140"
                >
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

                <el-table-column
                    :label="t('nodes.table.actions')"
                    width="60"
                    fixed="right"
                >
                    <template #default="{ row }">
                        <el-dropdown trigger="click">
                            <el-button
                                class="node-action-trigger"
                                type="primary"
                                plain
                            >
                                ...
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu class="node-action-menu">
                                    <el-dropdown-item
                                        @click="openEditNodeDialog(row)"
                                    >
                                        <el-icon><Edit /></el-icon>
                                        {{ t("nodes.actions.edit") }}
                                    </el-dropdown-item>
                                    <el-dropdown-item
                                        @click="handleCopyNode(row)"
                                    >
                                        <el-icon><CopyDocument /></el-icon>
                                        {{ t("nodes.actions.copy") }}
                                    </el-dropdown-item>
                                    <el-dropdown-item
                                        class="node-action-menu__danger"
                                        @click="handleDeleteNode(row)"
                                    >
                                        <el-icon><Delete /></el-icon>
                                        {{ t("nodes.actions.delete") }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>

            <div class="node-pagination">
                <div class="node-pagination__summary">
                    <span class="node-pagination__eyebrow">
                        {{ t("nodes.pagination.eyebrow") }}
                    </span>
                    <strong>
                        {{
                            t("nodes.pagination.pageSummary", {
                                page: pagination.page,
                                total: Math.max(
                                    1,
                                    Math.ceil(
                                        (pagination.total || 0) /
                                            pagination.limit,
                                    ),
                                ),
                            })
                        }}
                    </strong>
                    <span>
                        {{
                            t("nodes.pagination.pageDetail", {
                                limit: pagination.limit,
                                count: pagination.total,
                            })
                        }}
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

.nodes-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 4px 2px 0;
}

.nodes-header h2 {
    margin: 0 0 6px;
    font-size: 22px;
    line-height: 1.2;
}

.nodes-header p {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
}

.nodes-header__actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.node-toolbar {
    display: grid;
    grid-template-columns: minmax(260px, 2.2fr) repeat(3, minmax(140px, 1fr));
    gap: 12px;
    margin-bottom: 14px;
}

.node-online {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--text);
    font-weight: 600;
}

.node-online :deep(.el-icon) {
    color: var(--muted);
}

.node-toolbar--sub {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
}

.node-toolbar__hint {
    padding: 11px 14px;
    border-radius: 14px;
    border: 1px solid var(--line);
    background: var(--panel-strong);
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
    background: #f8fafc;
    color: #64748b;
    border-bottom: 1px solid var(--line);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.node-table :deep(.el-table__header-wrapper th.is-leaf) {
    border-bottom: 1px solid var(--line);
}

.node-table :deep(.el-table__body-wrapper td) {
    background: #ffffff;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    transition: background 0.2s ease;
}

.node-table :deep(.el-table__row:hover > td) {
    background: rgba(15, 23, 42, 0.04) !important;
}

.node-table :deep(.el-table__body tr.current-row > td) {
    background: rgba(37, 99, 235, 0.08);
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
    border-top: 1px solid var(--line);
}

.node-pagination__summary {
    display: grid;
    gap: 4px;
}

.node-pagination__eyebrow {
    color: var(--muted);
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
    --el-pagination-button-bg-color: #ffffff;
    --el-pagination-button-disabled-bg-color: rgba(15, 23, 42, 0.06);
    --el-pagination-button-disabled-color: rgba(148, 163, 184, 0.7);
    --el-pagination-hover-color: #2563eb;
    --el-pagination-font-size: 13px;
}

.node-pagination :deep(.el-pagination__sizes) {
    margin-right: 10px;
}

.node-pagination :deep(.btn-prev),
.node-pagination :deep(.btn-next),
.node-pagination :deep(.number),
.node-pagination :deep(.el-select .el-input__wrapper) {
    border: 1px solid var(--line);
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
    background: #ffffff;
}

.node-pagination :deep(.number.is-active) {
    background: rgba(37, 99, 235, 0.12);
    border-color: rgba(37, 99, 235, 0.28);
    color: #1d4ed8;
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
    color: var(--text);
}

.node-name-cell span {
    color: var(--muted);
    font-size: 12px;
    line-height: 1.5;
}

.node-type-tag {
    border: 1px solid transparent;
    color: #1e3a8a;
    box-shadow: none;
    border-radius: 6px;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        border-color 0.2s ease;
}

.node-type-tag.node-type-tag--shadowsocks {
    background: #37b24d;
    border-color: #2f9e44;
    color: #ffffff;
}

.node-type-tag.node-type-tag--trojan {
    background: #f6b24a;
    border-color: #e39a2f;
    color: #1f2937;
}

.node-type-tag.node-type-tag--vmess {
    background: #d94884;
    border-color: #c63d77;
    color: #ffffff;
}

.node-type-tag.node-type-tag--hysteria {
    background: #5d77f3;
    border-color: #4c67e6;
    color: #ffffff;
}

.node-type-tag.node-type-tag--vless {
    background: #111827;
    border-color: #0f172a;
    color: #ffffff;
}

.node-type-tag.node-type-tag--fbnode {
    background: #2563eb;
    border-color: #1d4ed8;
    color: #ffffff;
}

.node-type-tag.node-type-tag--socks {
    background: #2f8cff;
    border-color: #2677e6;
    color: #ffffff;
}

.node-type-tag.node-type-tag--naive {
    background: #8b3fd1;
    border-color: #7a36ba;
    color: #ffffff;
}

.node-type-tag.node-type-tag--http {
    background: #ff6b2c;
    border-color: #e35c26;
    color: #ffffff;
}

.node-type-tag.node-type-tag--anytls {
    background: #7b5bd6;
    border-color: #6d4fc4;
    color: #ffffff;
}

.node-type-tag.node-type-tag--mieru {
    background: #69b34c;
    border-color: #5aa142;
    color: #ffffff;
}

.node-type-tag.node-type-tag--tuic {
    background: #18c964;
    border-color: #14b35a;
    color: #ffffff;
}

.node-type-tag.node-type-tag--default {
    background: rgba(71, 85, 105, 0.12);
    border-color: rgba(100, 116, 139, 0.22);
    color: #334155;
}

.node-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.node-tags :deep(.el-tag) {
    border-color: rgba(37, 99, 235, 0.2);
    background: rgba(37, 99, 235, 0.12);
    color: #1d4ed8;
}

.node-table :deep(.el-tag--dark.el-tag--success) {
    border-color: rgba(34, 197, 94, 0.24);
    background: rgba(34, 197, 94, 0.12);
    color: #166534;
}

.node-table :deep(.el-tag--dark.el-tag--warning) {
    border-color: rgba(234, 179, 8, 0.26);
    background: rgba(234, 179, 8, 0.12);
    color: #92400e;
}

.node-table :deep(.el-tag--dark.el-tag--danger) {
    border-color: rgba(239, 68, 68, 0.22);
    background: rgba(239, 68, 68, 0.12);
    color: #991b1b;
}

:global(.node-action-menu .el-dropdown-menu__item) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    min-height: 32px;
    border-radius: 10px;
    color: #1f2937;
}

:global(.node-action-menu .node-protocol-item) {
    justify-content: flex-start;
}

:global(.node-action-menu .node-protocol-pill) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 76px;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

:global(.node-action-menu .el-dropdown-menu__item .el-icon) {
    color: #94a3b8;
}

:global(.node-action-menu .el-dropdown-menu__item:hover) {
    background: rgba(37, 99, 235, 0.08);
    color: #1e3a8a;
}

:global(.node-action-menu .el-dropdown-menu__item:hover .el-icon) {
    color: #1d4ed8;
}

:global(.node-action-menu .el-dropdown-menu__item.is-disabled) {
    opacity: 0.6;
}

:global(.node-action-menu .el-dropdown-menu__item.is-disabled:hover) {
    background: transparent;
}

:global(.node-action-menu .el-dropdown-menu) {
    padding: 6px;
    border-radius: 12px;
    border: 1px solid var(--line);
    background: #ffffff;
    box-shadow: var(--shadow);
    outline: none;
}

:global(.node-action-menu .el-popper__arrow::before) {
    background: #ffffff;
    border: 1px solid var(--line);
}

:global(.node-action-menu.el-dropdown__popper) {
    border: none;
    box-shadow: none;
    background: transparent;
}

:global(.node-action-menu.el-popper),
:global(.node-action-menu.el-popper.is-light) {
    border: none;
    background: transparent;
    box-shadow: none;
}

:global(.node-action-menu .el-popper__arrow) {
    background: transparent;
}

.node-action-menu {
    --el-border-color-light: transparent;
    --el-bg-color-overlay: #ffffff;
}

:global(.node-action-menu__danger.el-dropdown-menu__item) {
    color: #dc2626;
}

:global(.node-action-menu__danger.el-dropdown-menu__item .el-icon) {
    color: #dc2626;
}

:global(.node-action-menu__danger.el-dropdown-menu__item:hover) {
    background: rgba(239, 68, 68, 0.12);
    color: #991b1b;
}

:global(.node-action-menu__danger.el-dropdown-menu__item:hover .el-icon) {
    color: #dc2626;
}

.node-action-trigger {
    padding: 0 10px;
    border-radius: 10px;
    border: 1px solid rgba(37, 99, 235, 0.28);
    background: rgba(37, 99, 235, 0.08);
    color: #1d4ed8;
    font-weight: 600;
    letter-spacing: 1px;
}

.node-action-trigger:hover,
.node-action-trigger:focus {
    border-color: rgba(37, 99, 235, 0.4);
    background: rgba(37, 99, 235, 0.14);
    color: #1e40af;
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
    color: var(--text);
}

@media (max-width: 1380px) {
    .nodes-header,
    .node-pagination {
        flex-direction: column;
        align-items: flex-start;
    }

    .node-toolbar {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .node-toolbar--sub {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 900px) {
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
