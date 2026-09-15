import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Gear,
  VideoCamera,
  Eye,
  TrendUp,
  Star,
  Lock,
  Envelope,
  Key,
  Coins,
  Check,
  SignOut,
  Plus,
  Gift,
} from "@phosphor-icons/react";
import type { Creator, UserProfile } from "../types";

interface ProfileViewProps {
  profile: UserProfile;
  creator: Creator;
  onBack: () => void;
  onFollowToggle: () => void;
  onLogout: () => void;
  onOpenAuth: () => void;
  onGiftCreator: () => void;
  giftsGiven: number;
}

export function ProfileView({
  profile,
  creator,
  onBack,
  onFollowToggle,
  onLogout,
  onOpenAuth,
  onGiftCreator,
  giftsGiven,
}: ProfileViewProps) {
  const [followed, setFollowed] = useState(creator.isFollowing);

  const toggleFollow = () => {
    const next = !followed;
    setFollowed(next);
    onFollowToggle();
  };

  const isGuest = profile.handle === "@guest";

  const stats = [
    { label: "Followers", value: formatNum(followed ? creator.followers + 1 : creator.followers), icon: TrendUp },
    { label: "Following", value: formatNum(creator.following), icon: Eye },
    { label: "Gifts", value: formatNum(creator.giftsReceived + giftsGiven), icon: Gift },
    { label: "Coins", value: formatNum(creator.coinsEarned), icon: Coins },
  ];

  return (
    <div className="min-h-screen bg-[#050507] pb-24 text-white md:pb-8">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-black/70 px-4 backdrop-blur-xl md:h-16 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all active:scale-90"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-base font-extrabold tracking-tight">Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-[#FFD166]/30 bg-[#FFD166]/10 px-3 py-1.5 font-mono text-xs font-bold text-[#FFD166]">
            <Coins size={13} weight="fill" />
            {profile.coins.toLocaleString()}
          </span>
          <button
            onClick={onOpenAuth}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all active:scale-90"
            aria-label="Settings"
          >
            <Gear size={16} />
          </button>
        </div>
      </header>

      {/* Hero band */}
      <div className="pt-14 md:pt-16">
        <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-[#FF1744]/40 via-[#3a0510] to-black md:h-56">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,23,68,0.35),transparent_55%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 md:px-6">
          {/* Avatar overlapping band */}
          <div className="-mt-12 flex items-end justify-between md:-mt-16">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-black bg-gradient-to-br from-[#FF1744] to-[#7a0012] text-3xl font-black text-white shadow-[0_10px_40px_rgba(255,23,68,0.45)] md:h-32 md:w-32 md:rounded-[2rem] md:text-4xl"
            >
              {profile.avatar}
            </motion.div>
            <div className="flex gap-2 pb-2">
              <button
                onClick={onGiftCreator}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-extrabold text-white transition-all active:scale-95"
              >
                <Gift size={14} className="text-[#FF2D5E]" weight="fill" />
                <span className="hidden sm:inline">Send Gift</span>
                <span className="sm:hidden">Gift</span>
              </button>
              {isGuest ? (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 rounded-full bg-[#FF1744] px-4 py-2 text-xs font-extrabold text-white shadow-[0_0_16px_rgba(255,23,68,0.5)] transition-all active:scale-95"
                >
                  <Key size={14} weight="fill" />
                  Sign In
                </button>
              ) : (
                <button
                  onClick={toggleFollow}
                  className={`rounded-full px-4 py-2 text-xs font-extrabold transition-all active:scale-95 ${
                    followed
                      ? "border border-white/20 bg-white/10 text-white/80"
                      : "bg-[#FF1744] text-white shadow-[0_0_16px_rgba(255,23,68,0.5)]"
                  }`}
                >
                  {followed ? "Following ✓" : "Follow"}
                </button>
              )}
            </div>
          </div>

          {/* Identity */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight">{creator.name}</h2>
              {creator.verified && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF1744]">
                  <Check size={11} weight="bold" className="text-white" />
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm font-bold text-white/50">{creator.handle}</p>
            <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-white/75">{creator.bio}</p>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-4 gap-2">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                whileTap={{ scale: 0.96 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center"
              >
                <s.icon size={16} className="mx-auto mb-1 text-[#FF2D5E]" weight="fill" />
                <p className="font-mono text-sm font-extrabold leading-none">{s.value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/40">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Video tabs */}
          <div className="mt-8 flex items-center gap-1 border-b border-white/10">
            {["Video", "Liked", "Saved"].map((tab) => {
              const active = tab === "Video";
              return (
                <button
                  key={tab}
                  className={`relative px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all ${
                    active ? "text-white" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {tab}
                  {active && (
                    <motion.span layoutId="prof-tab" className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#FF1744] shadow-[0_0_8px_rgba(255,23,68,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Empty grid placeholder (MVP) */}
          <div className="grid grid-cols-3 gap-1 pt-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <VideoCamera size={18} className="text-white/15" />
                </div>
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] font-bold text-white/80">
                  <Eye size={10} className="text-white/60" />
                  {(i * 37 + 92).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[11px] font-bold text-white/30">
            Grid preview — full upload pipeline lands in the next update
          </p>

          {/* Account settings card */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03]">
            <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-all active:bg-white/5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/70">
                <Envelope size={16} />
              </span>
              <span className="flex-1 text-[13px] font-bold text-white/80">Email &amp; notifications</span>
              <span className="text-white/30">›</span>
            </button>
            <button className="flex w-full items-center gap-3 border-t border-white/5 px-4 py-3.5 text-left transition-all active:bg-white/5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/70">
                <Lock size={16} />
              </span>
              <span className="flex-1 text-[13px] font-bold text-white/80">Privacy &amp; security</span>
              <span className="text-white/30">›</span>
            </button>
            <button className="flex w-full items-center gap-3 border-t border-white/5 px-4 py-3.5 text-left transition-all active:bg-white/5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/70">
                <Star size={16} />
              </span>
              <span className="flex-1 text-[13px] font-bold text-white/80">Earnings &amp; redemptions</span>
              <span className="text-white/30">›</span>
            </button>
            {!isGuest && (
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 border-t border-white/5 px-4 py-3.5 text-left text-[#FF2D5E] transition-all active:bg-white/5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF1744]/10">
                  <SignOut size={16} weight="bold" />
                </span>
                <span className="flex-1 text-[13px] font-bold">Log out of {profile.handle}</span>
                <span className="text-white/30">›</span>
              </button>
            )}
          </div>

          <button
            onClick={onOpenAuth}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 py-3 text-xs font-extrabold uppercase tracking-wider text-white/40 transition-all active:bg-white/5"
          >
            <Plus size={14} />
            Switch account
          </button>
        </div>
      </div>
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}