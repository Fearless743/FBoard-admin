import { adminGet, adminPost } from "@/api/client";

/* ============ 权限组 ============ */
export interface ServerGroup {
  id: number;
  name: string;
  /** 绑定到该权限组的用户数（Laravel withCount('users')） */
  users_count?: number;
  /** 节点 group_ids 包含该组的数量 */
  server_count?: number;
  [k: string]: any;
}

export async function fetchGroups(): Promise<ServerGroup[]> {
  return adminGet<ServerGroup[]>("/server/group/fetch");
}

export async function saveGroup(payload: { id?: number; name: string }) {
  if (payload.id) return adminPost<any>("/server/group/save", payload);
  return adminPost<any>("/server/group/save", payload);
}

export async function dropGroup(id: number) {
  return adminPost<any>("/server/group/drop", { id });
}

/* ============ 路由规则 ============ */
export interface ServerRoute {
  id: number;
  remarks: string;
  match: string[];
  action: "dns" | "block" | "direct" | "proxy";
  action_value?: string;
  [k: string]: any;
}

export async function fetchRoutes(): Promise<ServerRoute[]> {
  const res = await adminGet<{ data: ServerRoute[] } | ServerRoute[]>("/server/route/fetch");
  return Array.isArray(res) ? res : res.data || [];
}

export async function saveRoute(payload: Partial<ServerRoute>) {
  return adminPost<any>("/server/route/save", payload);
}

export async function dropRoute(id: number) {
  return adminPost<any>("/server/route/drop", { id });
}

/* ============ 网络设置模板 ============ */
export interface NetworkSettingsTemplate {
  id: number;
  name: string;
  description?: string | null;
  network?: string | null;
  settings: Record<string, any>;
  created_at?: string | number;
  updated_at?: string | number;
  [k: string]: any;
}

export async function fetchNetworkSettingsTemplates(
  network?: string | null,
): Promise<NetworkSettingsTemplate[]> {
  const qs =
    network != null && network !== ""
      ? `?network=${encodeURIComponent(network)}`
      : "";
  const res = await adminGet<
    { data: NetworkSettingsTemplate[] } | NetworkSettingsTemplate[]
  >("/server/network-settings-template/fetch" + qs);
  return Array.isArray(res) ? res : res.data || [];
}

export async function saveNetworkSettingsTemplate(payload: {
  id?: number;
  name: string;
  description?: string | null;
  network?: string | null;
  settings: Record<string, any>;
}) {
  return adminPost<any>("/server/network-settings-template/save", payload);
}

export async function dropNetworkSettingsTemplate(id: number) {
  return adminPost<any>("/server/network-settings-template/drop", { id });
}

/* ============ 节点 ============ */
export interface Server {
  id: number;
  code?: string | null;
  name: string;
  type: string; // 协议类型标识 (e.g. 'shadowsocks', 'vmess')
  protocol_settings?: Record<string, any>;
  host: string;
  /** 连接端口：单端口数字或范围字符串（如 "10000-40000"） */
  port: number | string;
  server_port?: number;
  listen_address?: string;
  rate: number;
  traffic_limit?: number;
  show: 0 | 1;
  sort: number;
  parent_id?: number | null;
  group_ids?: number[];
  route_ids?: number[];
  tags?: string[];
  banned?: boolean;
  enabled?: boolean;
  dynamic_rate?: { rules: Array<{ start_time: string; end_time: string; multiplier: number }> };
  ech?: any;
  online?: number;
  last_check_at?: number;
  status?: 0 | 1 | 2;
  machine_id?: number | null;
  /** 节点级 TLS 证书自动化配置 */
  cert_config?: {
    cert_mode?: string;
    domain?: string;
    email?: string;
    http_port?: number;
    dns_provider?: string;
    dns_env?: Record<string, string>;
    cert_content?: string;
    key_content?: string;
  } | null;
  /** 自定义出站（JSON 数组） */
  custom_outbounds?: Array<Record<string, any>> | null;
  /** 自定义路由（JSON 数组） */
  custom_routes?: Array<Record<string, any>> | null;
  [k: string]: any;
}

export async function getNodes(params?: {
  current?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  /** 运行状态：0 未运行 / 1 无人使用或异常 / 2 运行正常 */
  status?: 0 | 1 | 2 | number | string;
}): Promise<Server[]> {
  if (params) {
    const searchParams = new URLSearchParams();
    if (params.current) searchParams.set('current', String(params.current));
    if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
    if (params.search) searchParams.set('search', params.search);
    if (params.type) searchParams.set('type', params.type);
    if (params.status !== undefined && params.status !== null && params.status !== "") {
      searchParams.set('status', String(params.status));
    }
    return adminGet<Server[]>("/server/manage/getNodes?" + searchParams.toString());
  }
  return adminGet<Server[]>("/server/manage/getNodes");
}

