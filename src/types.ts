export interface Creator {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  verified: boolean;
  bio: string;
  followers: number;
  following: number;
  giftsReceived: number;
  coinsEarned: number;
  isFollowing: boolean;
}

export interface Video {
  id: string;
  creatorId: string;
  url: string;
  poster: string;
  caption: string;
  hashtags: string[];
  sound: string;
  likes: number;
  comments: Comment[];
  shares: number;
  saves: number;
  duration: number;
  views: number;
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

export interface GiftDef {
  id: string;
  name: string;
  coins: number;
  icon: "star" | "crown" | "rose" | "rocket" | "diamond" | "dragon";
  color: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  color: string;
  text: string;
  isHost?: boolean;
  isSystem?: boolean;
}

export interface LiveRoom {
  id: string;
  name: string;
  host: string;
  hostAvatar: string;
  category: string;
  viewers: number;
  streamUrl: string;
  credits: string;
  tags: string[];
}

export interface UserProfile {
  handle: string;
  name: string;
  avatar: string;
  coins: number;
  bio: string;
  isDemo: boolean;
}

export type FeedTab = "feed" | "explore" | "live" | "profile";

export interface GiftRecipient {
  videoId: string;
  giftId: string;
  recipient: string;
  coins: number;
  time: number;
}

export interface GiftToast {
  id: string;
  giftId: string;
  recipient: string;
}