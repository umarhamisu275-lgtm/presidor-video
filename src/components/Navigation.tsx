import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Compass,
  Broadcast,
  Plus,
  User,
  Coins,
  Sparkle,
  MagnifyingGlass,
  SignOut,
} from "@phosphor-icons/react";
import type { FeedTab } from "../types";
import { BRAND_NAME } from "../constants";

interface NavProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
  coins: number;
  autoScroll: boolean;
  onAutoScrollToggle: () => void;
  onOpenLive: () => void;
  onUpload: () => void;
  onOpenAuth: () => void;
  onProfileClick: () => void;
  currentUserHandle: string;
}

export function Navigation({
  activeTab,
  onTabChange,
  coins,
  autoScroll,
  onAutoScrollToggle,
  onOpenLive,
  onUpload,
  onOpenAuth,
  onProfileClick,
  currentUserHandle,
}: NavProps) {
  const dock = [
    { key: "feed" as FeedTab, icon: Play, label: "For You" },
    { key: "explore" as FeedTab, icon: Compass, label: "Discover" },
    { key: "live" as FeedTab, icon: Broadcast, label: "Live" },
    { key: "profile" as FeedTab, icon: User, label: "You" },
  ];

  return (
    <>
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between px-4 pt-safe sm:px-6 md:h-16">
        <button
          onClick={() => onTabChange("feed")}
          className="flex items-center gap-2"
          aria-label="Crimson home"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF1744] font-mono text-sm font-black text-white shadow-[0_0_18px_rgba(255,23,68,0.6)]">
            C
          </span>
          <span className="hidden text-base font-extrabold tracking-tight text-white sm:block">
            {BRAND_NAME}
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Auto scroll toggle */}
          <button
            onClick={onAutoScrollToggle}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-wide transition-all active:scale-95 ${
              autoScroll
                ? "border-[#FF1744]/60 bg-[#FF1744]/15 text-[#FF2D5E] shadow-[0_0_14px_rgba(255,23,68,0.35)]"
                : "border-white/15 bg-white/5 text-white/70"
            }`}
            aria-pressed={autoScroll}
          >
            <Sparkle weight={autoScroll ? "fill" : "regular"} size={14} />
            <span className="hidden sm:inline">AUTO</span>
            <span className="sm:hidden">AUTO</span>
          </button>

          {/* Wallet */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 font-mono text-xs text-white backdrop-blur-xl transition-all active:scale-95"
          >
            <Coins size={14} className="text-[#FFD166]" weight="fill" />
            <span className="tabular-nums font-bold text-[#FFD166]">{coins.toLocaleString()}</span>
          </button>

          {/* Live CTA */}
          <button
            onClick={onOpenLive}
            className="flex items-center gap-1.5 rounded-full bg-[#FF1744] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-[0_0_16px_rgba(255,23,68,0.5)] transition-all hover:bg-[#FF2D5E] active:scale-95 sm:px-4"
          >
            <Broadcast size={13} weight="fill" />
            <span className="hidden sm:inline">Live</span>
          </button>

          {/* Search (desktop) */}
          <button
            onClick={() => onTabChange("explore")}
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all hover:bg-white/10 active:scale-95 md:flex"
            aria-label="Discover"
          >
            <MagnifyingGlass size={16} />
          </button>

          {/* Auth / profile avatar */}
          <button
            onClick={currentUserHandle === "@guest" ? onOpenAuth : onProfileClick}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FF1744] to-[#8B0016] text-[11px] font-black text-white ring-2 ring-white/20 transition-all active:scale-95 sm:h-9 sm:w-9"
            aria-label="Account"
          >
            {currentUserHandle === "@guest" ? <SignOut size={15} /> : currentUserHandle.slice(1, 3).toUpperCase()}
          </button>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-20 flex-col items-center gap-2 border-r border-white/10 bg-black/70 py-24 backdrop-blur-xl md:flex lg:w-24">
        {dock.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`group relative flex w-full flex-col items-center gap-1 py-2.5 transition-all active:scale-95 ${
                active ? "text-[#FF1744]" : "text-white/55 hover:text-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#FF1744] shadow-[0_0_12px_rgba(255,23,68,0.9)]"
                />
              )}
              <Icon size={22} weight={active ? "fill" : "regular"} />
              <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
            </button>
          );
        })}
        <div className="mt-auto mb-4">
          <button
            onClick={onUpload}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[#FF1744]/50 hover:text-[#FF2D5E] active:scale-95"
            aria-label="Upload video"
          >
            <Plus size={20} weight="bold" />
          </button>
        </div>
      </aside>

      {/* Mobile bottom dock + upload FAB */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-end justify-around border-t border-white/10 bg-black/80 pb-2 backdrop-blur-2xl md:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        {dock.slice(0, 2).map((item) => (
          <DockButton key={item.key} item={item} active={activeTab === item.key} onClick={() => onTabChange(item.key)} />
        ))}
        <button
          onClick={onUpload}
          className="-mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF1744] text-white shadow-[0_8px_28px_rgba(255,23,68,0.55)] transition-all active:scale-90"
          aria-label="Upload"
        >
          <Plus size={26} weight="bold" />
        </button>
        {dock.slice(2).map((item) => (
          <DockButton key={item.key} item={item} active={activeTab === item.key} onClick={() => onTabChange(item.key)} />
        ))}
      </nav>
    </>
  );
}

function DockButton({
  item,
  active,
  onClick,
}: {
  item: { key: FeedTab; icon: typeof Play; label: string };
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`flex w-16 flex-col items-center gap-0.5 py-1 transition-all active:scale-90 ${
        active ? "text-[#FF1744]" : "text-white/55"
      }`}
    >
      <Icon size={22} weight={active ? "fill" : "regular"} />
      <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
    </button>
  );
}