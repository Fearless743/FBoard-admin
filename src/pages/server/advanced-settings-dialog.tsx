import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type CertConfig = {
  cert_mode?: string;
  domain?: string;
  email?: string;
  http_port?: number | null;
  dns_provider?: string;
  dns_env?: Record<string, string> | string;
  cert_content?: string;
  key_content?: string;
};

export type MultiplexConfig = {
  enabled?: boolean;
  protocol?: string;
  max_connections?: number | null;
  padding?: boolean;
  brutal?: {
    enabled?: boolean;
    up_mbps?: number | null;
    down_mbps?: number | null;
  };
};

/** 与节点后端 / 客户端一致的 multiplex 默认结构 */
const DEFAULT_MULTIPLEX: Required<
  Pick<MultiplexConfig, "enabled" | "protocol" | "max_connections" | "padding">
> & {
  brutal: { enabled: boolean; up_mbps: number; down_mbps: number };
} = {
  enabled: false,
  protocol: "smux",
  max_connections: 4,
  padding: false,
  brutal: {
    enabled: false,
    up_mbps: 100,
    down_mbps: 100,
  },
};

export type AdvancedFormSlice = {
  cert_config?: CertConfig | null;
  custom_outbounds?: any[] | null;
  custom_routes?: any[] | null;
  protocol_settings?: Record<string, any>;
};

const CERT_MODES = [
  "none",
  "self",
  "http",
  "dns",
  "content",
] as const;

const DNS_PROVIDERS = [
  "cloudflare",
  "alidns",
  "tencentcloud",
  "route53",
  "godaddy",
  "namecheap",
  "namesilo",
  "digitalocean",
  "linode",
  "hetzner",
  "gandi",
  "porkbun",
  "netlify",
  "azure",
  "googleclouddns",
  "huaweicloud",
  "bunny",
  "duckdns",
  "ovh",
  "vultr",
  "desec",
] as const;

const MUX_PROTOCOLS = [
  { value: "smux", label: "SMux" },
  { value: "yamux", label: "Yamux" },
  { value: "h2mux", label: "H2mux" },
] as const;

function dnsEnvToText(env?: Record<string, string> | string | null): string {
  if (!env) return "";
  if (typeof env === "string") return env;
  return Object.entries(env)
    .map(([k, v]) => `${k}=${v ?? ""}`)
    .join("\n");
}

function textToDnsEnv(text: string): Record<string, string> | undefined {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return undefined;
  const out: Record<string, string> = {};
  for (const line of lines) {
    const idx = line.indexOf("=");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) out[key] = value;
  }
  return Object.keys(out).length ? out : undefined;
}

function jsonToText(value: any): string {
  if (value == null || value === "") return "[]";
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "[]";
  }
}

function parseJsonArray(
  text: string,
  t: (key: string) => string,
): { ok: true; value: any[] } | { ok: false; error: string } {
  const trimmed = text.trim();
  if (!trimmed) return { ok: true, value: [] };
  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) {
      return {
        ok: false,
        error: t("server.dynamic_form.routing.error.must_be_array"),
      };
    }
    return { ok: true, value: parsed };
  } catch {
    return {
      ok: false,
      error: t("server.dynamic_form.routing.error.invalid_json"),
    };
  }
}

