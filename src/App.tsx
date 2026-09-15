import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkle,
  ArrowUp,
  ArrowDown,
  Broadcast,
} from "@phosphor-icons/react";
import { Navigation } from "./components/Navigation";
import { VideoPlayer } from "./components/VideoPlayer";
import { GiftDrawer } from "./components/GiftDrawer";
import { LiveStreamModal } from "./components/LiveStreamModal";
import { ProfileView } from "./components/ProfileView";
import { ExploreView } from "./components/ExploreView";
import { AuthModal } from "./components/AuthModal";
import { CommentsSheet } from "./components/CommentsSheet";
import {
  BRAND_NAME,
  CREATORS,
  VIDEOS,
  GIFTS,
  LIVE_ROOMS,
  EXPLORE_TAGS,
  GUEST_PROFILE,
  DEFAULT_MUTED,
} from "./constants";
import type { Creator, FeedTab, GiftDef, UserProfile } from "./types";

interface GiftEvent {
  giftId: string;
  recipient: string;
  coins: number;
}

export default function App() {
  const [tab, setTab] = useState<FeedTab>("feed");
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(DEFAULT_MUTED);
  const [speed, setSpeed] = useState(1);
  const [autoScroll, setAutoScroll] = useState(false);
  const [likedSet, setLikedSet] = useState<Set<string>>(new Set());
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set());
  const [giftsGiven, setGiftsGiven] = useState<Record<string, number>>({});
  const [profile, setProfile] = useState<UserProfile>(GUEST_PROFILE);
  const [authOpen, setAuthOpen] = useState(false);
  const [liveOpen, setLiveOpen] = useState(false);
  const [commentsFor, setCommentsFor] = useState<string | null>(null);
  const [giftFor, setGiftFor] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [exploreTag, setExploreTag] = useState<string>(EXPLORE_TAGS[0]);
  const [giftEvent, setGiftEvent] = useState<GiftEvent | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const video = VIDEOS[index];
  const creator = useMemo(
    () => CREATORS.find((c) => c.id === video.creatorId) as Creator,
    [video.creatorId],
  );
  const activeProfileCreator = useMemo(
    () => CREATORS.find((c) => c.handle === profile.handle) ?? CREATORS[0],
    [profile.handle],
  );

  const likeCount = useMemo(() => {
    const base = VIDEOS[index].likes;
    const bonus = likedSet.has(VIDEOS[index].id) ? 1 : 0;
    return base + bonus;
  }, [index, likedSet]);

  // Scrolling helpers
  const goNext = useCallback(
    (fromVideoId: string) => {
      const i = VIDEOS.findIndex((v) => v.id === fromVideoId);
      const next = i >= 0 ? i : index;
      setIndex(Math.min(VIDEOS.length - 1, next + 1));
    },
    [index],
  );

  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  // Wheel scroll (desktop)
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (tab !== "feed") return;
      const v = feedRef.current;
      if (!v) return;
      v.scrollTo({ top: e.deltaY > 0 ? v.scrollHeight : 0, behavior: "smooth" });
    },
    [tab],
  );

  const handleVideoEnded = useCallback(() => {
    if (autoScroll) goNext(video.id);
  }, [autoScroll, video.id, goNext]);

  // Auto-scroll interval
  useEffect(() => {
    if (!autoScroll || tab !== "feed") return;
    const t = window.setInterval(() => goNext(video.id), 5000);
    return () => window.clearInterval(t);
  }, [autoScroll, tab, video.id, goNext]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (authOpen || liveOpen || commentsFor || giftFor) return;
      switch (e.key) {
        case "ArrowDown":
        case "j":
          e.preventDefault();
          if (tab === "feed") goNext(video.id);
          break;
        case "ArrowUp":
        case "k":
          e.preventDefault();
          if (tab === "feed") goPrev();
          break;
        case "m":
          setMuted((m) => !m);
          break;
        case "1": setTab("feed"); break;
        case "2": setTab("explore"); break;
        case "3": setTab("live"); break;
        case "4": setTab("profile"); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tab, authOpen, liveOpen, commentsFor, giftFor, goNext, goPrev]);

  // Gift toast auto-dismiss
  useEffect(() => {
    if (!giftEvent) return;
    const t = window.setTimeout(() => setGiftEvent(null), 3000);
    return () => window.clearTimeout(t);
  }, [giftEvent]);

  const toggleLike = useCallback((vidId: string) => {
    setLikedSet((prev) => {
      const next = new Set(prev);
      if (next.has(vidId)) next.delete(vidId);
      else next.add(vidId);
      return next;
    });
  }, []);

  const toggleSave = useCallback((vidId: string) => {
    setSavedSet((prev) => {
      const next = new Set(prev);
      if (next.has(vidId)) next.delete(vidId);
      else {
        next.add(vidId);
        toast("Saved to your collection");
      }
      return next;
    });
  }, []);

  const toggleFollow = useCallback((creatorId: string) => {
    setFollowingSet((prev) => {
      const next = new Set(prev);
      if (next.has(creatorId)) next.delete(creatorId);
      else next.add(creatorId);
      return next;
    });
  }, []);

  const handleSendGift = useCallback(
    (gift: GiftDef, recipient: string) => {
      setProfile((p) => ({ ...p, coins: Math.max(0, p.coins - gift.coins) }));
      setGiftsGiven((g) => ({ ...g, [recipient]: (g[recipient] ?? 0) + 1 }));
      setGiftEvent({ giftId: gift.id, recipient, coins: gift.coins });
      toast.success(`Sent ${gift.name} to ${recipient}!`);
    },
    [],
  );

  const handleRecharge = useCallback((amount: number) => {
    setProfile((p) => ({ ...p, coins: p.coins + amount }));
    toast.success(`Topped up ${amount.toLocaleString()} coins`);
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: video.caption, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
      toast("Link copied to clipboard");
    }
  }, [video.caption]);

  const activeRoom = LIVE_ROOMS[0];

  return (
    <div
      className="h-screen w-full overflow-hidden bg-[#050507] font-sans text-white"
      onWheel={onWheel}
    >
      <Navigation
        activeTab={tab}
        onTabChange={setTab}
        coins={profile.coins}
        autoScroll={autoScroll}
        onAutoScrollToggle={() => {
          setAutoScroll((a) => {
            toast(a ? "Auto-scroll off" : "Auto-scroll on — feed advances every 5s");
            return !a;
          });
        }}
        onOpenLive={() => setLiveOpen(true)}
        onUpload={() => toast.info("Upload pipeline arrives in the next update")}
        onOpenAuth={() => setAuthOpen(true)}
        onProfileClick={() => setTab("profile")}
        currentUserHandle={profile.handle}
      />

      {/* ============ MAIN STAGES ============ */}
      <AnimatePresence mode="wait">
        {tab === "feed" && (
          <motion.div
            key="feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            <div
              ref={feedRef}
              className="h-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain scrollbar-hide"
            >
              {VIDEOS.map((v) => {
                const c = CREATORS.find((x) => x.id === v.creatorId) as Creator;
                return (
                  <section
                    key={v.id}
                    className="relative h-full w-full snap-start snap-always overflow-hidden bg-black"
                  >
                    <VideoPlayer
                      video={v}
                      active={v.id === video.id}
                      muted={muted}
                      onToggleMute={() => setMuted((m) => !m)}
                      speed={speed}
                      onSpeedChange={setSpeed}
                      liked={likedSet.has(v.id)}
                      onToggleLike={() => toggleLike(v.id)}
                      saved={savedSet.has(v.id)}
                      onToggleSave={() => toggleSave(v.id)}
                      likesCount={v.id === video.id ? likeCount : v.likes}
                      onOpenComments={() => setCommentsFor(v.id)}
                      onOpenGifts={() => setGiftFor(v.id)}
                      onShare={handleShare}
                      onFollowToggle={() => toggleFollow(c.id)}
                      isFollowing={followingSet.has(c.id)}
                      handle={c.handle}
                      avatar={c.avatar}
                      verified={c.verified}
                      soundName={v.sound}
                      onDoubleTapLike={() => toggleLike(v.id)}
                      onEnded={() => handleVideoEnded()}
                    />
                    {/* Pager arrows (desktop) */}
                    <div className="pointer-events-none absolute inset-y-0 right-3 z-20 hidden flex-col items-center justify-center gap-2 md:flex">
                      {index > 0 && (
                        <button
                          onClick={goPrev}
                          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md transition-all hover:bg-black/80 active:scale-90"
                          aria-label="Previous video"
                        >
                          <ArrowUp size={18} />
                        </button>
                      )}
                      <span className="rounded-full border border-white/15 bg-black/55 px-2.5 py-1 font-mono text-[10px] font-bold text-white/80 backdrop-blur-md">
                        {index + 1}/{VIDEOS.length}
                      </span>
                      {index < VIDEOS.length - 1 && (
                        <button
                          onClick={() => goNext(video.id)}
                          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md transition-all hover:bg-black/80 active:scale-90"
                          aria-label="Next video"
                        >
                          <ArrowDown size={18} />
                        </button>
                      )}
                    </div>

                    {/* Live badge on first slide */}
                    {v.id === VIDEOS[0].id && (
                      <button
                        onClick={() => setLiveOpen(true)}
                        className="absolute left-3 top-16 z-20 flex items-center gap-1.5 rounded-full border border-[#FF1744]/50 bg-black/60 px-3 py-1.5 text-[11px] font-extrabold text-[#FF2D5E] backdrop-blur-xl transition-all active:scale-95 sm:left-5 md:left-8"
                      >
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF1744]" />
                        <Broadcast size={12} weight="fill" />
                        LIVE · {activeRoom.viewers.toLocaleString()}
                      </button>
                    )}
                  </section>
                );
              })}
            </div>

            {/* Gift overlay toast */}
            <AnimatePresence>
              {giftEvent && (
                <div className="pointer-events-none absolute inset-x-0 top-20 z-30 flex justify-center px-4">
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.95 }}
                    className="flex items-center gap-3 rounded-2xl border border-[#FF1744]/40 bg-black/85 px-4 py-3 shadow-[0_8px_40px_rgba(255,23,68,0.4)] backdrop-blur-xl"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -40 }}
                      animate={{ scale: [0, 1.4, 1], rotate: 0 }}
                      className="text-2xl"
                      style={{ color: (GIFTS.find((g) => g.id === giftEvent.giftId) ?? GIFTS[0]).color }}
                    >
                      {giftEmoji(giftEvent.giftId)}
                    </motion.span>
                    <div>
                      <p className="text-sm font-extrabold text-white">
                        You sent a gift to <span className="text-[#FF2D5E]">{giftEvent.recipient}</span>
                      </p>
                      <p className="font-mono text-[11px] text-white/55">
                        −{giftEvent.coins.toLocaleString()} coins · beautifully done ✦
                      </p>
                    </div>
                    <Sparkle size={18} className="ml-2 text-[#FFD166]" weight="fill" />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {tab === "explore" && (
          <ExploreView
            key="explore"
            tag={exploreTag}
            onTagChange={setExploreTag}
            followingSet={followingSet}
            onToggleFollow={toggleFollow}
            onOpenVideo={(v) => {
              setTab("feed");
              setIndex(VIDEOS.findIndex((x) => x.id === v.id));
            }}
          />
        )}

        {tab === "live" && (
          <motion.div
            key="live"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="h-full w-full overflow-y-auto pb-24 pt-16 md:pt-20"
          >
            <div className="mx-auto max-w-5xl px-4">
              <h1 className="text-2xl font-extrabold tracking-tight">Live now</h1>
              <p className="mt-1 text-sm text-white/50">Broadcasts happening right now across {BRAND_NAME}.</p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {LIVE_ROOMS.map((room) => (
                  <motion.button
                    key={room.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setLiveOpen(true)}
                    className="group relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a0a12] to-black text-left"
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(255,23,68,0.25),transparent_65%)]">
                      <span className="text-4xl opacity-30">▶</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                    <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#FF1744] px-2.5 py-1 text-[10px] font-extrabold text-white shadow-[0_0_14px_rgba(255,23,68,0.6)]">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
                    </span>
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur">
                      <span className="text-[10px]">👁</span> {room.viewers.toLocaleString()}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF2D5E]">{room.category}</p>
                      <h3 className="mt-0.5 text-base font-extrabold leading-tight">{room.name}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-white/70">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#FF1744] to-[#7a0012] text-[8px] font-black">
                          {room.hostAvatar}
                        </span>
                        {room.host}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full overflow-y-auto bg-[#050507]"
          >
            <ProfileView
              profile={profile}
              creator={activeProfileCreator}
              onBack={() => setTab("feed")}
              onFollowToggle={() => toggleFollow(activeProfileCreator.id)}
              onLogout={() => {
                setProfile(GUEST_PROFILE);
                toast("Logged out — see you soon");
              }}
              onOpenAuth={() => setAuthOpen(true)}
              onGiftCreator={() => setGiftFor(VIDEOS[0].id)}
              giftsGiven={giftsGiven[profile.handle] ?? 0}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ OVERLAYS ============ */}
      <AnimatePresence>
        {authOpen && (
          <AuthModal
            onClose={() => setAuthOpen(false)}
            onLogin={(prof) => {
              setProfile(prof);
              setAuthOpen(false);
              toast.success(`Welcome back, ${prof.name}`);
            }}
          />
        )}
      </AnimatePresence>

      <GiftDrawer
        open={!!giftFor && !liveOpen}
        onClose={() => setGiftFor(null)}
        coins={profile.coins}
        onSendGift={handleSendGift}
        onRecharge={handleRecharge}
        recipientHandle={creator.handle}
      />

      <LiveStreamModal
        open={liveOpen}
        onClose={() => setLiveOpen(false)}
        onSendGift={handleSendGift}
        coins={profile.coins}
        onOpenGiftWallet={() => setGiftFor(VIDEOS[0].id)}
      />

      <AnimatePresence>
        {commentsFor && (
          <CommentsSheet
            videoId={commentsFor}
            onClose={() => setCommentsFor(null)}
            commentText={commentText}
            setCommentText={setCommentText}
          />
        )}
      </AnimatePresence>

      {/* Bottom hint (mobile) */}
      {tab === "feed" && !autoScroll && (
        <div
          className="pointer-events-none fixed inset-x-0 z-30 flex justify-center md:hidden"
          style={{ bottom: "max(5rem, calc(env(safe-area-inset-bottom) + 4rem))" }}
        >
          <p className="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[10px] font-bold text-white/50 backdrop-blur">
            Swipe up for more · hold to pause
          </p>
        </div>
      )}
    </div>
  );
}

/* ============== HELPERS ============== */
function giftEmoji(giftId: string): string {
  switch (giftId) {
    case "g1": return "⭐";
    case "g2": return "👑";
    case "g3": return "🌹";
    case "g4": return "🚀";
    case "g5": return "💎";
    case "g6": return "🐉";
    default: return "🎁";
  }
}

function formatCompact(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}