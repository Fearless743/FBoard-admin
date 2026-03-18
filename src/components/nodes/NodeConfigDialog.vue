<script setup>
import { computed, reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { Delete } from "@element-plus/icons-vue";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    mode: {
        type: String,
        default: "create",
    },
    node: {
        type: Object,
        default: null,
    },
    groupOptions: {
        type: Array,
        default: function defaultGroupOptions() {
            return [];
        },
    },
    parentOptions: {
        type: Array,
        default: function defaultParentOptions() {
            return [];
        },
    },
    routeOptions: {
        type: Array,
        default: function defaultRouteOptions() {
            return [];
        },
    },
    protocol: {
        type: String,
        default: "shadowsocks",
    },
});

const emit = defineEmits(["update:modelValue", "submit"]);

const encryptionOptions = [
    "aes-128-gcm",
    "aes-192-gcm",
    "aes-256-gcm",
    "chacha20-ietf-poly1305",
    "2022-blake3-aes-128-gcm",
    "2022-blake3-aes-256-gcm",
];

const pluginOptions = ["None", "simple-obfs", "v2ray-plugin"];
const vmessTlsOptions = [
    { label: "不支持", value: "none" },
    { label: "TLS", value: "tls" },
];
const vmessTransportOptions = [
    { label: "TCP", value: "tcp" },
    { label: "Websocket", value: "ws" },
    { label: "gRPC", value: "grpc" },
];

const vmessTransportTemplates = {
    tcp: {
        label: "使用TCP模板",
        value: JSON.stringify({
            acceptProxyProtocol: false,
            header: { type: "none" },
        }, null, 2),
    },
    tcpHttp: {
        label: "使用TCP + HTTP模板",
        value: JSON.stringify({
            acceptProxyProtocol: false,
            header: {
                type: "http",
                request: {
                    version: "1.1",
                    method: "GET",
                    path: ["/"],
                    headers: {
                        Host: ["www.example.com"],
                    },
                },
                response: {
                    version: "1.1",
                    status: "200",
                    reason: "OK",
                },
            },
        }, null, 2),
    },
    ws: {
        label: "使用WebSocket模板",
        value: JSON.stringify({
            path: "/",
            headers: {
                Host: "v2ray.com",
            },
        }, null, 2),
    },
    grpc: {
        label: "使用gRPC模板",
        value: JSON.stringify({
            serviceName: "GunService",
        }, null, 2),
    },
};

const currentProtocol = computed(function currentProtocol() {
    return String(props.protocol || "shadowsocks").toLowerCase();
});

const isVmessProtocol = computed(function isVmessProtocol() {
    return currentProtocol.value === "vmess";
});

const isTrojanProtocol = computed(function isTrojanProtocol() {
    return currentProtocol.value === "trojan";
});

const showTransportConfigEditor = computed(function showTransportConfigEditor() {
    return (isVmessProtocol.value || isTrojanProtocol.value) && form.transportProtocol;
});

const protocolDisplayName = computed(function protocolDisplayName() {
    if (isVmessProtocol.value) {
        return "VMess";
    }

    if (isTrojanProtocol.value) {
        return "Trojan";
    }

    return "Shadowsocks";
});

function createDefaultForm() {
    return {
        name: "",
        baseRate: 1,
        dynamicRate: false,
        dynamicRules: [createDefaultRateRule()],
        customNodeId: "",
        tags: [],
        groupIds: [],
        host: "",
        port: "",
        serverPort: "",
        encryption: "aes-128-gcm",
        plugin: "None",
        tls: "none",
        transportProtocol: "tcp",
        transportConfig: "",
        sni: "",
        allowInsecure: false,
        parentId: "",
        routeGroup: "",
    };
}

function createDefaultRateRule() {
    return {
        startTime: "00:00",
        endTime: "23:59",
        rate: 1,
    };
}

function normalizeDynamicRule(rule) {
    return {
        startTime: String(rule?.startTime || "00:00"),
        endTime: String(rule?.endTime || "23:59"),
        rate: normalizeRateToNumber(rule?.rate),
    };
}

function normalizeRateToNumber(rate) {
    const raw = String(rate || "1").replace(/x$/i, "");
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : 1;
}