export function AdvancedSettingsDialog({
  open,
  onOpenChange,
  watch,
  setValue,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}) {
  const { t } = useTranslation();

  const [tab, setTab] = useState("tls");
  const [certConfig, setCertConfig] = useState<CertConfig>({ cert_mode: "none" });
  const [dnsEnvText, setDnsEnvText] = useState("");
  const [multiplex, setMultiplex] = useState<MultiplexConfig>({
    ...DEFAULT_MULTIPLEX,
  });
  const [outboundsText, setOutboundsText] = useState("[]");
  const [routesText, setRoutesText] = useState("[]");
  const [outboundsError, setOutboundsError] = useState("");
  const [routesError, setRoutesError] = useState("");

  useEffect(() => {
    if (!open) return;
    const currentCert: CertConfig = watch("cert_config") || { cert_mode: "none" };
    const currentMux: MultiplexConfig =
      watch("protocol_settings.multiplex") || {};
    const mode = currentCert.cert_mode || "none";
    setCertConfig({
      cert_mode: mode === "file" ? "none" : mode,
      domain: currentCert.domain || "",
      email: currentCert.email || "",
      http_port: currentCert.http_port ?? 80,
      dns_provider: currentCert.dns_provider || "",
      cert_content: currentCert.cert_content || "",
      key_content: currentCert.key_content || "",
    });
    setDnsEnvText(dnsEnvToText(currentCert.dns_env));
    setMultiplex({
      enabled: !!currentMux.enabled,
      protocol: currentMux.protocol || DEFAULT_MULTIPLEX.protocol,
      max_connections:
        currentMux.max_connections ?? DEFAULT_MULTIPLEX.max_connections,
      padding: !!currentMux.padding,
      brutal: {
        enabled: !!currentMux.brutal?.enabled,
        up_mbps:
          currentMux.brutal?.up_mbps ?? DEFAULT_MULTIPLEX.brutal.up_mbps,
        down_mbps:
          currentMux.brutal?.down_mbps ?? DEFAULT_MULTIPLEX.brutal.down_mbps,
      },
    });
    setOutboundsText(jsonToText(watch("custom_outbounds")));
    setRoutesText(jsonToText(watch("custom_routes")));
    setOutboundsError("");
    setRoutesError("");
    setTab("tls");
  }, [open, watch]);

  const certMode = certConfig.cert_mode || "none";
  const modeDesc = useMemo(() => {
    const descMap: Record<string, string> = {
      none: t("server.dynamic_form.cert_config.none_desc"),
      self: t(
        "server.dynamic_form.shadowsocks.cert_config.cert_mode.self_description",
      ),
      http: t(
        "server.dynamic_form.shadowsocks.cert_config.cert_mode.http_description",
      ),
      dns: t(
        "server.dynamic_form.shadowsocks.cert_config.cert_mode.dns_description",
      ),
      content: t(
        "server.dynamic_form.shadowsocks.cert_config.cert_mode.content_description",
      ),
    };
    return descMap[certMode] || t("server.dynamic_form.cert_config.cert_mode.description");
  }, [certMode, t]);

  const applyAndClose = () => {
    const outParsed = parseJsonArray(outboundsText, t);
    if (!outParsed.ok) {
      setOutboundsError(outParsed.error);
      setTab("outbounds");
      return;
    }
    const routesParsed = parseJsonArray(routesText, t);
    if (!routesParsed.ok) {
      setRoutesError(routesParsed.error);
      setTab("routes");
      return;
    }

    const nextCert: CertConfig = {
      cert_mode: certMode,
      domain: certConfig.domain || undefined,
      email: certConfig.email || undefined,
      http_port:
        certMode === "http"
          ? Number(certConfig.http_port || 80)
          : certConfig.http_port ?? undefined,
      dns_provider: certMode === "dns" ? certConfig.dns_provider || undefined : undefined,
      dns_env: certMode === "dns" ? textToDnsEnv(dnsEnvText) : undefined,
      cert_content:
        certMode === "content" ? certConfig.cert_content || undefined : undefined,
      key_content:
        certMode === "content" ? certConfig.key_content || undefined : undefined,
    };

    setValue("cert_config", certMode === "none" ? { cert_mode: "none" } : nextCert, {
      shouldDirty: true,
    });
    // 始终按示例结构写入完整 multiplex，便于节点侧稳定解析
    setValue(
      "protocol_settings.multiplex",
      {
        enabled: !!multiplex.enabled,
        protocol: multiplex.protocol || DEFAULT_MULTIPLEX.protocol,
        max_connections:
          multiplex.max_connections ?? DEFAULT_MULTIPLEX.max_connections,
        padding: !!multiplex.padding,
        brutal: {
          enabled: !!multiplex.brutal?.enabled,
          up_mbps:
            multiplex.brutal?.up_mbps ?? DEFAULT_MULTIPLEX.brutal.up_mbps,
          down_mbps:
            multiplex.brutal?.down_mbps ?? DEFAULT_MULTIPLEX.brutal.down_mbps,
        },
      },
      { shouldDirty: true },
    );
    setValue(
      "custom_outbounds",
      outParsed.value.length ? outParsed.value : null,
      { shouldDirty: true },
    );
    setValue(
      "custom_routes",
      routesParsed.value.length ? routesParsed.value : null,
      { shouldDirty: true },
    );
    onOpenChange(false);
  };

  const updateCert = <K extends keyof CertConfig>(key: K, value: CertConfig[K]) => {
    setCertConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>
            {t("server.dynamic_form.advanced.dialog_title")}
          </DialogTitle>
          <DialogDescription>
            {t("server.dynamic_form.advanced.trigger_label")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1">
              <TabsTrigger value="tls" className="text-xs sm:text-sm">
                {t("server.dynamic_form.advanced.tls_tab")}
              </TabsTrigger>
              <TabsTrigger value="multiplex" className="text-xs sm:text-sm">
                {t("server.dynamic_form.advanced.multiplex_tab")}
              </TabsTrigger>
              <TabsTrigger value="outbounds" className="text-xs sm:text-sm">
                {t("server.dynamic_form.routing.outbounds_tab")}
              </TabsTrigger>
              <TabsTrigger value="routes" className="text-xs sm:text-sm">
                {t("server.dynamic_form.routing.routes_tab")}
              </TabsTrigger>
            </TabsList>

            {/* TLS / cert_config */}
            <TabsContent value="tls" className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label>{t("server.dynamic_form.cert_config.cert_mode.label")}</Label>
                <Select
                  value={certMode}
                  onValueChange={(v) => updateCert("cert_mode", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CERT_MODES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {modeDesc && (
                  <p className="text-xs text-muted-foreground">{modeDesc}</p>
                )}
              </div>

              {certMode !== "none" && (
                <>
                  <div className="space-y-1.5">
                    <Label>{t("server.dynamic_form.cert_config.domain.label")}</Label>
                    <Input
                      placeholder={t(
                        "server.dynamic_form.shadowsocks.cert_config.domain.placeholder",
                        { defaultValue: "example.com" },
                      )}
                      value={certConfig.domain || ""}
                      onChange={(e) => updateCert("domain", e.target.value)}
                    />
                  </div>

                  {(certMode === "http" || certMode === "dns") && (
                    <div className="space-y-1.5">
                      <Label>{t("server.dynamic_form.cert_config.email.label")}</Label>
                      <Input
                        type="email"
                        placeholder={t(
                          "server.dynamic_form.shadowsocks.cert_config.email.placeholder",
                          { defaultValue: "admin@example.com" },
                        )}
                        value={certConfig.email || ""}
                        onChange={(e) => updateCert("email", e.target.value)}
                      />
                    </div>
                  )}

                  {certMode === "http" && (
                    <div className="space-y-1.5">
                      <Label>
                        {t("server.dynamic_form.cert_config.http_port.label")}
                      </Label>
                      <Input
                        type="number"
                        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        value={certConfig.http_port ?? 80}
                        onChange={(e) =>
                          updateCert(
                            "http_port",
                            e.target.value === "" ? null : Number(e.target.value),
                          )
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("server.dynamic_form.cert_config.http_port.description")}
                      </p>
                    </div>
                  )}

                  {certMode === "dns" && (
                    <>
                      <div className="space-y-1.5">
                        <Label>
                          {t("server.dynamic_form.cert_config.dns_provider.label")}
                        </Label>
                        <Select
                          value={certConfig.dns_provider || ""}
                          onValueChange={(v) => updateCert("dns_provider", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="cloudflare" />
                          </SelectTrigger>
                          <SelectContent>
                            {DNS_PROVIDERS.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>
                          {t("server.dynamic_form.cert_config.dns_env.label")}
                        </Label>
                        <Textarea
                          className="min-h-[100px] font-mono text-xs"
                          placeholder={"CLOUDFLARE_DNS_API_TOKEN=xxx"}
                          value={dnsEnvText}
                          onChange={(e) => setDnsEnvText(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          {t(
                            "server.dynamic_form.cert_config.dns_env.description_short",
                          )}
                        </p>
                      </div>
                    </>
                  )}

                  {certMode === "content" && (
                    <>
                      <div className="space-y-1.5">
                        <Label>
                          {t("server.dynamic_form.cert_config.cert_content.label")}
                        </Label>
                        <Textarea
                          className="min-h-[140px] font-mono text-xs"
                          placeholder={t(
                            "server.dynamic_form.cert_config.cert_content.placeholder",
                            {
                              defaultValue:
                                "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
                            },
                          )}
                          value={certConfig.cert_content || ""}
                          onChange={(e) =>
                            updateCert("cert_content", e.target.value)
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          {t(
                            "server.dynamic_form.cert_config.cert_content.description",
                          )}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <Label>
                          {t("server.dynamic_form.cert_config.key_content.label")}
                        </Label>
                        <Textarea
                          className="min-h-[140px] font-mono text-xs"
                          placeholder={t(
                            "server.dynamic_form.cert_config.key_content.placeholder",
                            {
                              defaultValue:
                                "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----",
                            },
                          )}
                          value={certConfig.key_content || ""}
                          onChange={(e) =>
                            updateCert("key_content", e.target.value)
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          {t(
                            "server.dynamic_form.cert_config.key_content.description",
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </TabsContent>

            {/* Multiplex */}
            <TabsContent value="multiplex" className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label className="text-sm font-normal">
                    {t("server.dynamic_form.multiplex.enabled.label")}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t("server.dynamic_form.multiplex.enabled.description")}
                  </p>
                </div>
                <Switch
                  checked={!!multiplex.enabled}
                  onCheckedChange={(v) =>
                    setMultiplex((prev) => ({ ...prev, enabled: v }))
                  }
                />
              </div>

              {multiplex.enabled && (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>{t("server.dynamic_form.multiplex.protocol.label")}</Label>
                      <Select
                        value={multiplex.protocol || DEFAULT_MULTIPLEX.protocol}
                        onValueChange={(v) =>
                          setMultiplex((prev) => ({ ...prev, protocol: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MUX_PROTOCOLS.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>
                        {t("server.dynamic_form.multiplex.max_connections.label")}
                      </Label>
                      <Input
                        type="number"
                        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        value={multiplex.max_connections ?? ""}
                        onChange={(e) =>
                          setMultiplex((prev) => ({
                            ...prev,
                            max_connections:
                              e.target.value === ""
                                ? null
                                : Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-md border p-3">
                    <Label className="text-sm font-normal">
                      {t("server.dynamic_form.multiplex.padding.label")}
                    </Label>
                    <Switch
                      checked={!!multiplex.padding}
                      onCheckedChange={(v) =>
                        setMultiplex((prev) => ({ ...prev, padding: v }))
                      }
                    />
                  </div>

                  <div className="space-y-3 rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-normal">
                          {t("server.dynamic_form.multiplex.brutal.enabled.label")}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {t("server.dynamic_form.multiplex.brutal.description")}
                        </p>
                      </div>
                      <Switch
                        checked={!!multiplex.brutal?.enabled}
                        onCheckedChange={(v) =>
                          setMultiplex((prev) => ({
                            ...prev,
                            brutal: { ...prev.brutal, enabled: v },
                          }))
                        }
                      />
                    </div>
                    {multiplex.brutal?.enabled && (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label>
                            {t("server.dynamic_form.multiplex.brutal.up_mbps.label")}
                          </Label>
                          <Input
                            type="number"
                            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            value={multiplex.brutal?.up_mbps ?? ""}
                            onChange={(e) =>
                              setMultiplex((prev) => ({
                                ...prev,
                                brutal: {
                                  ...prev.brutal,
                                  up_mbps:
                                    e.target.value === ""
                                      ? null
                                      : Number(e.target.value),
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>
                            {t(
                              "server.dynamic_form.multiplex.brutal.down_mbps.label",
                            )}
                          </Label>
                          <Input
                            type="number"
                            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            value={multiplex.brutal?.down_mbps ?? ""}
                            onChange={(e) =>
                              setMultiplex((prev) => ({
                                ...prev,
                                brutal: {
                                  ...prev.brutal,
                                  down_mbps:
                                    e.target.value === ""
                                      ? null
                                      : Number(e.target.value),
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </TabsContent>

            {/* Custom Outbounds */}
            <TabsContent value="outbounds" className="mt-4 space-y-2">
              <Label>{t("server.dynamic_form.routing.outbounds")}</Label>
              <Textarea
                className={cn(
                  "min-h-[260px] font-mono text-xs",
                  outboundsError && "border-destructive",
                )}
                value={outboundsText}
                onChange={(e) => {
                  setOutboundsText(e.target.value);
                  setOutboundsError("");
                }}
                placeholder={`[\n  {\n    "tag": "warp",\n    "protocol": "wireguard",\n    "settings": {}\n  }\n]`}
              />
              {outboundsError ? (
                <p className="text-xs text-destructive">{outboundsError}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {t("server.dynamic_form.routing.error.must_be_array")}
                </p>
              )}
            </TabsContent>

            {/* Custom Routes */}
            <TabsContent value="routes" className="mt-4 space-y-2">
              <Label>{t("server.dynamic_form.routing.routes")}</Label>
              <Textarea
                className={cn(
                  "min-h-[260px] font-mono text-xs",
                  routesError && "border-destructive",
                )}
                value={routesText}
                onChange={(e) => {
                  setRoutesText(e.target.value);
                  setRoutesError("");
                }}
                placeholder={`[\n  {\n    "name": "to-warp",\n    "match": { "domains": ["openai.com"] },\n    "action": { "type": "route", "target": "warp" }\n  }\n]`}
              />
              {routesError ? (
                <p className="text-xs text-destructive">{routesError}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {t("server.dynamic_form.routing.error.must_be_array")}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("server.common.cancel")}
          </Button>
          <Button type="button" onClick={applyAndClose}>
            {t("server.common.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

