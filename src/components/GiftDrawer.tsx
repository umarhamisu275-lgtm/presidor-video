import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Crown,
  Rocket,
  Diamond,
  Flower,
  Fire,
  Coin,
  Plus,
  Check,
  Sparkle,
} from "@phosphor-icons/react";
import type { GiftDef } from "../types";
import { GIFTS } from "../constants";

interface GiftDrawerProps {
  open: boolean;
  onClose: () => void;
  coins: number;
  onSendGift: (gift: GiftDef, recipientHandle: string) => void;
  onRecharge: (amount: number) => void;
  recipientHandle: string;
}

const GIFT_ICONS: Record<GiftDef["icon"], React.ReactNode> = {
  star: <Star size={34} weight="fill" />,
  crown: <Crown size={34} weight="fill" />,
  rose: <Flower size={34} weight="fill" />,
  rocket: <Rocket size={34} weight="fill" />,
  diamond: <Diamond size={34} weight="fill" />,
  dragon: <Fire size={34} weight="fill" />,
};

export function GiftDrawer({ open, onClose, coins, onSendGift, onRecharge, recipientHandle }: GiftDrawerProps) {
  const [toast, setToast] = useState<{ id: string; gift: GiftDef; recipient: string } | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setToast(null);
  }, [open]);

  const send = (gift: GiftDef) => {
    if (coins < gift.coins) {
      setToast({ id: "no-coins", gift, recipient: recipientHandle });
      return;
    }
    onSendGift(gift, recipientHandle);
    setToast({ id: `${Date.now()}`, gift, recipient: recipientHandle });
    window.setTimeout(() => setToast(null), 2600);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              ref={drawerRef}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl border-t border-x border-white/10 bg-[#0A0A0E] pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-10px_60px_rgba(0,0,0,0.8)]"
            >
              <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-white/20" />

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-3">
                <div>
                  <h3 className="text-base font-extrabold text-white">Send a Gift</h3>
                  <p className="text-[11px] text-white/50">
                    to <span className="font-bold text-[#FF2D5E]">{recipientHandle}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    key={coins}
                    initial={{ scale: 1.25 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1.5 rounded-full border border-[#FFD166]/30 bg-[#FFD166]/10 px-3 py-1.5 font-mono text-xs font-bold text-[#FFD166]"
                  >
                    <Coin size={14} weight="fill" />
                    {coins.toLocaleString()}
                  </motion.div>
                  <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/10 active:scale-90" aria-label="Close">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Gift grid */}
              <div className="grid grid-cols-3 gap-2 px-4 py-4 sm:grid-cols-6 sm:gap-3">
                {GIFTS.map((gift) => {
                  const affordable = coins >= gift.coins;
                  return (
                    <motion.button
                      key={gift.id}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => send(gift)}
                      className={`relative flex flex-col items-center gap-1 rounded-2xl border p-3 transition-all ${
                        affordable
                          ? "border-white/10 bg-white/5 hover:border-[#FF1744]/50 hover:bg-[#FF1744]/10"
                          : "border-white/5 bg-black/40 opacity-45 grayscale"
                      }`}
                    >
                      <span style={{ color: gift.color }} className="drop-shadow-[0_0_12px_rgba(255,23,68,0.35)]">
                        {GIFT_ICONS[gift.icon]}
                      </span>
                      <span className="text-center text-[10px] font-extrabold leading-tight text-white">{gift.name}</span>
                      <span className="flex items-center gap-1 font-mono text-[9px] font-bold text-[#FFD166]">
                        <Coin size={9} weight="fill" /> {gift.coins.toLocaleString()}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Recharge row */}
              <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/45">Instant top-up</span>
                <div className="flex gap-2">
                  {[100, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => onRecharge(amt)}
                      className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold text-white transition-all hover:border-[#FFD166]/50 hover:bg-[#FFD166]/10 active:scale-95"
                    >
                      <Plus size={11} weight="bold" className="text-[#FFD166]" />
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toasts */}
              <AnimatePresence>
                {toast && (
                  <div className="absolute inset-x-0 -top-24 flex justify-center px-6">
                    {toast.id === "no-coins" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 rounded-2xl border border-[#FF1744]/40 bg-black/90 px-4 py-3 text-sm font-bold text-[#FF2D5E] shadow-[0_8px_40px_rgba(255,23,68,0.35)] backdrop-blur-xl"
                      >
                        Not enough gems — top up below to send this gift
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/90 px-4 py-3 backdrop-blur-xl"
                      >
                        <motion.span
                          initial={{ scale: 0, rotate: -30 }}
                          animate={{ scale: [0, 1.5, 1], rotate: 0 }}
                          style={{ color: toast.gift.color }}
                        >
                          {GIFT_ICONS[toast.gift.icon]}
                        </motion.span>
                        <div>
                          <p className="text-sm font-extrabold text-white">
                            Gifted <span style={{ color: toast.gift.color }}>{toast.gift.name}</span>!
                          </p>
                          <p className="flex items-center gap-1 text-[11px] font-mono text-white/55">
                            <Sparkle size={11} className="text-[#FF2D5E]" weight="fill" /> Sent to {toast.recipient}
                          </p>
                        </div>
                        <Check size={18} weight="bold" className="ml-2 text-[#3DFF88]" />
                      </motion.div>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}