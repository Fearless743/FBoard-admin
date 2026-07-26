import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Languages,
  Search,
  Menu,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useSettingsStore } from "@/store/settings";
import { supportedLngs } from "@/locales";
import { adminPath } from "@/lib/paths";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useEffect, useState } from "react";
import { flatNav } from "@/lib/navigation";

const languageLabels: Record<string, string> = {
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  "en-US": "English",
  "ru-RU": "Русский",
};

export function Header({ onMobileMenu }: { onMobileMenu: () => void }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const [searchOpen, setSearchOpen] = useState(false);

  // ⌘K 打开搜索
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(adminPath("login"));
  };

  const initials = (user?.email || "A").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMobileMenu}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* 窄屏搜索入口（命令面板） */}
      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        onClick={() => setSearchOpen(true)}
        aria-label={t("search.placeholder")}
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* 搜索框（触发命令面板） */}
      <button
        onClick={() => setSearchOpen(true)}
        className="group hidden h-9 flex-1 max-w-sm items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground transition-colors hover:bg-accent sm:flex"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">{t("search.placeholder")}</span>
        <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
        {/* 语言切换 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title={t("common.theme.system")}>
              <Languages className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("common.settings")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {supportedLngs.map((lng) => (
              <DropdownMenuItem
                key={lng}
                disabled={language === lng}
                onClick={() => {
                  if (language === lng) return;
                  setLanguage(lng);
                  try {
                    localStorage.setItem("fboard-admin-lang", lng);
                  } catch {
                    /* ignore */
                  }
                  void i18n.changeLanguage(lng);
                }}
                className={language === lng ? "bg-accent" : ""}
              >
                {languageLabels[lng] || lng}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 主题切换 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title={t("common.theme.label")}>
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Monitor className="h-5 w-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="h-4 w-4" /> {t("common.theme.light")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="h-4 w-4" /> {t("common.theme.dark")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Monitor className="h-4 w-4" /> {t("common.theme.system")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">
                {user?.email || "admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.email}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {(user?.is_admin ? t("user.status.admin") : "") ||
                    (user?.is_staff ? t("user.status.staff") : "")}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> {t("common.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 命令面板 */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder={t("search.placeholder")} />
        <CommandList>
          <CommandEmpty>{t("search.noResults")}</CommandEmpty>
          <CommandGroup heading={t("search.title")}>
            {flatNav.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.path}
                  value={t(item.key)}
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate(adminPath(item.path));
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t(item.key)}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
