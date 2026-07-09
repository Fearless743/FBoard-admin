import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { FieldDef } from "./schema";

interface BaseProps {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  disabled?: boolean;
}

export function FieldRow({ field, value, onChange, disabled }: BaseProps) {
  const body = renderControl({ field, value, onChange, disabled });
  if (field.type === "switch") {
    return (
      <div className="flex items-center justify-between rounded-md border bg-card px-4 py-3">
        <div className="space-y-1 pr-4">
          <Label className="text-sm font-medium">{field.label}</Label>
          {field.description && (
            <p className="text-xs text-muted-foreground">{field.description}</p>
          )}
        </div>
        {body}
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{field.label}</Label>
      {body}
      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}
    </div>
  );
}

interface SwitchGroupProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
}

export function SwitchGroup({
  label,
  description,
  checked,
  onChange,
  disabled,
  children,
}: SwitchGroupProps) {
  const showChildren = checked && !!children;
  return (
    <div
      className={cn(
        "rounded-md border bg-card transition-colors",
        showChildren && "border-primary/30 bg-card",
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="space-y-1 pr-4">
          <Label className="text-sm font-medium">{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
      </div>
      {showChildren && (
        <>
          <div className="h-px bg-border" />
          <div className="space-y-4 rounded-b-md bg-muted/40 px-4 py-4">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

function renderControl(props: BaseProps) {
  const { field, value, onChange, disabled } = props;
  switch (field.type) {
    case "text":
      return (
        <Input
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <Input
          type="number"
          value={value === undefined || value === null ? "" : String(value)}
          placeholder={field.placeholder}
          disabled={disabled}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? null : Number(v));
          }}
        />
      );
    case "password":
      return (
        <Input
          type="password"
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "textarea":
      return (
        <Textarea
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          disabled={disabled}
          rows={field.rows ?? 6}
          className="font-mono text-xs"
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "json":
      return (
        <JsonField
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          disabled={disabled}
          onChange={onChange}
        />
      );
    case "select":
      return (
        <Select
          value={value === undefined || value === null ? "" : String(value)}
          disabled={disabled}
          onValueChange={(v) => onChange(coerceSelectValue(v, field))}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((opt) => (
              <SelectItem key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "switch":
      return (
        <Switch
          checked={!!value}
          disabled={disabled}
          onCheckedChange={(v) => onChange(v)}
        />
      );
    case "tags":
      return (
        <TagsField
          value={(value as string[]) ?? []}
          placeholder={field.placeholder}
          disabled={disabled}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}

function coerceSelectValue(v: string, field: FieldDef): string | number {
  const opt = (field.options ?? []).find((o) => String(o.value) === v);
  if (!opt) return v;
  return typeof opt.value === "number" ? Number(opt.value) : v;
}

interface TagsFieldProps {
  value: string[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (v: string[]) => void;
}

function TagsField({ value, placeholder, disabled, onChange }: TagsFieldProps) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (value.includes(v)) {
      setDraft("");
      return;
    }
    onChange([...value, v]);
    setDraft("");
  };
  const remove = (i: number) => {
    onChange(value.filter((_, idx) => idx !== i));
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" size="icon" disabled={disabled || !draft.trim()} onClick={add}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag, i) => (
            <Badge key={`${tag}-${i}`} variant="secondary" className="gap-1 pr-1">
              {tag}
              {!disabled && (
                <button
                  type="button"
                  className="ml-0.5 rounded-sm p-0.5 hover:bg-muted-foreground/20"
                  onClick={() => remove(i)}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

interface JsonFieldProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (v: unknown) => void;
}

function JsonField({ value, placeholder, disabled, onChange }: JsonFieldProps) {
  const { t } = useTranslation();
  const [text, setText] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (text !== value && !busy) {
    setText(value);
    setError(null);
  }

  const apply = () => {
    setBusy(true);
    try {
      const parsed = text.trim() === "" ? null : JSON.parse(text);
      setError(null);
      onChange(parsed === null ? "" : JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setError(e?.message ?? t("settings.common.invalidJson"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <Textarea
        value={text}
        placeholder={placeholder ?? '{"key": "value"}'}
        disabled={disabled}
        rows={10}
        className={cn("font-mono text-xs", error && "border-destructive")}
        onChange={(e) => setText(e.target.value)}
        onBlur={apply}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {busy && (
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" /> parsing...
        </p>
      )}
    </div>
  );
}