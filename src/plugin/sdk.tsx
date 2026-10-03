import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { adminPath } from "@/lib/paths";
import { get, post } from "@/lib/api";
import { adminGet, adminPost, adminUpload } from "@/api/client";
import { useAuthStore } from "@/store/auth";
import { useSettingsStore } from "@/store/settings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  registerExtension,
  getExtension,
  hasExtension,
  listExtensions,
} from "./registry";
import type { FboardAdminSdk } from "./types";

/** 暴露给插件脚本的宿主 SDK */
export const sdk: FboardAdminSdk = {
  version: "1.0.0",
  React,
  ReactDOM,
  ReactDOMClient,
  registerExtension,
  getExtension,
  hasExtension,
  listExtensions,
  ui: {
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    Input,
    Label,
    Badge,
    Separator,
    Switch,
    Textarea,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
  },
  api: { adminGet, adminPost, adminUpload, get, post },
  lib: { cn, adminPath },
  toast,
  i18n,
  useTranslation,
  stores: { useAuthStore, useSettingsStore },
};

/** 将 SDK 挂到 window，供插件脚本调用 */
export function installSdk(): void {
  if (typeof window !== "undefined") {
    window.FboardAdmin = sdk;
  }
}