function normalizePortValue(value) {
    if (value === "" || value === null || value === undefined) {
        return "";
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return "";
    }

    const integerValue = Math.trunc(numericValue);
    return Math.min(65535, Math.max(0, integerValue));
}

function createFormFromNode(node) {
    if (!node) {
        return createDefaultForm();
    }

    return {
        name: node.name || "",
        baseRate: normalizeRateToNumber(node.rate),
        dynamicRate: Boolean(node.dynamicRate),
        dynamicRules: Array.isArray(node.dynamicRules) && node.dynamicRules.length
            ? node.dynamicRules.map(function mapDynamicRule(rule) {
                  return normalizeDynamicRule(rule);
              })
            : [createDefaultRateRule()],
        customNodeId: node.customNodeId || "",
        tags: Array.isArray(node.rawTags)
            ? [...node.rawTags]
            : Array.isArray(node.tags)
              ? [...node.tags]
              : [],
        groupIds: Array.isArray(node.groupIds)
            ? node.groupIds.map(function mapGroupId(groupId) {
                  return String(groupId);
              })
            : [],
        host: node.host || "",
        port: normalizePortValue(node.port),
        serverPort: normalizePortValue(node.serverPort),
        encryption: node.encryption || "aes-128-gcm",
        plugin: node.plugin || "None",
        tls: node.tls || "none",
        transportProtocol: node.transportProtocol || "tcp",
        transportConfig: node.transportConfig || "",
        sni: node.sni || "",
        allowInsecure: Boolean(node.allowInsecure),
        parentId: node.parentId ? String(node.parentId) : "",
        routeGroup: node.routeId || node.routeGroup || "",
    };
}

const dialogVisible = computed({
    get: function getDialogVisible() {
        return props.modelValue;
    },
    set: function setDialogVisible(value) {
        emit("update:modelValue", value);
    },
});

const form = reactive(createDefaultForm());
const tagInput = ref("");
const transportConfigDialogVisible = ref(false);

function resetForm() {
    Object.assign(form, createFormFromNode(props.node));
    tagInput.value = "";
}

watch(
    function watchDialogVisible() {
        return dialogVisible.value;
    },
    function syncFormWhenOpen(visible) {
        if (visible) {
            resetForm();
        }
    },
);

function closeDialog() {
    dialogVisible.value = false;
}

function openTransportConfigDialog() {
    transportConfigDialogVisible.value = true;
}

function applyTransportTemplate(templateKey) {
    const template = vmessTransportTemplates[templateKey];
    if (!template) {
        return;
    }

    form.transportConfig = template.value;
}

function addTag() {
    const nextTag = String(tagInput.value || "").trim();
    if (!nextTag) {
        return;
    }

    if (!form.tags.includes(nextTag)) {
        form.tags.push(nextTag);
    }

    tagInput.value = "";
}

function removeTag(tag) {
    form.tags = form.tags.filter(function filterTag(currentTag) {
        return currentTag !== tag;
    });
}

function syncPortToServerPort() {
    form.serverPort = normalizePortValue(form.port);
}

function sanitizePortField(fieldName) {
    form[fieldName] = normalizePortValue(form[fieldName]);
}

function addDynamicRule() {
    form.dynamicRules.push(createDefaultRateRule());
}

function removeDynamicRule(index) {
    if (form.dynamicRules.length <= 1) {
        form.dynamicRules.splice(0, 1, createDefaultRateRule());
        return;
    }

    form.dynamicRules.splice(index, 1);
}

function handleSubmit() {
    if (!String(form.name || "").trim()) {
        ElMessage.warning("请填写节点名称");
        return;
    }

    if (!String(form.host || "").trim()) {
        ElMessage.warning("请填写节点地址");
        return;
    }

    if (
        !String(form.port || "").trim() ||
        !String(form.serverPort || "").trim()
    ) {
        ElMessage.warning("请完整填写连接端口与服务端口");
        return;
    }

    if (
        normalizePortValue(form.port) === "" ||
        normalizePortValue(form.serverPort) === ""
    ) {
        ElMessage.warning("端口只允许输入 0-65535 的数字");
        return;
    }

    emit("submit", {
        protocol: currentProtocol.value,
        name: String(form.name || "").trim(),
        baseRate: Number(form.baseRate || 1),
        dynamicRate: Boolean(form.dynamicRate),
        dynamicRules: form.dynamicRules.map(function mapDynamicRule(rule) {
            return normalizeDynamicRule(rule);
        }),
        customNodeId: String(form.customNodeId || "").trim(),
        tags: [...form.tags],
        groupIds: [...form.groupIds],
        host: String(form.host || "").trim(),
        port: String(form.port || "").trim(),
        serverPort: String(form.serverPort || "").trim(),
        encryption: form.encryption,
        plugin: form.plugin,
        tls: form.tls,
        transportProtocol: form.transportProtocol,
        transportConfig: form.transportConfig,
        sni: String(form.sni || "").trim(),
        allowInsecure: Boolean(form.allowInsecure),
        parentId: form.parentId,
        routeGroup: String(form.routeGroup || "").trim(),
    });
}
</script>

