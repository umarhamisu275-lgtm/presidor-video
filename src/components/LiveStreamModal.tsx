import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HeartStraight, Gift as GiftIcon, Users, HandHeart } from "@phosphor-icons/react";
import type { ChatMessage, GiftDef, LiveRoom } from "../types";
import { GIFTS, LIVE_ROOMS } from "../constants";

interface LiveStreamModalProps {
  open: boolean;
  onClose: () => void;
  onSendGift: (gift: GiftDef, recipientHandle: string) => void;
  coins: number;
  onOpenGiftWallet: () => void;
}

const CHAT_POOL = [
  { user: "glitchbaby", color: "#FF2D5E", text: "this set is unreal 🔥🔥" },
  { user: "neonfox", color: "#7DF9FF", text: "Tokyo never sleeps" },
  { user: "synthwave_sam", color: "#FFD166", text: "drop the track ID pls" },
  { user: "pixelqueen", color: "#C792EA", text: "the visuals are SO clean" },
  { user: "basshead_77", color: "#3DFF88", text: "sub bass is shaking my desk" },
  { user: "midnightmomo", color: "#FF9E5E", text: "just joined, hi everyone!!" },
  { user: "vr_girl", color: "#A78BFA", text: "this is why I live here" },
  { user: "cybercrust", color: "#F472B6", text: "chat we hit 48k viewers 🚀" },
  { user: "lofi_lemon", color: "#FFF3B0", text: "coffee + this live = perfect night" },
  { user: "tunnelvision", color: "#93C5FD", text: "someone gift the rocket already" },
];

const JOIN_POOL = ["nova_ray", "deepfocus", "krave_kid", "solarflare", "nightowl_00"];

function randColor() {
  return `hsl(${Math.floor(Math.random() * 360)} 80% 65%)`;
}