export interface SortNode {
  id: number;
  name: string;
  sort: number;
  type: string;
  parent_id?: number | null;
}

export async function getSortNodes(): Promise<SortNode[]> {
  return adminGet<SortNode[]>("/server/manage/get-sort-nodes");
}

export async function saveServer(payload: Partial<Server>) {
  return adminPost<any>("/server/manage/save", payload);
}

export async function updateServer(payload: Partial<Server>) {
  return adminPost<any>("/server/manage/update", payload);
}

export async function dropServer(id: number) {
  return adminPost<any>("/server/manage/drop", { id });
}

export async function copyServer(id: number) {
  return adminPost<any>("/server/manage/copy", { id });
}

export async function resetServerTraffic(id: number) {
  return adminPost<any>("/server/manage/resetTraffic", { id });
}

export async function batchDeleteServer(ids: number[]) {
  return adminPost<any>("/server/manage/batchDelete", { ids });
}

export async function batchResetServerTraffic(ids: number[]) {
  return adminPost<any>("/server/manage/batchResetTraffic", { ids });
}

export async function batchUpdateServer(payload: { ids: number[]; show?: number; banned?: number }) {
  return adminPost<any>("/server/manage/batchUpdate", payload);
}

export async function createChildNode(payload: { parent_id: number; name: string; host: string; port: number; group_ids?: number[]; tags?: string[]; show?: boolean }) {
  return adminPost<any>("/server/manage/create-child-node", payload);
}

export async function updateChildNode(payload: { id: number; name: string; host: string; port: number; group_ids?: number[]; tags?: string[]; show?: boolean }) {
  return adminPost<any>("/server/manage/update-child-node", payload);
}

export async function getChildNodes(parentId: number): Promise<Server[]> {
  const res = await adminGet<{ data: Server[] } | Server[]>("/server/manage/get-children/" + parentId);
  return Array.isArray(res) ? res : (res as any)?.data || [];
}

export async function generateRealityKey() {
  return adminGet<{ public_key: string; private_key: string }>("/server/manage/generate-reality-key");
}

export async function generateSudokuKey() {
  return adminGet<{ master_public_key: string; master_private_key: string }>(
    "/server/manage/generate-sudoku-key",
  );
}

export interface VirtualNode {
  host: string;
  port: number;
  group_ids?: number[];
  tags?: string[];
}

export async function saveVirtualNodes(serverId: number, virtualNodes: VirtualNode[]) {
  return adminPost<any>("/server/manage/save-virtual-nodes/" + serverId, { virtual_nodes: virtualNodes });
}

export async function getVirtualNodes(serverId: number): Promise<VirtualNode[]> {
  const res = await adminGet<any>(`/server/manage/get-virtual-nodes/${serverId}`);
  return res?.data || res || [];
}

export async function sortServers(ids: number[]) {
  return adminPost<any>("/server/manage/sort", { ids });
}

export async function generateEchKey() {
  return adminGet<any>("/server/manage/generateEchKey");
}

/* ============ 协议定义 ============ */
export interface ProtocolConfigField {
  type: "string" | "integer" | "number" | "boolean" | "array" | "object";
  default?: any;
  label?: string;
  description?: string;
  validation?: string;
  options?: Record<string, string>;
  placeholder?: string;
  fields?: Record<string, ProtocolConfigField>;
  show_when?: Record<string, string>;
}

export interface ProtocolDefinition {
  type: string;
  name: string;
  description?: string;
  config_fields: Record<string, ProtocolConfigField>;
  /** Laravel 校验规则字符串 map，键为 protocol_settings 相对路径，如 tls / tls_settings.server_name */
  validation_rules?: Record<string, string | string[]>;
}

export interface ProtocolType {
  id: number;
  type: string;
  name: string;
}

export async function fetchProtocolDefinitions(): Promise<ProtocolDefinition[]> {
  const res = await adminGet<any>("/server/protocols/definitions");
  return Object.values(res || {});
}

export async function fetchProtocolTypes(): Promise<ProtocolType[]> {
  return adminGet<ProtocolType[]>("/server/protocols/types");
}

