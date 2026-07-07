import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock, Mail, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { login } from "@/api/auth";
import { useAuthStore } from "@/store/auth";
import { adminPath } from "@/lib/paths";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "请输入密码"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuthData = useAuthStore((s) => s.setAuthData);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [remember, setRemember] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const res = await login(values);
      const user: any = {
        id: 0,
        balance: 0,
        commission_balance: 0,
        transfer_enable: 0,
        email: values.email,
        is_admin: !!res.is_admin,
        is_staff: false,
      };
      // auth_data 形如 "Bearer xxx"，作为真正的凭据
      setAuthData(res.auth_data, user);
      if (remember) {
        localStorage.setItem("xboard-admin-remember", "1");
      }
      toast.success(t("common.success"));
      navigate(adminPath("dashboard"));
    } catch (e: any) {
      // 错误信息已由 axios 拦截器统一 toast
    } finally {
      setLoading(false);
    }
  };

  // 站点信息：优先来自后端注入的 window.settings
  const siteName = window.settings?.title || "Fboard";
  const logo = window.settings?.logo;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/30 p-4">
      {/* 背景渐变 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="pointer-events-none absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-xl md:grid-cols-2">
        {/* 左侧品牌区 */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-10 text-white md:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur ring-1 ring-white/20">
              {logo ? (
                <img src={logo} alt="logo" className="h-8 w-8 object-contain" />
              ) : (
                <Cloud className="h-7 w-7" />
              )}
            </div>
            <div>
              <div className="text-xl font-semibold tracking-tight">{siteName}</div>
              <div className="text-sm text-white/60">Admin Console</div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold leading-tight">
              {t("auth.signIn.title")}
            </h1>
            <p className="text-sm leading-relaxed text-white/60">
              {t("auth.signIn.description")}
            </p>
          </div>

          <div className="text-xs text-white/40">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </div>
        </div>

        {/* 右侧表单区 */}
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-8 md:hidden">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Cloud className="h-6 w-6" />
                </div>
                <span className="text-lg font-semibold">{siteName}</span>
              </div>
            </div>

            <div className="mb-6 space-y-1.5">
              <h2 className="text-2xl font-semibold tracking-tight">
                {t("auth.signIn.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("auth.signIn.description")}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.signIn.email")}</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t("auth.signIn.emailPlaceholder")}
                    className="pl-9"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message?.includes("email")
                      ? t("auth.signIn.validation.emailInvalid")
                      : t("auth.signIn.validation.emailRequired")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("auth.signIn.password")}</Label>
                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t("auth.signIn.forgotPassword")}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder={t("auth.signIn.passwordPlaceholder")}
                    className="px-9"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message?.includes("7")
                      ? t("auth.signIn.validation.passwordLength")
                      : t("auth.signIn.validation.passwordRequired")}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(v === true)}
                />
                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                  {t("auth.signIn.rememberMe")}
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("auth.signIn.submit")}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* 忘记密码弹窗：展示重置命令 */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("auth.signIn.resetPassword.title")}</DialogTitle>
            <DialogDescription>
              {t("auth.signIn.resetPassword.description")}
            </DialogDescription>
          </DialogHeader>
          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
            <code>{t("auth.signIn.resetPassword.command")}</code>
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}
