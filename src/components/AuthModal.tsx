import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { X, UserPlus, Key, Envelope } from "@phosphor-icons/react";
import { BRAND_NAME, DEMO_ACCOUNTS, STARTING_COINS } from "../constants";
import type { UserProfile } from "../types";

interface AuthModalProps {
  onClose: () => void;
  onLogin: (p: UserProfile) => void;
}

export function AuthModal({ onClose, onLogin }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [passVisible, setPassVisible] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    const derived: UserProfile = {
      handle: handle || `@user_${Math.floor(Math.random() * 9999)}`,
      name: (email.split("@")[0] || "Creator")
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      avatar: "YOU",
      coins: STARTING_COINS,
      bio: "New on Crimson — ready to watch, gift and glow.",
      isDemo: false,
    };
    onLogin(derived);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.92, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 24, opacity: 0 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0A0A0E] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.8)] sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 active:scale-90"
          aria-label="Close"
        >
          <X size={15} />
        </button>

        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF1744] font-mono text-lg font-black text-white shadow-[0_0_20px_rgba(255,23,68,0.6)]">
            C
          </span>
          <div>
            <h2 className="text-lg font-black tracking-tight">Enter {BRAND_NAME}</h2>
            <p className="text-[11px] font-bold text-white/40">Watch. Gift. Glow.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`relative rounded-xl py-2 text-xs font-extrabold uppercase tracking-wider transition-all ${
                mode === m ? "text-white" : "text-white/40"
              }`}
            >
              {mode === m && (
                <motion.span layoutId="auth-tab" className="absolute inset-0 rounded-xl bg-[#FF1744] shadow-[0_0_16px_rgba(255,23,68,0.5)]" />
              )}
              <span className="relative">{m === "login" ? "Log in" : "Sign up"}</span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-5 space-y-3">
          {mode === "signup" && (
            <Field
              icon={<UserPlus size={16} />}
              placeholder="Pick a handle, e.g. @neon_star"
              value={handle}
              onChange={setHandle}
            />
          )}
          <Field icon={<Envelope size={16} />} placeholder="Email address" type="email" value={email} onChange={setEmail} />
          <div className="relative">
            <Field
              icon={<Key size={16} />}
              placeholder="Password"
              type={passVisible ? "text" : "password"}
              value={password}
              onChange={setPassword}
            />
            <button
              type="button"
              onClick={() => setPassVisible((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold uppercase tracking-wider text-[#FF2D5E]"
            >
              {passVisible ? "Hide" : "Show"}
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full rounded-2xl bg-[#FF1744] py-3 text-sm font-extrabold uppercase tracking-wider text-white shadow-[0_8px_30px_rgba(255,23,68,0.45)] transition-all hover:bg-[#FF2D5E]"
          >
            {mode === "login" ? "Log in" : "Create account"}
          </motion.button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/30">or demo as</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.handle}
              onClick={() => onLogin(acc)}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 py-3 transition-all hover:border-[#FF1744]/40 active:scale-95"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF1744] to-[#7a0012] text-[10px] font-black">
                {acc.avatar}
              </span>
              <span className="text-[10px] font-bold text-white/70">{acc.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-[10px] leading-relaxed text-white/30">
          By continuing you agree to our Terms of Service and Privacy Policy.
          <br />
          Coins are fictional — this is a demo experience.
        </p>
      </motion.div>
    </motion.div>
  );
}

function Field({
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 transition-all focus-within:border-[#FF1744]/50">
      <span className="text-white/40">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={type === "password" ? "current-password" : "on"}
        className="h-12 w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
      />
    </div>
  );
}