export function LiveStreamModal({ open, onClose, onSendGift, coins, onOpenGiftWallet }: LiveStreamModalProps) {
  const [room, setRoom] = useState<LiveRoom>(LIVE_ROOMS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m0", user: room.host, color: "#FF1744", text: "Welcome to the stream! Drop a 🔥 if you can hear us", isHost: true },
  ]);
  const [viewers, setViewers] = useState(room.viewers);
  const [input, setInput] = useState("");
  const [giftFly, setGiftFly] = useState<{ id: string; gift: GiftDef; user: string } | null>(null);
  const [reactions, setReactions] = useState<{ id: string; emoji: string } | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const hostVideoRef = useRef<HTMLVideoElement>(null);
  const msgId = useRef(10);
  const joinerId = useRef(0);

  // Chat ticker
  useEffect(() => {
    if (!open) return;
    const interval = window.setInterval(() => {
      const roll = Math.random();
      const next: ChatMessage[] = [...messages];
      if (roll < 0.16) {
        const name = JOIN_POOL[joinerId.current % JOIN_POOL.length] + Math.floor(Math.random() * 90 + 10);
        joinerId.current += 1;
        next.push({ id: `m${msgId.current++}`, user: name, color: "#3DFF88", text: "🎉 joined the stream", isSystem: true });
        setViewers((v) => v + Math.floor(Math.random() * 40 + 8));
      } else {
        const t = CHAT_POOL[Math.floor(Math.random() * CHAT_POOL.length)];
        next.push({ id: `m${msgId.current++}`, user: t.user, color: t.color, text: t.text });
      }
      if (next.length > 40) next.splice(0, next.length - 40);
      setMessages(next);
      setViewers((v) => v + Math.floor(Math.random() * 12) - 5);
    }, 1600);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, messages.length > 0]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    setRoom(LIVE_ROOMS[Math.floor(Math.random() * LIVE_ROOMS.length)]);
    setViewers(LIVE_ROOMS[0].viewers);
  }, [open]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: `m${msgId.current++}`, user: "You", color: "#FFFFFF", text }]);
    setInput("");
  };

  const dispatchGift = (gift: GiftDef) => {
    if (coins < gift.coins) {
      onOpenGiftWallet();
      return;
    }
    onSendGift(gift, room.host);
    setGiftFly({ id: `${Date.now()}`, gift, user: "You" });
    window.setTimeout(() => setGiftFly(null), 3000);
    setMessages((m) => [...m, { id: `m${msgId.current++}`, user: "You", color: "#FFD166", text: `sent ${gift.name} ✦` }]);
  };

  const react = (emoji: string) => {
    const id = `${Date.now()}`;
    setReactions({ id, emoji });
    window.setTimeout(() => setReactions((r) => (r && r.id === id ? null : r)), 1400);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-0 backdrop-blur-md sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 20 }}
            className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-none border border-white/10 bg-[#0A0A0E] sm:h-[92vh] sm:rounded-3xl"
          >
            {/* Stream area */}
            <div className="relative h-1/2 w-full sm:h-[58%]">
              <video
                key={room.id}
                ref={hostVideoRef}
                src={room.streamUrl}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

              {/* Top overlay */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-4">
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-xl transition-all active:scale-90"
                  aria-label="Close live"
                >
                  <X size={17} weight="bold" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-[#FF1744] px-3 py-1.5 text-[11px] font-extrabold text-white shadow-[0_0_16px_rgba(255,23,68,0.6)]">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    LIVE
                  </span>
                  <span className="flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 font-mono text-[11px] font-bold text-white backdrop-blur-xl">
                    <Users size={13} className="text-[#3DFF88]" weight="fill" />
                    {viewers.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Host card */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#FF2D5E]">{room.category}</p>
                <h2 className="text-lg font-extrabold text-white drop-shadow">{room.name}</h2>
                <p className="flex items-center gap-1.5 text-sm font-bold text-white/90">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#FF1744] to-[#7a0012] text-[9px] font-black text-white">
                    {room.hostAvatar}
                  </span>
                  {room.host}
                  <span className="text-[10px] text-white/60">· {room.credits}</span>
                </p>
              </div>

              {/* Reaction hearts */}
              <AnimatePresence>
                {reactions && (
                  <motion.div
                    key={reactions.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.4, 1.1, 1.5], y: [0, -60, -120, -200] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.3 }}
                    className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 text-4xl"
                  >
                    {reactions.emoji}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Gift flyout */}
              <AnimatePresence>
                {giftFly && (
                  <motion.div
                    key={giftFly.id}
                    initial={{ opacity: 0, y: 40, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 1, 0], y: [40, -140, -260, -380], scale: [0.5, 1.3, 1.1, 0.8] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.8 }}
                    className="pointer-events-none absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center"
                  >
                    <span className="text-5xl drop-shadow-[0_0_30px_rgba(255,23,68,0.8)]">{giftFly.gift.name.split(" ")[0]}</span>
                    <span className="mt-1 rounded-full bg-black/70 px-3 py-1 text-xs font-extrabold text-white backdrop-blur">
                      {giftFly.user} sent {giftFly.gift.name}!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chat + actions */}
            <div className="flex h-1/2 flex-1 flex-col sm:h-auto">
              {/* Action bar */}
              <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5 sm:px-4">
                <div className="flex gap-1.5 overflow-x-auto">
                  {[30, 100, 250].map((amt) => {
                    const gift = GIFTS.find((g) => g.coins === amt);
                    if (!gift) return null;
                    return (
                      <button
                        key={amt}
                        onClick={() => dispatchGift(gift)}
                        className="flex shrink-0 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-extrabold text-white transition-all hover:border-[#FF1744]/60 hover:bg-[#FF1744]/15 active:scale-95"
                      >
                        <span style={{ color: gift.color }}>{emojiFor(gift.coins)}</span>
                        {gift.coins}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={onOpenGiftWallet}
                  className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-[#FF1744] px-3.5 py-1.5 text-[11px] font-extrabold text-white shadow-[0_0_14px_rgba(255,23,68,0.5)] transition-all active:scale-95"
                >
                  <GiftIcon size={13} weight="fill" /> GIFT
                </button>
                <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] font-bold text-[#FFD166]">
                  {coins.toLocaleString()} <CoinTag />
                </span>
              </div>

              {/* Messages */}
              <div ref={chatRef} className="flex-1 space-y-2 overflow-y-auto px-3 py-3 sm:px-4">
                {messages.map((m) => (
                  <div key={m.id} className="text-[12.5px] leading-snug">
                    {m.isHost && (
                      <span className="mr-1.5 rounded bg-[#FF1744] px-1 py-0.5 text-[9px] font-extrabold text-white">HOST</span>
                    )}
                    {m.isSystem && <span className="text-[#3DFF88]">{m.user}</span>}
                    {!m.isSystem && (
                      <>
                        <span className="font-bold" style={{ color: m.color }}>
                          {m.user}
                        </span>
                        <span className="text-white/45">: </span>
                      </>
                    )}
                    <span className={m.isSystem ? "text-[#3DFF88]" : "text-white/90"}>{m.text}</span>
                  </div>
                ))}
              </div>

              {/* Input + reactions */}
              <div className="border-t border-white/10 px-3 py-2.5 sm:px-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => react("❤️")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#FF1744] transition-all active:scale-90" aria-label="Love reaction">
                    <HeartStraight size={18} weight="fill" />
                  </button>
                  <button onClick={() => react("🔥")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-orange-400 transition-all active:scale-90" aria-label="Fire reaction">
                    🔥
                  </button>
                  <button onClick={() => react("👏")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-yellow-300 transition-all active:scale-90" aria-label="Clap reaction">
                    👏
                  </button>
                  <button onClick={() => react("😂")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-pink-300 transition-all active:scale-90" aria-label="Laugh reaction">
                    😂
                  </button>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Say something…"
                    className="ml-1 h-9 min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 text-[13px] text-white placeholder:text-white/35 focus:border-[#FF1744]/60 focus:outline-none"
                  />
                  <button onClick={sendMessage} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF1744] text-white shadow-[0_0_12px_rgba(255,23,68,0.5)] transition-all active:scale-90" aria-label="Send">
                    <SendIcon />
                  </button>
                </div>
                <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
                  {LIVE_ROOMS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRoom(r);
                        setViewers(r.viewers);
                      }}
                      className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold transition-all active:scale-95 ${
                        r.id === room.id
                          ? "border-[#FF1744] bg-[#FF1744]/15 text-[#FF2D5E]"
                          : "border-white/10 bg-white/5 text-white/60"
                      }`}
                    >
                      {r.category} · {r.name.split(" - ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Host follow chip */}
            <div className="absolute bottom-[46%] right-3 z-10 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 backdrop-blur-xl">
              <HandHeart size={13} className="text-[#FF2D5E]" weight="fill" />
              <span className="text-[10px] font-extrabold text-white">9.2K watching</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function emojiFor(coins: number): string {
  switch (coins) {
    case 30: return "⭐";
    case 100: return "🌹";
    case 250: return "🚀";
    default: return "💰";
  }
}

import { PaperPlaneTilt } from "@phosphor-icons/react";
function SendIcon() {
  return <PaperPlaneTilt size={15} weight="fill" />;
}

function CoinTag() {
  return <span className="text-[#FFD166]">♦</span>;
}