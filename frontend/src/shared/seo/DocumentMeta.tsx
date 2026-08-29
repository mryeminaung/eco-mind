import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLocale } from "@/i18n/LocaleContext";

const IMAGE_PATH = "/eco-mind.png";
const JSON_LD_ID = "ecomind-jsonld";
const PRODUCTION_SITE_URL = "https://eco-mind-myanmar.vercel.app";

const PUBLIC_INDEX = new Set(["/", "/community", "/login", "/register", "/services", "/hubs"]);

function siteOrigin() {
  const fromEnv = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (import.meta.env.PROD) return PRODUCTION_SITE_URL;
  return window.location.origin;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function resolvePage(pathname: string, t: (key: string) => string) {
  const index = PUBLIC_INDEX.has(pathname);

  if (pathname === "/") {
    return { title: t("seo.homeTitle"), description: t("seo.homeDescription"), index };
  }
  if (pathname === "/community") {
    return { title: t("community.title"), description: t("community.lead"), index };
  }
  if (pathname === "/login") {
    return { title: t("auth.signInTitle"), description: t("auth.signInDesc"), index };
  }
  if (pathname === "/register") {
    return { title: t("auth.registerTitle"), description: t("auth.registerDesc"), index };
  }
  if (pathname === "/services") {
    return { title: t("page.services.title"), description: t("page.services.description"), index };
  }
  if (pathname === "/hubs") {
    return { title: t("page.hubs.title"), description: t("page.hubs.description"), index };
  }
  if (pathname.startsWith("/centers") || pathname.startsWith("/recycling-centers")) {
    return { title: t("page.centers.title"), description: t("page.centers.description"), index: false };
  }
  if (pathname === "/scan") {
    return { title: t("page.scan.title"), description: t("page.scan.description"), index: false };
  }
  if (pathname === "/dashboard") {
    return { title: t("page.overview.title"), description: t("seo.defaultDescription"), index: false };
  }
  if (pathname === "/rewards") {
    return { title: t("page.rewards.title"), description: t("page.rewards.description"), index: false };
  }
  if (pathname === "/overview") {
    return { title: t("page.adminOverview.title"), description: t("page.adminOverview.description"), index: false };
  }
  if (pathname === "/request-pickup" || pathname === "/requests") {
    return { title: t("page.pickup.title"), description: t("page.pickup.description"), index: false };
  }
  if (pathname === "/collector" || pathname === "/recycler-dashboard") {
    return { title: t("page.queue.title"), description: t("page.queue.description"), index: false };
  }
  if (pathname === "/admin/users") {
    return { title: t("page.users.title"), description: t("page.users.description"), index: false };
  }
  if (pathname === "/settings") {
    return { title: t("page.settings.title"), description: t("page.settings.description"), index: false };
  }

  return { title: t("seo.siteName"), description: t("seo.defaultDescription"), index: false };
}

function writeJsonLd(origin: string, description: string) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "EcoMind Myanmar",
        url: `${origin}/`,
        description,
        logo: `${origin}${IMAGE_PATH}`,
        areaServed: { "@type": "Country", name: "Myanmar" },
      },
      {
        "@type": "WebSite",
        name: "EcoMind Myanmar",
        url: `${origin}/`,
        inLanguage: ["en", "my"],
        description,
      },
      {
        "@type": "WebApplication",
        name: "EcoMind Myanmar",
        url: `${origin}/`,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "MMK" },
        description,
      },
    ],
  };

  let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = JSON_LD_ID;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(graph);
}

export function DocumentMeta() {
  const { pathname } = useLocation();
  const { t, locale } = useLocale();

  useEffect(() => {
    const { title, description, index } = resolvePage(pathname, t);
    const site = t("seo.siteName");
    const fullTitle = title.includes(site) ? title : `${title} · ${site}`;
    const origin = siteOrigin();
    const url = `${origin}${pathname === "/" ? "/" : pathname}`;
    const image = `${origin}${IMAGE_PATH}`;
    const robots = index ? "index, follow" : "noindex, nofollow";

    document.title = fullTitle;

    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", t("seo.keywords"));
    upsertMeta("name", "robots", robots);
    upsertMeta("name", "googlebot", robots);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:alt", t("seo.ogImageAlt"));
    upsertMeta("property", "og:locale", locale === "my" ? "my_MM" : "en_US");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
    upsertMeta("name", "twitter:image:alt", t("seo.ogImageAlt"));
    upsertLink("canonical", url);
    writeJsonLd(origin, t("seo.defaultDescription"));
  }, [pathname, locale, t]);

  return null;
}
