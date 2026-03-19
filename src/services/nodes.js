import {
  buildDashboardApiUrl,
  getDashboardApiHeaders,
  requestDashboardApi,
} from "./api";

export function createEmptyManagedNodes() {
  return [];
}

export function createEmptyManagedNodesPagination() {
  return {
    page: 1,
    limit: 10,
    total: 0,
  };
}

export function createEmptyManagedNodesFilters() {
  return {
    type: "all",
    word: "",
    status: "all",
  };
}

export function createEmptyManagedNodeGroups() {
  return [];
}

export function createEmptyManagedNodeRoutes() {
  return [];
}

function formatTimestamp(value) {
  const timestamp = Number(value || 0);

  if (!timestamp) {
    return "--";
  }

  const date = new Date(timestamp * 1000);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatRelativeTime(value) {
  const timestamp = Number(value || 0);

  if (!timestamp) {
    return "--";
  }

  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 60) {
    return "刚刚";
  }

  if (diff < 3600) {
    return `${Math.floor(diff / 60)} 分钟前`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)} 小时前`;
  }

  return `${Math.floor(diff / 86400)} 天前`;
}

function formatNodeRate(value) {
  const numericValue = Number(value || 0);

  if (!numericValue) {
    return "1x";
  }

  return `${numericValue}x`;
}

function resolveNodeLoad(status, loadStatus) {
  if (status === "维护中") {
    return 0;
  }

  const normalizedLoadStatus = String(loadStatus || "").toLowerCase();

  if (
    normalizedLoadStatus.includes("high") ||
    normalizedLoadStatus.includes("full")
  ) {
    return 86;
  }

  if (normalizedLoadStatus.includes("busy")) {
    return 72;
  }

  if (normalizedLoadStatus.includes("low")) {
    return 28;
  }

  return status === "离线" ? 8 : 42;
}

function resolveNodeStatus(node) {
  const isOnline = Number(node?.is_online || 0);
  const onlineCount = Number(node?.online || 0);

  if (!isOnline) {
    return "离线";
  }

  if (onlineCount === 0) {
    return "异常";
  }

  if (onlineCount > 1) {
    return "在线";
  }

  return "在线";
}

function resolveNodeShow(node) {
  const rawShow = node?.show;

  if (rawShow === true || rawShow === false) {
    return rawShow;
  }

  if (rawShow === 1 || rawShow === "1") {
    return true;
  }

  if (rawShow === 0 || rawShow === "0") {
    return false;
  }

  if (rawShow === "true") {
    return true;
  }

  if (rawShow === "false") {
    return false;
  }

  return false;
}

function normalizeManagedNode(node, index) {
  const status = resolveNodeStatus(node);
  const onlineUsers = Boolean(node.online || node.is_online) ? node.online : 0;
  const groupIdsFromGroups = Array.isArray(node.groups)
    ? node.groups
        .map(function mapGroupId(group) {
          return String(group?.id || "").trim();
        })
        .filter(Boolean)
    : [];
  const groupIdsFromNode = Array.isArray(node.group_ids)
    ? node.group_ids
        .map(function mapGroupId(id) {
          return String(id || "").trim();
        })
        .filter(Boolean)
    : [];
  const groupTags = Array.isArray(node.groups)
    ? node.groups
        .map(function mapGroup(group) {
          return group?.name;
        })
        .filter(Boolean)
    : [];
  const groupIds =
    groupIdsFromGroups.length > 0 ? groupIdsFromGroups : groupIdsFromNode;

  const protocolSettings =
    node && typeof node.protocol_settings === "object"
      ? node.protocol_settings
      : {};
  const tlsSettings =
    protocolSettings && typeof protocolSettings.tls_settings === "object"
      ? protocolSettings.tls_settings
      : {};
  const tlsEnabled =
    protocolSettings?.tls === 1 ||
    protocolSettings?.tls === "1" ||
    protocolSettings?.tls === true ||
    protocolSettings?.tls === "true";
  const cipher = String(protocolSettings?.cipher || "").trim();
  const rawPlugin = String(protocolSettings?.plugin || "").trim();
  const plugin = rawPlugin === "obfs" ? "simple-obfs" : rawPlugin;
  const pluginOpts = String(protocolSettings?.plugin_opts || "").trim();

  return {
    id: String(node.id || `NODE-${1000 + index}`),
    rawId: Number(node.id || 0),
    parentId: node.parent_id,
    name: node.name || `节点 ${index + 1}`,
    type: String(node.type || "--").toUpperCase(),
    show: resolveNodeShow(node),
    host: node.host,
    port: node.port,
    serverPort: node.server_port,
    encryption: cipher || "aes-128-gcm",
    plugin: plugin || "None",
    pluginOpts,
    tls: tlsEnabled ? "tls" : "none",
    transportProtocol: protocolSettings?.network || "",
    transportConfig: protocolSettings?.network_settings || "",
    sni: tlsSettings?.server_name || protocolSettings?.server_name || "",
    allowInsecure: Boolean(
      tlsSettings?.allow_insecure ?? protocolSettings?.allow_insecure,
    ),
    rate: formatNodeRate(node.rate),
    status,
    onlineUsers,
    priority: Number(node.sort || index + 1),
    groupIds,
    groupNames: groupTags,
    rawTags: Array.isArray(node.tags)
      ? node.tags
          .map(function mapTag(tag) {
            return String(tag || "").trim();
          })
          .filter(Boolean)
      : [],
    tags: [
      String(node.type || "").toUpperCase(),
      ...groupTags,
      node.parent_id ? "子节点" : "主节点",
    ].filter(Boolean),
    availableStatus: Number(node.available_status || 0),
    online: Boolean(node.online || node.is_online),
    lastPushAt: formatRelativeTime(node.last_push_at),
    cacheKey: node.cache_key || "--",
    routeId: node.route_id ? String(node.route_id) : "",
  };
}

function normalizeManagedNodeGroup(group, index) {
  return {
    id: String(group?.id || index + 1),
    name: group?.name || `权限组 ${index + 1}`,
    usersCount: Number(group?.users_count || 0),
    serverCount: Number(group?.server_count || 0),
    createdAt: formatTimestamp(group?.created_at),
    updatedAt: formatTimestamp(group?.updated_at),
  };
}

function normalizeManagedNodeRoute(route, index) {
  const remark = String(route?.remarks || "").trim();

  return {
    id: String(route?.id || index + 1),
    remarks: remark || `路由组 ${index + 1}`,
    action: String(route?.action || "--"),
    matchCount: Array.isArray(route?.match) ? route.match.length : 0,
    updatedAt: formatTimestamp(route?.updated_at),
  };
}

export async function fetchManagedNodes(options = {}) {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const type = options.type && options.type !== "all" ? options.type : "";
  const word = String(options.word || "").trim();
  const status =
    options.status && options.status !== "all" ? options.status : "";
  const apiUrl = buildDashboardApiUrl("server/manage/getNodes", [
    ["page", page],
    ["limit", limit],
    ["type", type],
    ["word", word],
    ["status", status],
  ]);
  const payload = await requestDashboardApi(apiUrl);
  const rawData = payload?.data ?? {};
  const listSource = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData?.list)
      ? rawData.list
      : Array.isArray(rawData)
        ? rawData
        : [];

  return {
    list: listSource.map(function mapNode(node, index) {
      return normalizeManagedNode(node, index);
    }),
    pagination: {
      page: Number(rawData?.page || page),
      limit: Number(rawData?.per_page || rawData?.limit || limit),
      total: Number(rawData?.total || 0),
    },
  };
}

export async function fetchManagedNodeGroups() {
  const apiUrl = buildDashboardApiUrl("server/group/fetch");
  const payload = await requestDashboardApi(apiUrl);
  const list = Array.isArray(payload?.data) ? payload.data : [];

  return list.map(function mapGroup(group, index) {
    return normalizeManagedNodeGroup(group, index);
  });
}

export async function fetchManagedNodeRoutes() {
  const apiUrl = buildDashboardApiUrl("server/route/fetch");
  const payload = await requestDashboardApi(apiUrl);
  const list = Array.isArray(payload?.data) ? payload.data : [];

  return list.map(function mapRoute(route, index) {
    return normalizeManagedNodeRoute(route, index);
  });
}

async function requestManagedNodeAction(path, payload) {
  const apiUrl = buildDashboardApiUrl(path);
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      ...getDashboardApiHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("仪表盘接口鉴权失败，请先重新登录后再重试");
  }

  if (!response.ok) {
    throw new Error(`节点操作失败: ${response.status}`);
  }

  const result = await response.json();

  if (result?.status && result.status !== "success") {
    throw new Error(result.message || "节点操作失败");
  }

  if (result?.code !== undefined && Number(result.code) !== 0) {
    throw new Error(result.message || "节点操作失败");
  }

  return result;
}

export async function deleteManagedNode(id) {
  return requestManagedNodeAction("server/manage/drop", {
    id: Number(id || 0),
  });
}

export async function copyManagedNode(id) {
  return requestManagedNodeAction("server/manage/copy", {
    id: Number(id || 0),
  });
}

export async function updateManagedNodeShow(id, show) {
  return requestManagedNodeAction("server/manage/update", {
    id: Number(id || 0),
    show: Number(show ? 1 : 0),
  });
}

function normalizeRateTimeRanges(rateTimeRanges) {
  if (!Array.isArray(rateTimeRanges)) {
    return [];
  }

  return rateTimeRanges.map(function mapRateRule(rule) {
    return {
      start: String(rule?.startTime || rule?.start || "00:00"),
      end: String(rule?.endTime || rule?.end || "23:59"),
      rate: String(rule?.rate || 1),
    };
  });
}

export async function saveManagedNode(payload = {}) {
  const apiUrl = buildDashboardApiUrl("server/manage/save");
  const protocolSettings =
    payload.protocolSettings && typeof payload.protocolSettings === "object"
      ? payload.protocolSettings
      : {
          cipher: String(payload.cipher || "aes-128-gcm"),
          plugin: String(payload.plugin || ""),
          plugin_opts: String(payload.pluginOpts || ""),
          client_fingerprint: String(payload.clientFingerprint || "chrome"),
        };
  const requestBody = {
    id: payload.id ?? null,
    specific_key: payload.specificKey ?? null,
    code: payload.code || "",
    show: Boolean(payload.show),
    name: String(payload.name || "").trim(),
    rate: String(payload.rate || "1"),
    rate_time_enable: Boolean(payload.rateTimeEnable),
    rate_time_ranges: normalizeRateTimeRanges(payload.rateTimeRanges),
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    excludes: Array.isArray(payload.excludes) ? payload.excludes : [],
    ips: Array.isArray(payload.ips) ? payload.ips : [],
    group_ids: Array.isArray(payload.groupIds)
      ? payload.groupIds.map(function mapGroupId(groupId) {
          return String(groupId);
        })
      : [],
    host: String(payload.host || "").trim(),
    port: String(payload.port || "").trim(),
    server_port: String(payload.serverPort || "").trim(),
    parent_id: String(payload.parentId || "0"),
    route_ids: Array.isArray(payload.routeIds)
      ? payload.routeIds.map(function mapRouteId(routeId) {
          return String(routeId);
        })
      : [],
    protocol_settings: protocolSettings,
    type: String(payload.type || "shadowsocks"),
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      ...getDashboardApiHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("仪表盘接口鉴权失败，请先重新登录后再重试");
  }

  if (!response.ok) {
    throw new Error(`保存节点失败: ${response.status}`);
  }

  const result = await response.json();

  if (result?.status && result.status !== "success") {
    throw new Error(result.message || "保存节点失败");
  }

  if (result?.code !== undefined && Number(result.code) !== 0) {
    throw new Error(result.message || "保存节点失败");
  }

  return result;
}
