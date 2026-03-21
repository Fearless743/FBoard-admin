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
const hysteriaVersionOptions = [
    { label: "V2", value: "v2" },
    { label: "V1", value: "v1" },
];
const hysteriaObfsTypeOptions = [
    { label: "Salamander", value: "salamander" },
];
const tuicVersionOptions = [
    { label: "V5", value: "v5" },
    { label: "V4", value: "v4" },
];
const tuicCongestionControlOptions = [
    { label: "BBR", value: "bbr" },
    { label: "CUBIC", value: "cubic" },
    { label: "NEW_RENO", value: "newreno" },
];
const tuicAlpnOptions = [
    { label: "HTTP/3", value: "h3" },
    { label: "HTTP/2", value: "h2" },
    { label: "HTTP/1.1", value: "http/1.1" },
];
const tuicUdpRelayModeOptions = [
    { label: "Native", value: "native" },
    { label: "QUIC", value: "quic" },
];
const mieruBandwidthOptions = [
    { label: "Low", value: "low" },
    { label: "Middle", value: "middle" },
    { label: "High", value: "high" },
];
const vlessSecurityOptions = [
    { label: "无", value: "none" },
    { label: "TLS", value: "tls" },
    { label: "Reality", value: "reality" },
];
const vlessFlowOptions = [
    { label: "none", value: "none" },
    { label: "xtls-rprx-direct", value: "xtls-rprx-direct" },
    { label: "xtls-rprx-splice", value: "xtls-rprx-splice" },
    { label: "xtls-rprx-vision", value: "xtls-rprx-vision" },
];
const vlessEncryptionOptions = [
    { label: "无", value: null },
    { label: "mlkem768x25519plus", value: "mlkem768x25519plus" },
];
const vlessEncryptionModeOptions = [
    { label: "native", value: "native" },
    { label: "xorpub", value: "xorpub" },
    { label: "random", value: "random" },
];
const vlessEncryptionRttOptions = [
    { label: "0rtt", value: "0rtt" },
    { label: "1rtt", value: "1rtt" },
];
const vmessTlsOptions = [
    { label: "不支持", value: "none" },
    { label: "TLS", value: "tls" },
];
const vmessTransportOptions = [
    { label: "TCP", value: "tcp" },
    { label: "Websocket", value: "ws" },
    { label: "gRPC", value: "grpc" },
    { label: "mKCP", value: "mkcp" },
    { label: "HttpUpgrade", value: "httpupgrade" },
    { label: "XHTTP", value: "xhttp" },
];
const mieruTransportOptions = [
    { label: "TCP", value: "tcp" },
    { label: "UDP", value: "udp" },
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
    mkcp: {
        label: "使用mKCP模板",
        value: JSON.stringify({
            mtu: 1350,
            tti: 20,
            uplinkCapacity: 5,
            downlinkCapacity: 20,
            congestion: false,
            readBufferSize: 2,
            writeBufferSize: 2,
            header: { type: "none" },
        }, null, 2),
    },
    httpupgrade: {
        label: "使用HttpUpgrade模板",
        value: JSON.stringify({
            acceptProxyProtocol: false,
            path: "/",
            host: "xray.com",
            headers: {
                key: "value",
            },
        }, null, 2),
    },
    xhttp: {
        label: "使用XHTTP模板",
        value: JSON.stringify({
            host: "example.com",
            path: "/yourpath",
            mode: "auto",
            extra: {
                headers: {},
                xPaddingBytes: "100-1000",
                noGRPCHeader: false,
                noSSEHeader: false,
                scMaxEachPostBytes: 1000000,
                scMinPostsIntervalMs: 30,
                scMaxBufferedPosts: 30,
                xmux: {
                    maxConcurrency: "16-32",
                    maxConnections: 0,
                    cMaxReuseTimes: "64-128",
                    cMaxLifetimeMs: 0,
                    hMaxRequestTimes: "800-900",
                    hKeepAlivePeriod: 0,
                },
                downloadSettings: {
                    address: "",
                    port: 443,
                    network: "xhttp",
                    security: "tls",
                    tlsSettings: {},
                    xhttpSettings: {
                        path: "/yourpath",
                    },
                    sockopt: {},
                },
            },
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

const isHysteriaProtocol = computed(function isHysteriaProtocol() {
    return currentProtocol.value === "hysteria";
});

const isVlessProtocol = computed(function isVlessProtocol() {
    return currentProtocol.value === "vless";
});

const isTuicProtocol = computed(function isTuicProtocol() {
    return currentProtocol.value === "tuic";
});

const isMieruProtocol = computed(function isMieruProtocol() {
    return currentProtocol.value === "mieru";
});

const isFbnodeProtocol = computed(function isFbnodeProtocol() {
    return currentProtocol.value === "fbnode";
});

const pluginOptionsHint = computed(function pluginOptionsHint() {
    const plugin = String(form.plugin || "").trim();

    if (plugin === "simple-obfs") {
        return "提示：配置格式如 obfs=http;obfs-host=www.bing.com;path=/";
    }

    if (plugin === "v2ray-plugin") {
        return "提示：WebSocket模式格式为 mode=websocket;host=mydomain.me;path=/;tls=true，QUIC模式格式为 mode=quic;host=mydomain.me";
    }

    return "按照 key=value;key2=value2 格式输入插件选项";
});

const showTransportConfigEditor = computed(function showTransportConfigEditor() {
    return (
        (isVmessProtocol.value || isTrojanProtocol.value || isVlessProtocol.value) &&
        form.transportProtocol
    );
});

const transportOptions = computed(function transportOptions() {
    if (isVlessProtocol.value) {
        return vmessTransportOptions;
    }

    if (isMieruProtocol.value) {
        return mieruTransportOptions;
    }

    return vmessTransportOptions.filter(function filterOption(option) {
        return ["tcp", "ws", "grpc"].includes(option.value);
    });
});

const protocolDisplayName = computed(function protocolDisplayName() {
    if (isVmessProtocol.value) {
        return "VMess";
    }

    if (isTrojanProtocol.value) {
        return "Trojan";
    }

    if (isHysteriaProtocol.value) {
        return "Hysteria";
    }

    if (isVlessProtocol.value) {
        return "VLESS";
    }

    if (isTuicProtocol.value) {
        return "TUIC";
    }

    if (isMieruProtocol.value) {
        return "Mieru";
    }

    if (isFbnodeProtocol.value) {
        return "Fbnode";
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
        vlessSecurity: "none",
        vlessFlow: "none",
        vlessEncryption: null,
        vlessEncMode: "native",
        vlessEncRtt: "0rtt",
        vlessEncTicket: "0rtt",
        vlessEncServerPadding: "",
        vlessEncClientPadding: "",
        vlessEncPrivateKey: "",
        vlessEncPassword: "",
        vlessRealityDest: "",
        vlessRealityPort: "",
        vlessRealityPrivateKey: "",
        vlessRealityPublicKey: "",
        vlessRealityShortId: "",
        hysteriaVersion: "v2",
        hysteriaObfs: false,
        hysteriaObfsType: "salamander",
        hysteriaObfsPassword: "",
        hysteriaUpMbps: null,
        hysteriaDownMbps: null,
        hysteriaHopInterval: null,
        tuicVersion: "v5",
        tuicCongestionControl: "bbr",
        tuicAlpn: [],
        tuicUdpRelayMode: "native",
        mieruBandwidth: "low",
        fbnodeChildren: [],
        encryption: "aes-128-gcm",
        plugin: "None",
        pluginOpts: "",
        tls: "none",
        transportProtocol: "tcp",
        transportConfig: "",
        sni: "",
        allowInsecure: false,
        parentId: "",
        routeGroup: "",
    };
}

function normalizeOptionalNumber(value) {
    if (value === "" || value === null || value === undefined) {
        return null;
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
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
        vlessSecurity: node.vlessSecurity || "none",
        vlessFlow: node.vlessFlow || "none",
        vlessEncryption:
            node.vlessEncryption === undefined ? null : node.vlessEncryption,
        vlessEncMode: node.vlessEncMode || "native",
        vlessEncRtt: node.vlessEncRtt || "0rtt",
        vlessEncTicket: node.vlessEncTicket || "0rtt",
        vlessEncServerPadding: node.vlessEncServerPadding || "",
        vlessEncClientPadding: node.vlessEncClientPadding || "",
        vlessEncPrivateKey: node.vlessEncPrivateKey || "",
        vlessEncPassword: node.vlessEncPassword || "",
        vlessRealityDest: node.vlessRealityDest || "",
        vlessRealityPort: node.vlessRealityPort || "",
        vlessRealityPrivateKey: node.vlessRealityPrivateKey || "",
        vlessRealityPublicKey: node.vlessRealityPublicKey || "",
        vlessRealityShortId: node.vlessRealityShortId || "",
        hysteriaVersion: node.hysteriaVersion || "v2",
        hysteriaObfs: Boolean(node.hysteriaObfs),
        hysteriaObfsType: node.hysteriaObfsType || "salamander",
        hysteriaObfsPassword: node.hysteriaObfsPassword || "",
        hysteriaUpMbps: normalizeOptionalNumber(node.hysteriaUpMbps),
        hysteriaDownMbps: normalizeOptionalNumber(node.hysteriaDownMbps),
        hysteriaHopInterval: normalizeOptionalNumber(node.hysteriaHopInterval),
        tuicVersion: node.tuicVersion || "v5",
        tuicCongestionControl: node.tuicCongestionControl || "bbr",
        tuicAlpn: Array.isArray(node.tuicAlpn) ? [...node.tuicAlpn] : [],
        tuicUdpRelayMode: node.tuicUdpRelayMode || "native",
        mieruBandwidth: node.mieruBandwidth || "low",
        fbnodeChildren: Array.isArray(node.children)
            ? node.children.map(function mapChild(child) {
                  return {
                      id: String(child?.id || "").trim(),
                      name: String(child?.name || child?.id || "").trim(),
                  };
              })
            : [],
        encryption: node.encryption || "aes-128-gcm",
        plugin: node.plugin || "None",
        pluginOpts: node.pluginOpts || "",
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
const transportConfigDialogVisible = ref(false);

function resetForm() {
    Object.assign(form, createFormFromNode(props.node));
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

function handleTagsChange(values) {
    const normalized = Array.isArray(values)
        ? values
              .map(function mapTag(tag) {
                  return String(tag || "").trim();
              })
              .filter(Boolean)
        : [];
    form.tags = Array.from(new Set(normalized));
}

function handleTuicAlpnChange(values) {
    const normalized = Array.isArray(values)
        ? values
              .map(function mapAlpn(alpn) {
                  return String(alpn || "").trim();
              })
              .filter(Boolean)
        : [];
    form.tuicAlpn = Array.from(new Set(normalized));
}

function addFbnodeChild() {
    form.fbnodeChildren.push({
        id: "",
        name: "",
    });
}

function removeFbnodeChild(index) {
    form.fbnodeChildren.splice(index, 1);
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

    if (isFbnodeProtocol.value) {
        emit("submit", {
            protocol: currentProtocol.value,
            name: String(form.name || "").trim(),
            fbnodeChildren: Array.isArray(form.fbnodeChildren)
                ? form.fbnodeChildren
                      .map(function mapChild(child) {
                          return {
                              id: String(child?.id || "").trim(),
                              name: String(child?.name || "").trim(),
                          };
                      })
                      .filter(function filterChild(child) {
                          return child.id;
                      })
                : [],
        });
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
        pluginOpts: String(form.pluginOpts || "").trim(),
        vlessSecurity: String(form.vlessSecurity || "none"),
        vlessFlow: String(form.vlessFlow || "none"),
        vlessEncryption:
            form.vlessEncryption === ""
                ? null
                : form.vlessEncryption ?? null,
        vlessEncMode: String(form.vlessEncMode || "native"),
        vlessEncRtt: String(form.vlessEncRtt || "0rtt"),
        vlessEncTicket: String(form.vlessEncTicket || "").trim(),
        vlessEncServerPadding: String(form.vlessEncServerPadding || "").trim(),
        vlessEncClientPadding: String(form.vlessEncClientPadding || "").trim(),
        vlessEncPrivateKey: String(form.vlessEncPrivateKey || "").trim(),
        vlessEncPassword: String(form.vlessEncPassword || "").trim(),
        vlessRealityDest: String(form.vlessRealityDest || "").trim(),
        vlessRealityPort: String(form.vlessRealityPort || "").trim(),
        vlessRealityPrivateKey: String(form.vlessRealityPrivateKey || "").trim(),
        vlessRealityPublicKey: String(form.vlessRealityPublicKey || "").trim(),
        vlessRealityShortId: String(form.vlessRealityShortId || "").trim(),
        hysteriaVersion: String(form.hysteriaVersion || "v2").toLowerCase(),
        hysteriaObfs: Boolean(form.hysteriaObfs),
        hysteriaObfsType: String(form.hysteriaObfsType || "salamander"),
        hysteriaObfsPassword: String(form.hysteriaObfsPassword || "").trim(),
        hysteriaUpMbps: normalizeOptionalNumber(form.hysteriaUpMbps),
        hysteriaDownMbps: normalizeOptionalNumber(form.hysteriaDownMbps),
        hysteriaHopInterval: normalizeOptionalNumber(form.hysteriaHopInterval),
        tuicVersion: String(form.tuicVersion || "v5").toLowerCase(),
        tuicCongestionControl: String(
            form.tuicCongestionControl || "bbr",
        ).toLowerCase(),
        tuicAlpn: Array.isArray(form.tuicAlpn) ? [...form.tuicAlpn] : [],
        tuicUdpRelayMode: String(form.tuicUdpRelayMode || "native").toLowerCase(),
        mieruBandwidth: String(form.mieruBandwidth || "low").toLowerCase(),
        fbnodeChildren: Array.isArray(form.fbnodeChildren)
            ? form.fbnodeChildren
                  .map(function mapChild(child) {
                      return {
                          id: String(child?.id || "").trim(),
                          name: String(child?.name || "").trim(),
                      };
                  })
                  .filter(function filterChild(child) {
                      return child.id;
                  })
            : [],
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
                <el-select
                    v-model="form.tags"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="输入后回车添加标签"
                    @change="handleTagsChange"
                />
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
                v-if="!isVmessProtocol && !isTrojanProtocol && !isHysteriaProtocol && !isVlessProtocol && !isTuicProtocol && !isMieruProtocol && !isFbnodeProtocol"
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
                v-if="!isVmessProtocol && !isTrojanProtocol && !isHysteriaProtocol && !isVlessProtocol && !isTuicProtocol && !isMieruProtocol && !isFbnodeProtocol"
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
            <el-form-item
                v-if="!isVmessProtocol && !isTrojanProtocol && !isHysteriaProtocol && !isVlessProtocol && !isTuicProtocol && !isMieruProtocol && !isFbnodeProtocol"
                label="插件选项"
                class="node-config-form__item"
            >
                <el-input
                    v-model="form.pluginOpts"
                    placeholder="按照 key=value;key2=value2 格式输入插件选项"
                />
                <p class="node-config-form__hint">{{ pluginOptionsHint }}</p>
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

            <el-form-item v-if="isVlessProtocol" label="安全性" class="node-config-form__item">
                <el-select v-model="form.vlessSecurity" placeholder="选择安全性">
                    <el-option
                        v-for="option in vlessSecurityOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </el-select>
            </el-form-item>

            <el-form-item v-if="isHysteriaProtocol" label="协议版本" class="node-config-form__item">
                <el-select v-model="form.hysteriaVersion" placeholder="请选择协议版本">
                    <el-option
                        v-for="option in hysteriaVersionOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </el-select>
            </el-form-item>

            <el-form-item v-if="isTuicProtocol" label="协议版本" class="node-config-form__item">
                <el-select v-model="form.tuicVersion" placeholder="请选择协议版本">
                    <el-option
                        v-for="option in tuicVersionOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </el-select>
            </el-form-item>

            <el-form-item v-if="isTuicProtocol" label="拥塞控制" class="node-config-form__item">
                <el-select v-model="form.tuicCongestionControl" placeholder="选择拥塞控制">
                    <el-option
                        v-for="option in tuicCongestionControlOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </el-select>
            </el-form-item>

            <el-form-item
                v-if="isHysteriaProtocol"
                label=""
                class="node-config-form__item node-config-form__item--no-label"
            >
                <div class="node-config-form__inline-field-group">
                    <div class="node-config-form__inline-field-labels">
                        <span>混淆</span>
                        <span>混淆实现</span>
                        <span>混淆密码</span>
                    </div>
                    <div class="node-config-form__inline-fields node-config-form__inline-fields--three">
                    <el-switch v-model="form.hysteriaObfs" />
                    <el-select
                        v-model="form.hysteriaObfsType"
                        :disabled="!form.hysteriaObfs"
                        placeholder="混淆实现"
                    >
                        <el-option
                            v-for="option in hysteriaObfsTypeOptions"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                        />
                    </el-select>
                    <el-input
                        v-model="form.hysteriaObfsPassword"
                        :disabled="!form.hysteriaObfs"
                        placeholder="请输入混淆密码"
                    />
                    </div>
                </div>
            </el-form-item>

            <div
                v-if="isTuicProtocol || isTrojanProtocol || (isVmessProtocol && form.tls === 'tls') || isHysteriaProtocol || (isVlessProtocol && form.vlessSecurity === 'tls')"
                class="node-config-form__row node-config-form__row--narrow"
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

            <el-form-item v-if="isTuicProtocol" label="ALPN" class="node-config-form__item">
                <el-select
                    v-model="form.tuicAlpn"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="选择ALPN协议"
                    @change="handleTuicAlpnChange"
                >
                    <el-option
                        v-for="option in tuicAlpnOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </el-select>
            </el-form-item>

            <el-form-item v-if="isTuicProtocol" label="UDP中继模式" class="node-config-form__item">
                <el-select v-model="form.tuicUdpRelayMode" placeholder="选择UDP中继模式">
                    <el-option
                        v-for="option in tuicUdpRelayModeOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </el-select>
            </el-form-item>

            <div
                v-if="isVlessProtocol && form.vlessSecurity === 'reality'"
                class="node-config-form__row node-config-form__row--reality"
            >
                <el-form-item label="伪装站点(dest)" class="node-config-form__item">
                    <el-input
                        v-model="form.vlessRealityDest"
                        placeholder="例如：example.com"
                    />
                </el-form-item>
                <el-form-item label="端口(port)" class="node-config-form__item">
                    <el-input-number
                        v-model="form.vlessRealityPort"
                        :min="0"
                        :max="65535"
                        :step="1"
                        :precision="0"
                        step-strictly
                        :controls="false"
                        placeholder="443"
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
                v-if="isVlessProtocol && form.vlessSecurity === 'reality'"
                label="私钥(Private key)"
                class="node-config-form__item"
            >
                <el-input
                    v-model="form.vlessRealityPrivateKey"
                    placeholder="请输入私钥"
                />
            </el-form-item>

            <el-form-item
                v-if="isVlessProtocol && form.vlessSecurity === 'reality'"
                label="公钥(Public key)"
                class="node-config-form__item"
            >
                <el-input
                    v-model="form.vlessRealityPublicKey"
                    placeholder="请输入公钥"
                />
            </el-form-item>

            <el-form-item
                v-if="isVlessProtocol && form.vlessSecurity === 'reality'"
                label="Short ID"
                class="node-config-form__item"
            >
                <el-input
                    v-model="form.vlessRealityShortId"
                    placeholder="可留空，长度为 2 的倍数，最长 16 位"
                />
                <p class="node-config-form__hint">
                    客户端可用 shortId 列表，可用于区分不同的客户端，使用 0-f 作为十六进制字符
                </p>
            </el-form-item>

            <el-form-item v-if="isVlessProtocol" label="流控" class="node-config-form__item">
                <el-select v-model="form.vlessFlow" placeholder="选择流控">
                    <el-option
                        v-for="option in vlessFlowOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </el-select>
            </el-form-item>

            <el-form-item v-if="isVlessProtocol" label="加密" class="node-config-form__item">
                <el-select v-model="form.vlessEncryption" placeholder="选择加密">
                    <el-option
                        v-for="option in vlessEncryptionOptions"
                        :key="String(option.value)"
                        :label="option.label"
                        :value="option.value"
                    />
                </el-select>
            </el-form-item>

            <div
                v-if="isVlessProtocol && form.vlessEncryption"
                class="node-config-form__row node-config-form__row--half"
            >
                <el-form-item label="mode" class="node-config-form__item">
                    <el-select v-model="form.vlessEncMode" placeholder="选择 mode">
                        <el-option
                            v-for="option in vlessEncryptionModeOptions"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="rtt" class="node-config-form__item">
                    <el-select v-model="form.vlessEncRtt" placeholder="选择 rtt">
                        <el-option
                            v-for="option in vlessEncryptionRttOptions"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                        />
                    </el-select>
                </el-form-item>
            </div>

            <el-form-item
                v-if="isVlessProtocol && form.vlessEncryption"
                label="ticket"
                class="node-config-form__item"
            >
                <el-input
                    v-model="form.vlessEncTicket"
                    placeholder="请输入 ticket"
                />
            </el-form-item>

            <div
                v-if="isVlessProtocol && form.vlessEncryption"
                class="node-config-form__row node-config-form__row--half"
            >
                <el-form-item label="server padding" class="node-config-form__item">
                    <el-input
                        v-model="form.vlessEncServerPadding"
                        placeholder="请输入 server_padding"
                    />
                </el-form-item>
                <el-form-item label="client padding" class="node-config-form__item">
                    <el-input
                        v-model="form.vlessEncClientPadding"
                        placeholder="请输入 client_padding"
                    />
                </el-form-item>
            </div>

            <el-form-item
                v-if="isVlessProtocol && form.vlessEncryption"
                label="private key"
                class="node-config-form__item"
            >
                <el-input
                    v-model="form.vlessEncPrivateKey"
                    placeholder="请输入 private_key"
                />
            </el-form-item>

            <el-form-item
                v-if="isVlessProtocol && form.vlessEncryption"
                label="password"
                class="node-config-form__item"
            >
                <el-input
                    v-model="form.vlessEncPassword"
                    placeholder="请输入 password"
                />
            </el-form-item>


            <div
                v-if="isHysteriaProtocol"
                class="node-config-form__row node-config-form__row--half"
            >
                <el-form-item label="上行宽带" class="node-config-form__item">
                    <el-input-number
                        v-model="form.hysteriaUpMbps"
                        :min="0"
                        :step="1"
                        :precision="0"
                        controls-position="right"
                        placeholder="请输入上行宽带，留空则使用 BBR"
                    >
                        <template #suffix>
                            <span>Mbps</span>
                        </template>
                    </el-input-number>
                </el-form-item>
                <el-form-item label="下行宽带" class="node-config-form__item">
                    <el-input-number
                        v-model="form.hysteriaDownMbps"
                        :min="0"
                        :step="1"
                        :precision="0"
                        controls-position="right"
                        placeholder="请输入下行宽带，留空则使用 BBR"
                    >
                        <template #suffix>
                            <span>Mbps</span>
                        </template>
                    </el-input-number>
                </el-form-item>
            </div>

            <el-form-item v-if="isHysteriaProtocol" label="Hop 间隔 (秒)" class="node-config-form__item">
                <el-input-number
                    v-model="form.hysteriaHopInterval"
                    :min="0"
                    :step="1"
                    :precision="0"
                    controls-position="right"
                    placeholder="例如 30"
                />
                <p class="node-config-form__hint">Hop 间隔，单位秒</p>
            </el-form-item>

            <el-form-item
                v-if="isVmessProtocol || isTrojanProtocol || isVlessProtocol || isMieruProtocol"
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
                        v-for="option in transportOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </el-select>
            </el-form-item>

            <el-form-item v-if="isMieruProtocol" label="多路复用" class="node-config-form__item">
                <el-select v-model="form.mieruBandwidth" placeholder="选择多路复用">
                    <el-option
                        v-for="option in mieruBandwidthOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                    />
                </el-select>
            </el-form-item>

            <div v-if="isFbnodeProtocol" class="node-rate-rules">
                <div class="node-rate-rules__head">
                    <span>子节点</span>
                    <el-button link type="primary" @click="addFbnodeChild">
                        + 添加子节点
                    </el-button>
                </div>

                <div
                    v-for="(child, index) in form.fbnodeChildren"
                    :key="`fbnode-child-${index}`"
                    class="node-rate-rule-card"
                >
                    <div class="node-rate-rule-card__head">
                        <strong>子节点 {{ index + 1 }}</strong>
                        <el-button
                            type="danger"
                            link
                            :icon="Delete"
                            @click="removeFbnodeChild(index)"
                        />
                    </div>

                    <div class="node-config-form__row node-config-form__row--half">
                        <el-form-item label="子节点 ID" class="node-config-form__item">
                            <el-input
                                v-model="child.id"
                                placeholder="请输入子节点 ID"
                            />
                        </el-form-item>
                        <el-form-item label="节点名称" class="node-config-form__item">
                            <el-input
                                v-model="child.name"
                                placeholder="选填，用于前端识别"
                            />
                        </el-form-item>
                    </div>
                </div>

                <p v-if="!form.fbnodeChildren.length" class="node-config-form__hint">
                    可添加多个子节点 ID，保存时会写入 `children`
                </p>
            </div>

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
                <el-button
                    v-if="form.transportProtocol === 'mkcp'"
                    size="small"
                    @click="applyTransportTemplate('mkcp')"
                >
                    {{ vmessTransportTemplates.mkcp.label }}
                </el-button>
                <el-button
                    v-if="form.transportProtocol === 'httpupgrade'"
                    size="small"
                    @click="applyTransportTemplate('httpupgrade')"
                >
                    {{ vmessTransportTemplates.httpupgrade.label }}
                </el-button>
                <el-button
                    v-if="form.transportProtocol === 'xhttp'"
                    size="small"
                    @click="applyTransportTemplate('xhttp')"
                >
                    {{ vmessTransportTemplates.xhttp.label }}
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

.node-config-form__row--half {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px;
}

.node-config-form__row--narrow {
    grid-template-columns: minmax(0, 1fr) minmax(0, 140px);
    gap: 12px;
}

.node-config-form__row--reality {
    grid-template-columns: minmax(0, 1fr) minmax(0, 120px) minmax(0, 140px);
    gap: 12px;
    align-items: end;
}

.node-config-form__item--switch {
    align-self: center;
}

.node-config-form__item--no-label :deep(.el-form-item__label) {
    display: none;
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

.node-config-form__inline-fields {
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr);
    gap: 12px;
    align-items: center;
    width: 100%;
}

.node-config-form__inline-fields--three {
    grid-template-columns: 40px minmax(0, 1fr) minmax(0, 1fr);
}

.node-config-form__inline-field-group {
    display: grid;
    gap: 6px;
    width: 100%;
}

.node-config-form__inline-field-labels {
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px;
    color: var(--el-text-color-regular, #606266);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;
    width: 100%;
}


.node-config-form__inline-fields :deep(.el-select) {
    width: 100%;
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
