import { motion } from "framer-motion";
import { MagnifyingGlass, Lightning, MusicNotes, Check } from "@phosphor-icons/react";
import { CREATORS, VIDEOS, EXPLORE_TAGS } from "../constants";
import type { Video } from "../types";

interface ExploreViewProps {
  tag: string;
  onTagChange: (t: string) => void;
  followingSet: Set<string>;
  onToggleFollow: (creatorId: string) => void;
  onOpenVideo: (v: Video) => void;
}

export function ExploreView({ tag, onTagChange, followingSet, onToggleFollow, onOpenVideo }: ExploreViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="h-full w-full overflow-y-auto pb-24 pt-16 md:pt-20"
    >
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Discover</h1>
        <p className="mt-1 text-sm text-white/50">
          Trending hashtags, sounds and creators — hand-picked for the dark side of the feed.
        </p>

        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-[#FF1744]/50">
          <MagnifyingGlass size={17} className="text-white/40" />
          <input
            placeholder="Search videos, sounds, creators…"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {EXPLORE_TAGS.map((t) => (
            <button
              key={t}
              onClick={() => onTagChange(t)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                tag === t
                  ? "border-[#FF1744] bg-[#FF1744]/15 text-[#FF2D5E] shadow-[0_0_14px_rgba(255,23,68,0.35)]"
                  : "border-white/10 bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#FF1744]/20 via-[#2a0510] to-black p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FF2D5E]">Trending</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight">{tag}</h2>
          <div className="mt-3 flex items-center gap-4 text-xs font-bold text-white/60">
            <span className="flex items-center gap-1">
              <Lightning size={13} className="text-[#FFD166]" weight="fill" /> 12.4M views
            </span>
            <span className="flex items-center gap-1">
              <MusicNotes size={13} className="text-[#FF2D5E]" /> 8.2K videos
            </span>
          </div>
        </div>

        <h3 className="mt-8 text-sm font-extrabold uppercase tracking-wider text-white/40">Sounds</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((v) => (
            <button
              key={v.id}
              onClick={() => onOpenVideo(v)}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition-all hover:border-[#FF1744]/40 active:scale-[0.98]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF1744] to-[#7a0012] text-white">♪</span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-extrabold">{v.sound}</span>
                <span className="block truncate text-[11px] text-white/45">{v.views.toLocaleString()} videos</span>
              </span>
              <span className="ml-auto text-white/30 transition-all group-hover:text-[#FF2D5E]">›</span>
            </button>
          ))}
        </div>

        <h3 className="mt-8 text-sm font-extrabold uppercase tracking-wider text-white/40">Creators to follow</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {CREATORS.slice(0, 6).map((c) => {
            const followed = followingSet.has(c.id);
            return (
              <div key={c.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF1744] to-[#7a0012] text-sm font-black text-white">
                    {c.avatar}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 truncate text-sm font-extrabold">
                      {c.name}
                      {c.verified && (
                        <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#FF1744]">
                          <Check size={9} weight="bold" />
                        </span>
                      )}
                    </p>
                    <p className="truncate text-[11px] text-white/45">
                      {c.handle} · {formatCompact(c.followers)} followers
                    </p>
                  </div>
                  <button
                    onClick={() => onToggleFollow(c.id)}
                    className={`ml-auto shrink-0 rounded-full px-3 py-1.5 text-[11px] font-extrabold transition-all active:scale-95 ${
                      followed
                        ? "border border-white/20 bg-white/10 text-white/70"
                        : "bg-[#FF1744] text-white shadow-[0_0_12px_rgba(255,23,68,0.5)]"
                    }`}
                  >
                    {followed ? "✓" : "Follow"}
                  </button>
                </div>
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-white/55">{c.bio}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function formatCompact(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}