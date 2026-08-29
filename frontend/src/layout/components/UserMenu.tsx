import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { useLocale } from "@/i18n/LocaleContext";
import { displayBadgeAward } from "@/shared/badgeAward";

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!user) return null;

  const initials = user.name.slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 max-w-[16rem] min-w-0 rounded-2xl hover:bg-slate-50 py-1 pl-1 pr-2 transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center shrink-0 ring-2 ring-emerald-200">
          {initials}
        </div>
        <div className="min-w-0 text-left hidden sm:block">
          <p className="font-bold text-slate-900 text-sm leading-tight truncate">{user.name}</p>
          <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
            {displayBadgeAward(user)} · {t("menu.points", { points: user.points })}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg z-50"
        >
          <div className="px-3 py-2.5 border-b border-slate-100 mb-1.5">
            <p className="font-bold text-slate-900 text-sm truncate">{user.name}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {t(`menu.role.${user.role}`)} · {t("menu.points", { points: user.points })}
            </p>
            <span className="mt-1.5 inline-flex items-center rounded-full bg-lima-100 text-emerald-800 border border-lima-200 px-2 py-0.5 text-[10px] font-bold">
              {displayBadgeAward(user)}
            </span>
          </div>
          <Link
            to="/settings"
            role="menuitem"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            {t("menu.settings")}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout();
              navigate("/", { replace: true });
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-700 hover:bg-rose-50"
          >
            <LogOut className="w-4 h-4" />
            {t("menu.signOut")}
          </button>
        </div>
      )}
    </div>
  );
};
