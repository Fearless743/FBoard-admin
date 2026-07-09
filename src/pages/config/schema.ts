import type { ReactNode } from "react";

export type FieldType =
  | "text"
  | "number"
  | "switch"
  | "select"
  | "password"
  | "textarea"
  | "tags"
  | "json";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FieldDef {
  key: string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  options?: SelectOption[];
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  hidden?: (values: Record<string, unknown>) => boolean;
}

export interface SectionDef {
  key: string;
  title: string;
  description?: string;
  fields: FieldDef[];
  customActions?: ReactNode;
}

export interface ConfigPayload {
  invite: Record<string, unknown>;
  site: Record<string, unknown>;
  subscribe: Record<string, unknown>;
  frontend: Record<string, unknown>;
  server: Record<string, unknown>;
  email: Record<string, unknown>;
  telegram: Record<string, unknown>;
  app: Record<string, unknown>;
  safe: Record<string, unknown>;
  subscribe_template: Record<string, unknown>;
}