<template>
    <el-dialog
        v-model="dialogVisible"
        :title="mode === 'edit' ? `编辑 ${protocolDisplayName} 节点` : `添加 ${protocolDisplayName} 节点`"
        width="560px"
        destroy-on-close
    >
        <el-form label-position="top" class="node-config-form">
            <div class="node-config-form__row node-config-form__row--head">
                <el-form-item label="节点名称" class="node-config-form__item">
                    <el-input
                        v-model="form.name"
                        placeholder="请输入节点名称"
                    />
                </el-form-item>

                <el-form-item
                    label="基础倍率"
                    class="node-config-form__item node-config-form__item--sm"
                >
                    <el-input-number
                        v-model="form.baseRate"
                        :min="0.1"
                        :step="0.1"
                        :precision="2"
                        controls-position="right"
                    />
                </el-form-item>
            </div>

            <el-form-item label="启用动态倍率" class="node-config-form__item">
                <el-switch v-model="form.dynamicRate" />
                <p class="node-config-form__hint">
                    根据时间段设置不同的倍率乘数
                </p>
            </el-form-item>

            <div v-if="form.dynamicRate" class="node-rate-rules">
                <div class="node-rate-rules__head">
                    <span>时间段规则</span>
                    <el-button link type="primary" @click="addDynamicRule">
                        + 添加规则
                    </el-button>
                </div>

                <div
                    v-for="(rule, index) in form.dynamicRules"
                    :key="`rule-${index}`"
                    class="node-rate-rule-card"
                >
                    <div class="node-rate-rule-card__head">
                        <strong>规则 {{ index + 1 }}</strong>
                        <el-button
                            type="danger"
                            link
                            :icon="Delete"
                            @click="removeDynamicRule(index)"
                        />
                    </div>

                    <div class="node-rate-rule-card__grid">
                        <el-form-item label="开始时间" class="node-config-form__item">
                            <el-input
                                v-model="rule.startTime"
                                placeholder="00:00"
                            />
                        </el-form-item>
                        <el-form-item label="结束时间" class="node-config-form__item">
                            <el-input
                                v-model="rule.endTime"
                                placeholder="23:59"
                            />
                        </el-form-item>
                        <el-form-item label="倍率乘数" class="node-config-form__item">
                            <el-input-number
                                v-model="rule.rate"
                                :min="0.1"
                                :step="0.1"
                                :precision="2"
                                controls-position="right"
                            />
                        </el-form-item>
                    </div>
                </div>
            </div>

            <el-form-item
                label="自定义节点 ID (选填)"
                class="node-config-form__item"
            >
                <el-input
                    v-model="form.customNodeId"
                    placeholder="请输入自定义节点 ID"
                />
            </el-form-item>

            <el-form-item label="节点标签" class="node-config-form__item">
                <el-input
                    v-model="tagInput"
                    placeholder="输入后回车添加标签"
                    @keyup.enter="addTag"
                />
                <div v-if="form.tags.length" class="node-config-form__tags">
                    <el-tag
                        v-for="tag in form.tags"
                        :key="tag"
                        closable
                        size="small"
                        @close="removeTag(tag)"
                    >
                        {{ tag }}
                    </el-tag>
                </div>
            </el-form-item>

            <el-form-item class="node-config-form__item">
                <template #label>
                    <div class="node-config-form__label">
                        <span>权限组</span>
                        <el-button link type="primary" size="small"
                            >添加权限组</el-button
                        >
                    </div>
                </template>
                <el-select
                    v-model="form.groupIds"
                    multiple
                    filterable
                    placeholder="请选择权限组"
                >
                    <el-option
                        v-for="group in groupOptions"
                        :key="group.value"
                        :label="group.label"
                        :value="String(group.value)"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="节点地址" class="node-config-form__item">
                <el-input
                    v-model="form.host"
                    placeholder="请输入节点域名或者 IP"
                />
            </el-form-item>

            <div class="node-config-form__row">
                <el-form-item label="连接端口" class="node-config-form__item">
                    <el-input-number
                        v-model="form.port"
                        :min="0"
                        :max="65535"
                        :step="1"
                        :precision="0"
                        step-strictly
                        :controls="false"
                        placeholder="用户连接端口"
                        @change="sanitizePortField('port')"
                    />
                </el-form-item>
                <div class="node-config-form__equals">
                    <el-button
                        class="node-config-form__sync-btn"
                        link
                        type="primary"
                        @click="syncPortToServerPort"
                    >
                        =>
                    </el-button>
                </div>
                <el-form-item label="服务端口" class="node-config-form__item">
                    <el-input-number
                        v-model="form.serverPort"
                        :min="0"
                        :max="65535"
                        :step="1"
                        :precision="0"
                        step-strictly
                        :controls="false"
                        placeholder="请输入服务端口"
                        @change="sanitizePortField('serverPort')"
                    />
                </el-form-item>
            </div>

            <el-form-item
                v-if="!isVmessProtocol && !isTrojanProtocol"
                label="加密算法"
                class="node-config-form__item"
            >
                <el-select
                    v-model="form.encryption"
                    filterable
                    allow-create
                    default-first-option
                    clearable
                    placeholder="搜索或输入自定义加密方式..."
                >
                    <el-option-group label="预设加密方式">
                        <el-option
                            v-for="cipher in encryptionOptions"
                            :key="cipher"
                            :label="cipher"
                            :value="cipher"
                        />
                    </el-option-group>
                </el-select>
                <p class="node-config-form__hint">
                    选择预设加密方式或输入自定义加密方式
                </p>
            </el-form-item>

            <el-form-item
                v-if="!isVmessProtocol && !isTrojanProtocol"
                label="插件"
                class="node-config-form__item"
            >
                <el-select v-model="form.plugin" placeholder="请选择插件">
                    <el-option
                        v-for="plugin in pluginOptions"
                        :key="plugin"
                        :label="plugin"
                        :value="plugin"
                    />
                </el-select>
            </el-form-item>

            <el-form-item v-if="isVmessProtocol" label="TLS" class="node-config-form__item">
                <el-select v-model="form.tls" placeholder="请选择 TLS">
                    <el-option
                        v-for="option in vmessTlsOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </el-select>
            </el-form-item>

            <div
                v-if="isTrojanProtocol"
                class="node-config-form__row node-config-form__row--split"
            >
                <el-form-item
                    label="服务器名称指示(SNI)"
                    class="node-config-form__item"
                >
                    <el-input
                        v-model="form.sni"
                        placeholder="当节点地址与证书不一致时用于证书验证"
                    />
                </el-form-item>
                <el-form-item
                    label="允许不安全?"
                    class="node-config-form__item node-config-form__item--switch"
                >
                    <el-switch v-model="form.allowInsecure" />
                </el-form-item>
            </div>

            <el-form-item
                v-if="isVmessProtocol || isTrojanProtocol"
                class="node-config-form__item"
            >
                <template #label>
                    <div class="node-config-form__label">
                        <span>传输协议</span>
                        <el-button
                            v-if="showTransportConfigEditor"
                            class="node-config-form__inline-btn"
                            link
                            type="primary"
                            size="small"
                            @click="openTransportConfigDialog"
                        >
                            编辑协议
                        </el-button>
                    </div>
                </template>
                <el-select v-model="form.transportProtocol" placeholder="传输协议">
                    <el-option
                        v-for="option in vmessTransportOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="父级节点" class="node-config-form__item">
                <el-select v-model="form.parentId" clearable placeholder="无">
                    <el-option label="无" value="" />
                    <el-option
                        v-for="parent in parentOptions"
                        :key="parent.value"
                        :label="parent.label"
                        :value="String(parent.value)"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="路由组" class="node-config-form__item">
                <el-select
                    v-model="form.routeGroup"
                    clearable
                    filterable
                    :loading="false"
                    placeholder="选择路由组"
                >
                    <el-option
                        v-for="route in routeOptions"
                        :key="route.value"
                        :label="route.label"
                        :value="String(route.value)"
                    />
                </el-select>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="node-config-form__footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="handleSubmit"
                    >保存节点</el-button
                >
            </div>
        </template>
    </el-dialog>

    <el-dialog
        v-model="transportConfigDialogVisible"
        title="编辑协议配置"
        width="520px"
        destroy-on-close
    >
        <div class="node-protocol-config">
            <div class="node-protocol-config__templates">
                <el-button
                    v-if="form.transportProtocol === 'tcp'"
                    size="small"
                    @click="applyTransportTemplate('tcp')"
                >
                    {{ vmessTransportTemplates.tcp.label }}
                </el-button>
                <el-button
                    v-if="form.transportProtocol === 'tcp'"
                    size="small"
                    @click="applyTransportTemplate('tcpHttp')"
                >
                    {{ vmessTransportTemplates.tcpHttp.label }}
                </el-button>
                <el-button
                    v-if="form.transportProtocol === 'ws'"
                    size="small"
                    @click="applyTransportTemplate('ws')"
                >
                    {{ vmessTransportTemplates.ws.label }}
                </el-button>
                <el-button
                    v-if="form.transportProtocol === 'grpc'"
                    size="small"
                    @click="applyTransportTemplate('grpc')"
                >
                    {{ vmessTransportTemplates.grpc.label }}
                </el-button>
            </div>
            <el-input
                v-model="form.transportConfig"
                type="textarea"
                :rows="8"
                placeholder="请输入 JSON 配置或选择上方模板"
            />
        </div>

        <template #footer>
            <div class="node-config-form__footer">
                <el-button @click="transportConfigDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="transportConfigDialogVisible = false"
                    >确定</el-button
                >
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
.node-config-form {
    margin-top: -6px;
}

