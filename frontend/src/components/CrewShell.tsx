"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";
import type { MessageKey } from "@/services/i18n";

export type CrewSection = "today" | "vitals" | "trends" | "plan" | "more" | "admin";

const quickNavigation = [
  { id: "today", label: "quickToday", href: "/", icon: "home" },
  { id: "vitals", label: "quickVitals", href: "/vitals", icon: "ecg_heart" },
  { id: "trends", label: "quickTrends", href: "/trends", icon: "show_chart" },
  { id: "plan", label: "quickPlan", href: "/plan", icon: "auto_awesome" },
] satisfies { id: CrewSection; label: MessageKey; href: string; icon: string }[];

const moreNavigation = [
  { label: "navMeasures", href: "/measures", icon: "monitoring" },
  { label: "navMirror", href: "/mirror", icon: "face" },
  { label: "adminAccess", href: "/admin", icon: "admin_panel_settings" },
] satisfies { label: MessageKey; href: string; icon: string }[];

const desktopNavigation = [
  { label: "quickToday", href: "/", icon: "home" },
  { label: "quickVitals", href: "/vitals", icon: "ecg_heart" },
  { label: "quickTrends", href: "/trends", icon: "show_chart" },
  { label: "quickPlan", href: "/plan", icon: "event_note" },
  { label: "navMeasures", href: "/measures", icon: "monitoring" },
  { label: "navMirror", href: "/mirror", icon: "face" },
  { label: "adminAccess", href: "/admin", icon: "admin_panel_settings" },
] satisfies { label: MessageKey; href: string; icon: string }[];

export function CrewShell({ active, children }: { active: CrewSection; children: ReactNode }) {
  const { locale, t } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLElement | null>(null);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dateLabel = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-ES", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(new Date("2026-11-14T13:30:00Z"));

  useEffect(() => {
    if (!menuOpen) return;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuTriggerRef.current?.focus();
        return;
      }
      if (event.key === "Tab") {
        const focusable = Array.from(drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  function openMenu(event: React.MouseEvent<HTMLButtonElement>) {
    menuTriggerRef.current = event.currentTarget;
    setMenuOpen(true);
  }

  function closeMenu() {
    setMenuOpen(false);
    menuTriggerRef.current?.focus();
  }

  return (
    <div className="app-shell">
      <aside className="crew-sidebar">
        <Link className="crew-sidebar-brand" href="/" aria-label={`FAVALORO SpaceHealth, ${t("quickToday")}`}>
          <span className="brand-symbol"><MaterialSymbol name="public" size={20} /></span>
          <span className="brand-wordmark"><strong>FAVALORO</strong><small>SPACEHEALTH</small></span>
        </Link>
        <p className="crew-sidebar-caption">{t("sidebarCaption")}</p>
        <nav className="crew-sidebar-nav" aria-label={t("sidebarCaption")}>
          {desktopNavigation.map((item) => (
            <Link
              className={`crew-sidebar-link ${pathname === item.href ? "crew-sidebar-link-active" : ""}`}
              href={item.href}
              key={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              <MaterialSymbol name={item.icon} size={19} />
              <span>{t(item.label)}</span>
            </Link>
          ))}
        </nav>
        <div className="crew-sidebar-note"><MaterialSymbol name="info" size={16} /><span>{t("demoMenuNote")}</span></div>
      </aside>
      <main className="main-content">
        <header className="app-topbar">
          <Link className="app-brand" href="/" aria-label={`FAVALORO SpaceHealth, ${t("quickToday")}`}>
            <span className="brand-symbol"><MaterialSymbol name="public" size={20} /></span>
            <span className="brand-wordmark"><strong>FAVALORO</strong><small>SPACEHEALTH</small></span>
          </Link>
          <div className="topline-actions">
            <LanguageSwitcher />
            <button
              className="menu-toggle"
              type="button"
              aria-label={t("openMenu")}
              aria-expanded={menuOpen}
              aria-controls="crew-more-menu"
              onClick={openMenu}
            >
              <MaterialSymbol name="menu" size={19} />
            </button>
          </div>
        </header>
        <div className="topline">
          <div className="telemetry-tag"><span className="telemetry-dot" /> {t("simulatedTelemetry")}</div>
        </div>
        {children}
        <footer className="page-footer">
          <span>FAVALORO SpaceHealth <span className="footer-separator">·</span> {t("demoDashboard")}</span>
          <span>{t("illustrativeReadings")}</span>
        </footer>
      </main>

      <div className={`drawer-shell ${menuOpen ? "drawer-shell-open" : ""}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        <button className="drawer-scrim" type="button" aria-label={t("closeMenu")} onClick={closeMenu} disabled={!menuOpen} tabIndex={-1} />
        <aside ref={drawerRef} className="more-drawer" id="crew-more-menu" role="dialog" aria-modal={menuOpen} aria-labelledby="crew-more-menu-title">
          <div className="drawer-header">
            <div>
              <p className="eyebrow">FAVALORO SPACEHEALTH</p>
              <h2 id="crew-more-menu-title">{t("moreMenuTitle")}</h2>
            </div>
            <button ref={closeButtonRef} className="drawer-close" type="button" aria-label={t("closeMenu")} onClick={closeMenu}>
              <MaterialSymbol name="close" size={19} />
            </button>
          </div>
          <p className="drawer-subtitle">{t("moreMenuSubtitle")}</p>
          <p className="drawer-section-label">{t("detailSections")}</p>
          <nav className="drawer-links" aria-label={t("moreMenuTitle")}>
            {moreNavigation.map((item) => {
              return (
                <Link className={`drawer-link ${item.href === "/admin" ? "drawer-link-admin" : ""}`} href={item.href} key={item.label} onClick={closeMenu}>
                  <MaterialSymbol name={item.icon} size={18} />
                  <span>{t(item.label)}</span>
                  <MaterialSymbol name="arrow_outward" size={14} />
                </Link>
              );
            })}
          </nav>
          <div className="drawer-demo-note">
            <MaterialSymbol name="info" size={17} />
            <span>{t("demoMenuNote")}</span>
          </div>
        </aside>
      </div>

      <nav className="quick-nav" aria-label={t("sidebarCaption")}>
        {quickNavigation.map((item) => {
          return (
            <Link
              className={`quick-nav-item ${active === item.id ? "quick-nav-item-active" : ""}`}
              href={item.href}
              key={item.id}
              aria-current={active === item.id ? "page" : undefined}
            >
              <MaterialSymbol name={item.icon} size={19} />
              <span>{t(item.label)}</span>
            </Link>
          );
        })}
        <button className={`quick-nav-item ${active === "more" || menuOpen ? "quick-nav-item-active" : ""}`} type="button" aria-label={t("quickMore")} aria-expanded={menuOpen} aria-controls="crew-more-menu" onClick={openMenu}>
          <MaterialSymbol name="menu" size={19} />
          <span>{t("quickMore")}</span>
        </button>
      </nav>
    </div>
  );
}
