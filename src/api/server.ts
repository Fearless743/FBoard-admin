import { adminGet, adminPost } from "@/api/client";

/* ============ 权限组 ============ */
export interface ServerGroup {
  id: number;
  name: string;
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

/* ============ 节点 ============ */
export interface Server {
  id: number;
  code?: string | null;
  name: string;
  type: string; // 协议类型标识 (e.g. 'shadowsocks', 'vmess')
  protocol_settings?: Record<string, any>;
  host: string;
  port: number;
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
  [k: string]: any;
}

export async function getNodes(): Promise<Server[]> {
  return adminGet<Server[]>("/server/manage/getNodes");
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
}

export interface ProtocolType {
  id: number;
  type: string;
  name: string;
}

export async function fetchProtocolDefinitions(): Promise<ProtocolDefinition[]> {
  return adminGet<ProtocolDefinition[]>("/server/protocols/definitions");
}

export async function fetchProtocolTypes(): Promise<ProtocolType[]> {
  return adminGet<ProtocolType[]>("/server/protocols/types");
}

/* ============ 机器 ============ */
export interface Machine {
  id: number;
  name: string;
  is_active: boolean;
  notes?: string;
  last_seen_at?: number | null;
  nodes_count?: number;
  [k: string]: any;
}

export async function fetchMachines(): Promise<Machine[]> {
  return adminGet<Machine[]>("/server/machine/fetch");
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

export async function getMachineHistory(id: number) {
  return adminGet<any>("/server/machine/history", { id });
}

export async function getMachineNodes(id: number) {
  return adminGet<any>("/server/machine/nodes", { id });
}