.node-config-form__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 24px minmax(0, 1fr);
    gap: 10px;
    align-items: end;
}

.node-config-form__row--head {
    grid-template-columns: minmax(0, 1fr) minmax(0, 100px);
}

.node-config-form__row--split {
    grid-template-columns: minmax(0, 1fr) minmax(0, 140px);
    gap: 14px;
}

.node-config-form__item--switch {
    align-self: center;
}

.node-config-form__item {
    width: 100%;
    margin-bottom: 12px;
}

.node-config-form__item--sm :deep(.el-input-number) {
    width: 100%;
}

.node-config-form__item :deep(.el-input-number) {
    width: 100%;
}

.node-config-form__label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}


.node-config-form__equals {
    padding-bottom: 22px;
    text-align: center;
}

.node-config-form__sync-btn {
    padding: 0;
    font-family: "Fira Code", monospace;
}

.node-config-form__hint {
    margin: 6px 0 0;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.4;
}

.node-config-form__inline-btn {
    padding: 0;
}

.node-rate-rules {
    margin: -4px 0 12px;
}

.node-rate-rules__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    color: var(--text);
    font-size: 14px;
    font-weight: 600;
}

.node-rate-rule-card {
    padding: 12px;
    border-radius: 10px;
    border: 1px solid var(--line);
    background: rgba(8, 17, 34, 0.35);
}

.node-rate-rule-card + .node-rate-rule-card {
    margin-top: 8px;
}

.node-rate-rule-card__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.node-rate-rule-card__head strong {
    font-size: 13px;
    color: var(--text);
}

.node-rate-rule-card__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
}

.node-rate-rule-card__grid .node-config-form__item {
    margin-bottom: 0;
}

.node-config-form__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
}

.node-config-form__footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.node-protocol-config {
    display: grid;
    gap: 12px;
}

.node-protocol-config__templates {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

@media (max-width: 640px) {
    .node-config-form__row,
    .node-config-form__row--head {
        grid-template-columns: minmax(0, 1fr);
    }

    .node-rate-rule-card__grid {
        grid-template-columns: minmax(0, 1fr);
    }


    .node-config-form__equals {
        display: none;
    }
}
</style>
