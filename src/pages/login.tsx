import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Cloud,
  Fingerprint,
  ShieldCheck,
  ArrowLeft,
  Smartphone,
} from "lucide-react";
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
import {
  passkeyAuthOptions,
  passkeyAuthVerify,
  passkeySetupOptions,
  passkeySetupVerify,
} from "@/api/passkey";
import { useAuthStore } from "@/store/auth";
import { adminPath } from "@/lib/paths";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";

type FormValues = {
  email: string;
  password: string;
};

type Step = "password" | "passkey" | "setup";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuthData = useAuthStore((s) => s.setAuthData);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [remember, setRemember] = useState(true);
  const [step, setStep] = useState<Step>("password");
  const [ticket, setTicket] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [passkeyError, setPasskeyError] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  // 登录页入场：卡片整体上浮，品牌区与表单区依次错落出现
  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        tl.from(card, { opacity: 0, y: 24, duration: 0.55 });
        tl.from(
          card.querySelectorAll('[data-anim="login-brand"] > *'),
          { x: -18, opacity: 0, duration: 0.5, stagger: 0.09 },
          "-=0.3",
        );
        tl.from(
          card.querySelectorAll('[data-anim="login-form"] > *'),
          { y: 14, opacity: 0, duration: 0.45, stagger: 0.06 },
          "-=0.5",
        );
      });
    },
    { scope: cardRef },
  );

  const schema = z.object({
    email: z
      .string()
      .min(1, t("auth.signIn.validation.emailRequired"))
      .email(t("auth.signIn.validation.emailInvalid")),
    password: z.string().min(1, t("auth.signIn.validation.passwordRequired")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const finishWithToken = (authData: string, isAdmin: boolean, email: string) => {
    const user: any = {
      id: 0,
      balance: 0,
      commission_balance: 0,
      transfer_enable: 0,
      email,
      is_admin: !!isAdmin,
      is_staff: false,
    };
    setAuthData(authData, user);
    if (remember) {
      localStorage.setItem("fboard-admin-remember", "1");
    }
    toast.success(t("common.success"));
    navigate(adminPath("dashboard"));
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const res = await login(values);
      // 非管理员：直接拿 token
      if (res.auth_data) {
        finishWithToken(res.auth_data, !!res.is_admin, values.email);
        return;
      }
      // 管理员：进入第二步
      if (res.passkey_required && res.ticket) {
        setTicket(res.ticket);
        setLoginEmail(values.email);
        setPasskeyError("");
        if (res.passkey_setup_required) {
          setStep("setup");
        } else {
          setStep("passkey");
          void runPasskeyAuth(res.ticket, values.email);
        }
        return;
      }
      toast.error(t("auth.signIn.passkey.unexpectedResponse"));
    } catch (e: any) {
      // 错误信息已由统一 toast
    } finally {
      setLoading(false);
    }
  };

  const runPasskeyAuth = async (tk: string, email: string) => {
    setPasskeyLoading(true);
    setPasskeyError("");
    try {
      const { options } = await passkeyAuthOptions(tk);
      const credential = await startAuthentication({ optionsJSON: options as any });
      const tokenRes = await passkeyAuthVerify(tk, credential);
      finishWithToken(tokenRes.auth_data, !!tokenRes.is_admin, email);
    } catch (e: any) {
      const msg = friendlyPasskeyError(e);
      setPasskeyError(msg);
    } finally {
      setPasskeyLoading(false);
    }
  };

  const runSetup = async () => {
    if (!ticket) return;
    setPasskeyLoading(true);
    setPasskeyError("");
    try {
      const options = await passkeySetupOptions(ticket);
      const credential = await startRegistration({ optionsJSON: options as any });
      const { ticket: newTicket } = await passkeySetupVerify(ticket, credential);
      setTicket(newTicket);
      setStep("passkey");
      await runPasskeyAuth(newTicket, loginEmail);
    } catch (e: any) {
      setPasskeyError(friendlyPasskeyError(e));
    } finally {
      setPasskeyLoading(false);
    }
  };

  const friendlyPasskeyError = (e: any): string => {
    const name = e?.name || "";
    if (name === "NotAllowedError") return t("auth.signIn.passkey.cancelled");
    if (name === "NotSupportedError" || name === "SecurityError")
      return t("auth.signIn.passkey.unsupported");
    if (e?.message && typeof e.message === "string" && !e.message.startsWith("HTTP")) return e.message;
    return t("auth.signIn.passkey.failed");
  };

  const backToPassword = () => {
    setStep("password");
    setTicket("");
    setPasskeyError("");
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

      <div ref={cardRef} className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-xl md:grid-cols-2">
        {/* 左侧品牌区 */}
        <div
          data-anim="login-brand"
          className="sidebar-dark relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground md:flex"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sidebar-accent ring-1 ring-sidebar-border">
              {logo ? (
                <img src={logo} alt="logo" className="h-8 w-8 object-contain" />
              ) : (
                <Cloud className="h-7 w-7" />
              )}
            </div>
            <div>
              <div className="text-xl font-semibold tracking-tight">{siteName}</div>
              <div className="text-sm text-sidebar-foreground/60">Admin Console</div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold leading-tight">
              {t("auth.signIn.title")}
            </h1>
            <p className="text-sm leading-relaxed text-sidebar-foreground/60">
              {t("auth.signIn.description")}
            </p>
          </div>

          <div className="text-xs text-sidebar-foreground/40">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </div>
        </div>

        {/* 右侧表单区 */}
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <div data-anim="login-form" className="mx-auto w-full max-w-sm">
            <div className="mb-8 md:hidden">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Cloud className="h-6 w-6" />
                </div>
                <span className="text-lg font-semibold">{siteName}</span>
              </div>
            </div>

            {step === "password" && (
              <>
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
              </>
            )}

            {step === "passkey" && (
              <div className="space-y-5">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Fingerprint className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {t("auth.signIn.passkey.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("auth.signIn.passkey.description", { email: loginEmail })}
                  </p>
                </div>

                <div className="flex items-start gap-2 rounded-lg border bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
                  <Smartphone className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{t("auth.signIn.passkey.hybridHint")}</span>
                </div>

                {passkeyError && (
                  <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                    {passkeyError}
                  </p>
                )}

                <Button
                  className="w-full"
                  disabled={passkeyLoading}
                  onClick={() => runPasskeyAuth(ticket, loginEmail)}
                >
                  {passkeyLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <ShieldCheck className="h-4 w-4" />
                  {t("auth.signIn.passkey.verify")}
                </Button>
                <Button variant="ghost" className="w-full" onClick={backToPassword}>
                  <ArrowLeft className="h-4 w-4" />
                  {t("auth.signIn.passkey.back")}
                </Button>
              </div>
            )}

            {step === "setup" && (
              <div className="space-y-5">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Fingerprint className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {t("auth.signIn.passkey.setupTitle")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("auth.signIn.passkey.setupDescription")}
                  </p>
                </div>

                <div className="flex items-start gap-2 rounded-lg border bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
                  <Smartphone className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{t("auth.signIn.passkey.setupHint")}</span>
                </div>

                {passkeyError && (
                  <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                    {passkeyError}
                  </p>
                )}

                <Button className="w-full" disabled={passkeyLoading} onClick={runSetup}>
                  {passkeyLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t("auth.signIn.passkey.setupSubmit")}
                </Button>
                <Button variant="ghost" className="w-full" onClick={backToPassword}>
                  <ArrowLeft className="h-4 w-4" />
                  {t("auth.signIn.passkey.back")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 忘记密码弹窗：展示重置命令 */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
            <DialogTitle>{t("auth.signIn.resetPassword.title")}</DialogTitle>
            <DialogDescription>
              {t("auth.signIn.resetPassword.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4">
            <pre className="overflow-x-auto rounded-md border bg-muted p-3 text-xs">
              <code>{t("auth.signIn.resetPassword.command")}</code>
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