/* ============ 机器 ============ */
export interface MachineLoadResource {
  total?: number;
  used?: number;
}

/** 机器级聚合内核状态（来自 fboard-node 心跳 load_status.kernel） */
export type MachineKernelStatus = "idle" | "running" | "stopped" | "partial";

export interface MachineKernelInfo {
  status: MachineKernelStatus;
  nodes_total?: number;
  nodes_running?: number;
  nodes_desired?: number;
}

export interface MachineLoadStatus {
  cpu?: number;
  mem?: MachineLoadResource;
  swap?: MachineLoadResource;
  disk?: MachineLoadResource;
  net?: {
    in_speed?: number;
    out_speed?: number;
  };
  /** fboard-node 二进制版本（机器心跳上报） */
  version?: string | null;
  /** 整机内嵌 xray 内核聚合状态 */
  kernel?: MachineKernelInfo | null;
  updated_at?: number;
}

export interface Machine {
  id: number;
  name: string;
  is_active: boolean;
  is_online?: boolean;
  notes?: string;
  last_seen_at?: number | null;
  servers_count?: number;
  /** fboard-node 版本，来自 load_status.version */
  version?: string | null;
  load_status?: MachineLoadStatus | null;
  [k: string]: any;
}

/** 服务器管理页顶部概览（全局，不受搜索/分页影响） */
export interface MachineSummary {
  total: number;
  online: number;
  offline: number;
  high_load: number;
  nodes: number;
}

export interface MachineListResponse {
  data: Machine[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  summary?: MachineSummary;
}

export async function fetchMachines(
  current = 1,
  pageSize = 10,
  search = "",
): Promise<MachineListResponse> {
  return adminGet<MachineListResponse>("/server/machine/fetch", {
    current,
    pageSize,
    ...(search ? { search } : {}),
  });
}

export async function saveMachine(payload: Partial<Machine>) {
  return adminPost<any>("/server/machine/save", payload);
}

export async function dropMachine(id: number) {
  return adminPost<any>("/server/machine/drop", { id });
}

export async function getMachineToken(id: number) {
  return adminGet<any>("/server/machine/getToken", { id });
}

export async function resetMachineToken(id: number) {
  return adminPost<any>("/server/machine/resetToken", { id });
}

export async function getMachineInstallCommand(id: number) {
  return adminGet<any>("/server/machine/installCommand", { id });
}

export async function getMachineHistory(id: number, rangeHours?: number) {
  const params: any = { machine_id: id };
  if (rangeHours) {
    params.range_hours = rangeHours;
    params.limit = rangeHours * 60;
  }
  return adminGet<any>("/server/machine/history", params);
}

export async function getMachineNodes(id: number) {
  return adminGet<any>("/server/machine/nodes", { machine_id: id });
}

export async function upgradeMachine(id: number) {
  return adminPost<{ submitted: boolean; machine_id: number }>("/server/machine/upgrade", { id });
}

export async function restartMachine(id: number) {
  return adminPost<{ submitted: boolean; machine_id: number; action?: string }>("/server/machine/restart", { id });
}

/** 停止内嵌 xray 内核（整机） */
export async function stopMachine(id: number) {
  return adminPost<{ submitted: boolean; machine_id: number; action?: string }>("/server/machine/stop", { id });
}

/** 启动内嵌 xray 内核（整机） */
export async function startMachine(id: number) {
  return adminPost<{ submitted: boolean; machine_id: number; action?: string }>("/server/machine/start", { id });
}

/** 重载内嵌 xray 内核配置（整机） */
export async function reloadMachine(id: number) {
  return adminPost<{ submitted: boolean; machine_id: number; action?: string }>("/server/machine/reload", { id });
}

export interface BatchMachineUpgradeResult {
  submitted: number;
  skipped: {
    inactive: number;
    offline: number;
  };
}

export async function batchUpgradeMachines() {
  return adminPost<BatchMachineUpgradeResult>("/server/machine/batchUpgrade", {});
}

export interface MachineLogsResult {
  online: boolean;
  lines: string[];
  updated_at?: number | null;
  stale?: boolean;
  message?: string;
  req_id?: string;
}

export async function getMachineLogs(
  id: number,
  opts?: { limit?: number; refresh?: boolean },
): Promise<MachineLogsResult> {
  const params: Record<string, any> = { id };
  if (opts?.limit != null) params.limit = opts.limit;
  if (opts?.refresh != null) params.refresh = opts.refresh ? 1 : 0;
  return adminGet<MachineLogsResult>("/server/machine/logs", params);
}
