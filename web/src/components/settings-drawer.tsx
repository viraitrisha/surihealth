// src/components/settings-drawer.tsx
import { useState, useEffect } from "react";
import { authClient } from "../auth/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "#/hooks/use-toast";
import { useLanguage } from "../hooks/use-language";
import { useFontSize } from "./font-resize-toggle";
import { deleteUserAccountOnServer } from "../server-functions/auth";
import {
  X,
  Settings,
  Sun,
  Moon,
  Type,
  Languages,
  LogOut,
  User,
  Loader2,
  RotateCcw,
  Minus,
  Plus,
  ChevronRight,
  Shield,
  Bell,
  Trash2,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";

type SettingsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onThemeToggle: (theme: "light" | "dark") => void;
  currentTheme: "light" | "dark";
};

export function SettingsDrawer({
  isOpen,
  onClose,
  onOpenProfile,
  onThemeToggle,
  currentTheme,
}: SettingsDrawerProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const { fontSize, setFontSize } = useFontSize();

  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync HTML attribute for CSS variables
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.setAttribute("data-theme", currentTheme);
    }
  }, [currentTheme]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await authClient.signOut();
      toast({
        title: t("Succesvol uitgelogd", "Successfully logged out"),
        description: t(
          "Tot ziens bij SuriHealth!",
          "See you soon at SuriHealth!"
        ),
        type: "success",
      });
      onClose();
      navigate({ to: "/login" });
    } catch (err) {
      toast({
        title: t("Fout bij uitloggen", "Error logging out"),
        type: "error",
      });
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const result = await deleteUserAccountOnServer();
      if (result?.success) {
        localStorage.removeItem("surihealth_profile_cache");
        toast({
          title: t("Account verwijderd", "Account deleted"),
          description: t(
            "Uw gegevens zijn permanent gewist.",
            "Your data has been permanently wiped."
          ),
          type: "success",
        });
        onClose();
        if (typeof window !== "undefined") {
          window.location.href = "/register";
        }
      }
    } catch (err: any) {
      toast({
        title: t("Fout bij verwijderen", "Error deleting account"),
        description:
          err.message || t("Probeer het later opnieuw.", "Please try again later."),
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!isOpen) return null;

  // Style helpers (CSS variables)
  const primaryColor = "var(--primary-color)";
  const secondaryColor = "var(--secondary-color)";
  const accentColor = "var(--accent-color)";
  const bgColor = "var(--bg-color)";
  const textColor = "var(--text-color)";
  const borderColor = "var(--border-color)";
  const mutedBg = "var(--muted-bg)";
  const cardBg = "var(--card-bg)";
  const dangerBg = "var(--danger-bg)";
  const dangerText = "var(--danger-text)";
  const dangerBorder = "var(--danger-border)";

  return (
    <div className="fixed inset-0 z-[2000] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "var(--overlay-color)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className="relative w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        style={{ backgroundColor: cardBg, color: textColor }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ backgroundColor: mutedBg, borderColor }}
        >
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6" style={{ color: primaryColor }} />
            <h2 className="text-xl font-bold tracking-tight">
              {t("Instellingen", "Settings")}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t("Sluiten", "Close")}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition focus:outline-none cursor-pointer"
            style={{ color: textColor }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* 1. Profile quick link */}
          <div
            onClick={() => {
              onClose();
              navigate({ to: "/dashboard/profile" });
            }}
            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#1A756A]/8 to-[#2D9C8F]/8 border border-[#1A756A]/8 dark:border-[#2D9C8F]/10 cursor-pointer hover:opacity-90 transition-all"
          >
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-[#1A756A] dark:text-[#2D9C8F]" />
              <div>
                <div className="text-sm font-semibold text-[var(--text-color)]">
                  {t("Gezondheidsprofiel", "Health Profile")}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-400">
                  {t("Bekijk je medische gegevens", "View your medical data")}
                </div>
              </div>
            </div>
            <div className="p-2 rounded-lg">
              <ChevronRight className="h-5 w-5 text-[#1A756A] dark:text-[#2D9C8F]" />
            </div>
          </div>

          {/* 2. Theme toggle */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-50">
              {t("Weergave", "Appearance")}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onThemeToggle("light")}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition cursor-pointer focus:outline-none"
                style={{
                  backgroundColor:
                    currentTheme === "light" ? `${primaryColor}10` : cardBg,
                  borderColor: currentTheme === "light" ? primaryColor : borderColor,
                  color: currentTheme === "light" ? primaryColor : textColor,
                }}
              >
                <Sun className="h-4 w-4" /> {t("Licht", "Light")}
              </button>
              <button
                type="button"
                onClick={() => onThemeToggle("dark")}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition cursor-pointer focus:outline-none"
                style={{
                  backgroundColor:
                    currentTheme === "dark" ? `${secondaryColor}20` : cardBg,
                  borderColor: currentTheme === "dark" ? secondaryColor : borderColor,
                  color: currentTheme === "dark" ? textColor : textColor,
                }}
              >
                <Moon className="h-4 w-4" /> {t("Donker", "Dark")}
              </button>
            </div>
          </div>

          {/* 3. Language */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 flex items-center gap-2">
              <Languages className="h-4 w-4" style={{ color: primaryColor }} />
              {t("Taal", "Language")}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage("NL")}
                className="p-3 rounded-xl border text-sm font-bold transition cursor-pointer focus:outline-none"
                style={{
                  backgroundColor: language === "NL" ? `${primaryColor}10` : cardBg,
                  borderColor: language === "NL" ? primaryColor : borderColor,
                  color: language === "NL" ? primaryColor : textColor,
                }}
              >
                Nederlands
              </button>
              <button
                type="button"
                onClick={() => setLanguage("EN")}
                className="p-3 rounded-xl border text-sm font-bold transition cursor-pointer focus:outline-none"
                style={{
                  backgroundColor: language === "EN" ? `${secondaryColor}20` : cardBg,
                  borderColor: language === "EN" ? secondaryColor : borderColor,
                  color: language === "EN" ? secondaryColor : textColor,
                }}
              >
                English
              </button>
            </div>
          </div>

          {/* 4. Text size slider */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 flex items-center gap-2">
              <Type className="h-4 w-4" style={{ color: primaryColor }} />
              {t("Tekstgrootte", "Text Size")}
            </h4>
            <div
              className="flex items-center gap-4 p-4 rounded-xl border"
              style={{ backgroundColor: mutedBg, borderColor }}
            >
              <span className="text-sm font-bold min-w-[45px]">{fontSize}%</span>
              <div className="flex-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFontSize(Math.max(50, fontSize - 10))}
                  className="p-1.5 bg-white dark:bg-slate-800 border rounded-lg cursor-pointer focus:outline-none"
                  style={{ borderColor }}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="flex-1 h-1.5 rounded-full accent-[#1A756A] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setFontSize(Math.min(150, fontSize + 10))}
                  className="p-1.5 bg-white dark:bg-slate-800 border rounded-lg cursor-pointer focus:outline-none"
                  style={{ borderColor }}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setFontSize(100)}
                className="p-1.5 opacity-40 hover:opacity-100 transition focus:outline-none cursor-pointer"
                title={t("Herstellen", "Reset")}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 5. Notifications */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 flex items-center gap-2">
              <Bell className="h-4 w-4" style={{ color: primaryColor }} />
              {t("Notificaties", "Notifications")}
            </h4>
            <div
              className="flex items-center justify-between p-4 rounded-xl border"
              style={{ backgroundColor: mutedBg, borderColor }}
            >
              <span className="text-sm font-medium">
                {t("Push notificaties", "Push notifications")}
              </span>
              <button
                type="button"
                onClick={() => setPushEnabled(!pushEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  pushEnabled ? "bg-[#1A756A]" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pushEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 6. Feedback & support */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" style={{ color: primaryColor }} />
              {t("Feedback & Support", "Feedback & Support")}
            </h4>
            <a
              href="mailto:support@surihealth.com"
              className="flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition"
              style={{ backgroundColor: mutedBg, borderColor }}
            >
              <span className="text-sm font-medium">
                {t("Neem contact op", "Contact us")}
              </span>
              <ChevronRight className="h-5 w-5 opacity-40" />
            </a>
          </div>

          {/* 7. Danger zone - delete account */}
          <div className="pt-2 border-t space-y-2" style={{ borderColor }}>
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-950/10 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none border border-transparent hover:border-red-200"
              >
                <Trash2 className="h-4 w-4" />
                {t("Account Permanent Wissen", "Permanently Delete Account")}
              </button>
            ) : (
              <div
                className="p-4 rounded-xl space-y-3 border animate-in fade-in duration-200"
                style={{
                  backgroundColor: dangerBg,
                  borderColor: dangerBorder,
                  color: dangerText,
                }}
              >
                <p className="text-sm">
                  {t(
                    "Weet u het zeker? Dit wist permanent uw opgeslagen favorieten, medische condities en planners uit PostgreSQL.",
                    "Are you sure? This permanently deletes your favorites, medical conditions, and planners from PostgreSQL."
                  )}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={deleteLoading}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-1.5 bg-white dark:bg-slate-800 text-gray-500 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none"
                    style={{ borderColor }}
                  >
                    {t("Annuleren", "Cancel")}
                  </button>
                  <button
                    type="button"
                    disabled={deleteLoading}
                    onClick={handleDeleteAccount}
                    className="flex-1 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold border border-red-600 hover:bg-red-700 transition disabled:opacity-50 cursor-pointer focus:outline-none"
                  >
                    {deleteLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    ) : (
                      t("Ja, Wis Alles", "Yes, Wipe Data")
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 8. Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold bg-gray-100 dark:bg-slate-800 rounded-xl hover:opacity-90 transition disabled:opacity-60 cursor-pointer focus:outline-none"
            style={{ color: textColor }}
          >
            {logoutLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {t("Uitloggen", "Sign Out")}
          </button>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-center gap-2 px-6 py-4 text-xs opacity-40 border-t"
          style={{ borderColor }}
        >
          <Shield className="h-3 w-3" />
          {t("Je gegevens zijn veilig en versleuteld", "Your data is safe and encrypted")}
        </div>
      </aside>
    </div>
  );
}