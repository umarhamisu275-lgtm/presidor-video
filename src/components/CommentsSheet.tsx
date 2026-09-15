import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { X, ArrowUp } from "@phosphor-icons/react";
import { VIDEOS } from "../constants";
import type { Video } from "../types";

interface CommentsSheetProps {
  videoId: string;
  onClose: () => void;
  commentText: string;
  setCommentText: (v: string) => void;
}

export function CommentsSheet({ videoId, onClose, commentText, setCommentText }: CommentsSheetProps) {
  const v = VIDEOS.find((x) => x.id === videoId) as Video;
  const [localComments, setLocalComments] = useState(v.comments);

  const addComment = () => {
    const t = commentText.trim();
    if (!t) return;
    setLocalComments((c) => [
      ...c,
      { id: `new-${Date.now()}`, user: "You", avatar: "YOU", text: t, time: "now", likes: 0 },
    ]);
    setCommentText("");
    toast("Comment posted ✦");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 320 }}
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl border-x border-t border-white/10 bg-[#0A0A0E] pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <h3 className="text-base font-extrabold text-white">
            {localComments.length.toLocaleString()} comments
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 active:scale-90"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>
        <div className="max-h-[45vh] space-y-4 overflow-y-auto px-5 py-4">
          {localComments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF1744] to-[#7a0012] text-[10px] font-black">
                {c.avatar}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs">
                  <span className="font-extrabold text-white/90">{c.user}</span>
                  <span className="ml-2 text-white/35">{c.time}</span>
                </p>
                <p className="mt-0.5 text-[13px] leading-snug text-white/85">{c.text}</p>
                <p className="mt-1 text-[10px] font-bold text-white/35">{c.likes.toLocaleString()} likes</p>
              </div>
              <button className="mt-1 text-white/30 transition hover:text-[#FF2D5E] active:scale-90" aria-label="Like comment">
                ♡
              </button>
            </div>
          ))}
          {localComments.length === 0 && (
            <p className="py-8 text-center text-sm text-white/35">Be the first to comment ✦</p>
          )}
        </div>
        <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF1744] text-[10px] font-black">YOU</span>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addComment()}
            placeholder="Add a comment…"
            className="h-10 min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 text-[13px] text-white placeholder:text-white/35 focus:border-[#FF1744]/60 focus:outline-none"
          />
          <button
            onClick={addComment}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF1744] text-white shadow-[0_0_14px_rgba(255,23,68,0.5)] transition-all active:scale-90"
            aria-label="Post comment"
          >
            <ArrowUp size={17} weight="bold" className="-rotate-45" />
          </button>
        </div>
      </motion.div>
    </>
  );
}