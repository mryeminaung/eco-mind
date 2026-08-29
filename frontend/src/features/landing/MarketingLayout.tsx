import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogIn, UserPlus, ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { Footer } from "@/layout/components/Footer";
import { LanguageToggle } from "@/layout/components/LanguageToggle";
import { roleHomePath, useAuth } from "@/features/auth/AuthContext";
import { useLocale } from "@/i18n/LocaleContext";
import { cn } from "@/shared/utils";

export const MarketingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { t } = useLocale();
  const location = useLocation();
  const appPath = roleHomePath(user?.role);
  const nextPath = (location.state as { from?: string } | null)?.from;
  const returnTo =
    nextPath ||
    (location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/register"
      ? location.pathname
      : undefined);
  const authState = returnTo ? { from: returnTo } : undefined;
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-lima-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header
          className={cn(
            "sticky top-4 z-40 mt-4 mb-5 transition-all duration-200",
            headerScrolled
              ? "bg-white/95 backdrop-blur-md shadow-[0_8px_24px_-12px_rgba(15,23,42,0.28)] rounded-2xl"
              : "bg-transparent",
          )}
        >
          <div className="flex h-16 items-center justify-between gap-4 px-3 sm:px-4">
            <Link to="/" className="flex items-center">
              <BrandLogo size="md" />
            </Link>

            <div className="flex items-center gap-2.5">
              <LanguageToggle />
              {user ? (
                <Link to={appPath}>
                  <Button variant="eco" className="h-10 px-4 gap-2 font-semibold">
                    {t("auth.openApp")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" state={authState}>
                    <Button variant="outline" className="h-10 px-4 gap-2 font-semibold">
                      <LogIn className="w-4 h-4" />
                      {t("auth.login")}
                    </Button>
                  </Link>
                  <Link to="/register" state={authState}>
                    <Button variant="eco" className="h-10 px-4 gap-2 font-semibold">
                      <UserPlus className="w-4 h-4" />
                      {t("auth.register")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};
