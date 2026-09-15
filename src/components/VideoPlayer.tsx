import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartStraight,
  ChatCircle,
  BookmarkSimple,
  ShareNetwork,
  Gift,
  Play,
  Pause,
  SpeakerHigh,
  SpeakerX,
  MusicNote,
  ArrowUp,
  Check,
} from "@phosphor-icons/react";
import type { Video } from "../types";
import { SPEED_OPTIONS } from "../constants";

interface VideoPlayerProps {
  video: Video;
  active: boolean;
  muted: boolean;
  onToggleMute: () => void;
  speed: number;
  onSpeedChange: (s: number) => void;
  liked: boolean;
  onToggleLike: () => void;
  saved: boolean;
  onToggleSave: () => void;
  likesCount: number;
  onOpenComments: () => void;
  onOpenGifts: () => void;
  onShare: () => void;
  onFollowToggle: () => void;
  isFollowing: boolean;
  handle: string;
  avatar: string;
  verified: boolean;
  soundName: string;
  onDoubleTapLike: () => void;
  onEnded: () => void;
}

export function VideoPlayer({
  video,
  active,
  muted,
  onToggleMute,
  speed,
  onSpeedChange,
  liked,
  onToggleLike,
  saved,
  onToggleSave,
  likesCount,
  onOpenComments,
  onOpenGifts,
  onShare,
  onFollowToggle,
  isFollowing,
  handle,
  avatar,
  verified,
  soundName,
  onDoubleTapLike,
  onEnded,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [heartBursts, setHeartBursts] = useState<number[]>([]);
  const [showSpeed, setShowSpeed] = useState(false);
  const [scrolledUp, setScrolledUp] = useState(false);
  const tapTimer = useRef<number | null>(null);
  const lastTap = useRef(0);

  // Play/pause on active change
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [active]);

  // Keep muted setting in sync
  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = muted;
  }, [muted, active]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.playbackRate = speed;
  }, [speed]);

  const handleTime = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  }, []);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 260 && tapTimer.current !== null) {
      window.clearTimeout(tapTimer.current);
      lastTap.current = 0;
      onDoubleTapLike();
      const id = Date.now() + Math.random();
      setHeartBursts((prev) => [...prev.slice(-4), id]);
      window.setTimeout(() => setHeartBursts((prev) => prev.filter((h) => h !== id)), 1400);
      return;
    }
    lastTap.current = now;
    tapTimer.current = window.setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) {
        v.play().catch(() => {});
        setPlaying(true);
      } else {
        v.pause();
        setPlaying(false);
      }
    }, 260);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const pct = Number(e.target.value);
    v.currentTime = (pct / 100) * v.duration;
    setProgress(pct);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={video.url}
        poster={video.poster}
        loop
        muted={muted}
        preload="metadata"
        playsInline
        autoPlay={active}
        onClick={handleTap}
        onTimeUpdate={handleTime}
        onEnded={onEnded}
        className="h-full w-full object-cover"
      />

      {/* Vertical gradient scrims */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

      {/* Center play indicator */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            key="play-ind"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-black/45 backdrop-blur-md">
              <Play size={34} weight="fill" className="ml-1 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Double-tap heart bursts */}
      <AnimatePresence>
        {heartBursts.map((id) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.2, 1.35, 1.1, 1.6], y: [0, -40, -90, -150] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, times: [0, 0.3, 0.6, 1] }}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <HeartStraight size={96} weight="fill" className="text-[#FF1744] drop-shadow-[0_0_24px_rgba(255,23,68,0.8)]" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Scrolled-to-top chip */}
      <AnimatePresence>
        {scrolledUp && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={() => setScrolledUp(false)}
            className="absolute left-1/2 top-16 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs font-bold text-white backdrop-blur-xl"
          >
            <ArrowUp size={13} />
            You are up to date
          </motion.button>
        )}
      </AnimatePresence>

      {/* Left rail: creator + caption */}
      <div className="absolute bottom-20 left-3 z-20 max-w-[70%] sm:bottom-24 sm:left-5 md:left-8">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-extrabold text-white">{handle}</span>
          {verified && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF1744]">
              <Check size={10} weight="bold" className="text-white" />
            </span>
          )}
          <button
            onClick={onFollowToggle}
            className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold tracking-wide transition-all active:scale-90 ${
              isFollowing
                ? "border-white/20 bg-white/10 text-white/80"
                : "border-[#FF1744] bg-[#FF1744] text-white shadow-[0_0_12px_rgba(255,23,68,0.5)]"
            }`}
          >
            {isFollowing ? "FOLLOWING" : "FOLLOW"}
          </button>
        </div>
        <p className="mt-1.5 text-[13px] font-medium leading-snug text-white/95 drop-shadow">
          {video.caption}{" "}
          <span className="font-bold text-white/80">{video.hashtags.join(" ")}</span>
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-white/80">
          <MusicNote size={13} className="text-[#FF2D5E]" />
          <span className="max-w-[240px] truncate">{soundName}</span>
        </div>
      </div>

      {/* Right action rail */}
      <div className="absolute bottom-20 right-2 z-20 flex flex-col items-center gap-4 sm:bottom-24 sm:right-4 md:right-8">
        <button
          onClick={onFollowToggle}
          className="flex flex-col items-center gap-1"
          aria-label="Follow creator"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#FF1744] to-[#7a0012] text-sm font-black text-white ring-2 ring-white/25 transition-all active:scale-90">
            {avatar}
          </span>
          {!isFollowing && (
            <span className="mt-[-8px] flex h-5 w-5 items-center justify-center rounded-full bg-[#FF1744] shadow-[0_0_10px_rgba(255,23,68,0.8)]">
              <PlusIcon size={12} weight="bold" className="text-white" />
            </span>
          )}
        </button>

        <ActionButton
          icon={<HeartStraight size={30} weight={liked ? "fill" : "regular"} className={liked ? "text-[#FF1744]" : "text-white"} />}
          label={formatCount(likesCount)}
          onClick={onToggleLike}
        />
        <ActionButton
          icon={<ChatCircle size={30} weight="regular" className="text-white" />}
          label={formatCount(video.comments.length + 120)}
          onClick={onOpenComments}
        />
        <ActionButton
          icon={<Gift size={30} weight="regular" className="text-[#FF2D5E]" />}
          label="Gift"
          onClick={onOpenGifts}
        />
        <ActionButton
          icon={<BookmarkSimple size={30} weight={saved ? "fill" : "regular"} className={saved ? "text-[#FFD166]" : "text-white"} />}
          label={formatCount(video.saves)}
          onClick={onToggleSave}
        />
        <ActionButton
          icon={<ShareNetwork size={30} weight="regular" className="text-white" />}
          label={formatCount(video.shares)}
          onClick={onShare}
        />

        {/* Speed selector */}
        <div className="relative">
          <button
            onClick={() => setShowSpeed((s) => !s)}
            className="flex flex-col items-center gap-1 rounded-full px-2 py-1 font-mono text-[11px] font-bold text-white transition-all active:scale-90"
            aria-label="Playback speed"
          >
            <span className="rounded-md border border-white/25 bg-black/50 px-1.5 py-0.5 backdrop-blur-sm">
              {speed}x
            </span>
          </button>
          <AnimatePresence>
            {showSpeed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 8 }}
                className="absolute bottom-12 right-0 z-30 flex flex-col gap-1 rounded-xl border border-white/15 bg-black/85 p-1.5 backdrop-blur-2xl"
              >
                {SPEED_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onSpeedChange(s);
                      setShowSpeed(false);
                    }}
                    className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all active:scale-95 ${
                      s === speed
                        ? "bg-[#FF1744] text-white shadow-[0_0_12px_rgba(255,23,68,0.6)]"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mute toggle */}
      <button
        onClick={onToggleMute}
        className="absolute right-3 top-16 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md transition-all active:scale-90 sm:right-4 md:right-8"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <SpeakerX size={18} /> : <SpeakerHigh size={18} />}
      </button>

      {/* Progress bar with scrub */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-3 pb-2 sm:pb-3" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
        <div className="relative h-1 w-full">
          <div className="absolute inset-0 rounded-full bg-white/25" />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[#FF1744] shadow-[0_0_10px_rgba(255,23,68,0.8)]"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={handleSeek}
            aria-label="Seek"
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          />
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 text-white drop-shadow-lg transition-all active:scale-90" aria-label={label}>
      <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">{icon}</span>
      <span className="text-[11px] font-bold">{label}</span>
    </button>
  );
}

// Local alias to avoid importing Plus for a single tiny icon
import { Plus as PlusIcon } from "@phosphor-icons/react";

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}