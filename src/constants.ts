import type { Creator, GiftDef, LiveRoom, Video, UserProfile } from "./types";

export const BRAND_NAME = "CRIMSON";
export const BRAND_TAGLINE = "WATCH. GIFT. GLOW.";
export const STARTING_COINS = 1500;

export const DEMO_ACCOUNTS: UserProfile[] = [
  { handle: "@neon_director", name: "Nova Raine", avatar: "NR", coins: 1500, bio: "Neon nights, city lights, cinematic frames.", isDemo: true },
  { handle: "@cyber_vixen", name: "Vex Okafor", avatar: "VO", coins: 1500, bio: "Cyber fashion + heavy bass. Tokyo born.", isDemo: true },
  { handle: "@tokyo_pulse", name: "Kenji Arata", avatar: "KA", coins: 1500, bio: "Street eats, ramen crawls, neon walks.", isDemo: true },
];

export const GUEST_PROFILE: UserProfile = {
  handle: "@guest",
  name: "Guest",
  avatar: "GU",
  coins: 1500,
  bio: "Exploring Crimson as a guest.",
  isDemo: true,
};

export const CREATORS: Creator[] = [
  {
    id: "c1",
    handle: "@neon_director",
    name: "Nova Raine",
    avatar: "NR",
    verified: true,
    bio: "Cinematic neon. City rain. Frames that glow after dark.",
    followers: 284000,
    following: 312,
    giftsReceived: 12840,
    coinsEarned: 964500,
    isFollowing: false,
  },
  {
    id: "c2",
    handle: "@cyber_vixen",
    name: "Vex Okafor",
    avatar: "VO",
    verified: true,
    bio: "Cyber fashion & heavy bass. Tokyo born, world bound.",
    followers: 512000,
    following: 148,
    giftsReceived: 22300,
    coinsEarned: 1580000,
    isFollowing: false,
  },
  {
    id: "c3",
    handle: "@tokyo_pulse",
    name: "Kenji Arata",
    avatar: "KA",
    verified: false,
    bio: "Street eats, ramen crawls, neon walks after midnight.",
    followers: 96000,
    following: 521,
    giftsReceived: 4100,
    coinsEarned: 290000,
    isFollowing: false,
  },
  {
    id: "c4",
    handle: "@gravity_labs",
    name: "Mara Quinn",
    avatar: "MQ",
    verified: true,
    bio: "Extreme sports, big air, bigger grins. 4K POV.",
    followers: 174000,
    following: 89,
    giftsReceived: 8900,
    coinsEarned: 640000,
    isFollowing: false,
  },
  {
    id: "c5",
    handle: "@chroma_kitchen",
    name: "Zane Ibarra",
    avatar: "ZI",
    verified: false,
    bio: "Chef of colored smoke. Fire, plating, drama.",
    followers: 66000,
    following: 205,
    giftsReceived: 2300,
    coinsEarned: 190000,
    isFollowing: false,
  },
  {
    id: "c6",
    handle: "@motion_synth",
    name: "Ivy Chen",
    avatar: "IC",
    verified: true,
    bio: "Generative art, audio reactive worlds, 60fps.",
    followers: 398000,
    following: 77,
    giftsReceived: 15800,
    coinsEarned: 1120000,
    isFollowing: false,
  },
  {
    id: "c7",
    handle: "@midnight_motors",
    name: "Rex Alvarez",
    avatar: "RA",
    verified: false,
    bio: "Night drives, turbo builds, tunnel acoustics.",
    followers: 121000,
    following: 96,
    giftsReceived: 6700,
    coinsEarned: 480000,
    isFollowing: false,
  },
];

export const VIDEOS: Video[] = [
  {
    id: "v1",
    creatorId: "c1",
    url: "https://limewire.com/d/90727be3-2f27-4ab0-bec2-b9cfa2b0c0d0#QvJWU3LqEHyjBRk2aJCUd6fm1_LXMc5N8zX_NiEEyO4",
    poster: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    caption: "Rain falling on the skyline, one frame at a time",
    hashtags: ["#neon", "#citylights", "#cinematic"],
    sound: "Neon Rain - Night Drive Mix",
    likes: 128400,
    comments: [
      { id: "cm1", user: "pixel_fox", avatar: "PF", text: "This is unreal. The grain, the glow, wow.", time: "2h", likes: 1240 },
      { id: "cm2", user: "lunartide", avatar: "LT", text: "Saving this for my night edits", time: "1h", likes: 342 },
    ],
    shares: 8200,
    saves: 15400,
    duration: 12,
    views: 3100000,
  },
  {
    id: "v2",
    creatorId: "c2",
    url: "https://limewire.com/d/f60d5e83-c8b3-46f5-b26b-8d2f2f6af1e7#4rB4HwC-2G8gB2No8ndVUB9V3BOTc3YUkuMi0FdnpaI",
    poster: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop",
    caption: "Cyber fit check in the neon district",
    hashtags: ["#cyber", "#fashion", "#tokyo"],
    sound: "Bass Overdrive - Vex Session",
    likes: 342100,
    comments: [
      { id: "cm3", user: "glitch_kit", avatar: "GK", text: "The jacket though???", time: "4h", likes: 2100 },
      { id: "cm4", user: "synthweaver", avatar: "SW", text: "Tokyo after dark never misses", time: "3h", likes: 560 },
    ],
    shares: 22100,
    saves: 31200,
    duration: 9,
    views: 5900000,
  },
  {
    id: "v3",
    creatorId: "c3",
    url: "https://limewire.com/d/975af5f9-41e6-4e4c-a7f4-43f2df0c6f4e#VP9ivssEkdl0fVX9tHkDLBTTKBu9S1EKM2f4It9p8nQ",
    poster: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?q=80&w=1200&auto=format&fit=crop",
    caption: "Midnight ramen run, edge of Shibuya",
    hashtags: ["#ramen", "#tokyo", "#food"],
    sound: "Steam & Slurp - Field Recording",
    likes: 89200,
    comments: [
      { id: "cm5", user: "noodle_saint", avatar: "NS", text: "I can hear the broth from here", time: "5h", likes: 890 },
      { id: "cm6", user: "eatwithme", avatar: "EW", text: "Drop the shop name NOW", time: "2h", likes: 1200 },
    ],
    shares: 6800,
    saves: 14300,
    duration: 14,
    views: 2100000,
  },
  {
    id: "v4",
    creatorId: "c4",
    url: "https://limewire.com/d/e87b4f87-7e05-4da1-92de-5c0d6dbc725a#ZRc9q1YtOm9Z6WvEZO6Lxl9dWY5lGYHm9cNfSn3nHfA",
    poster: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop",
    caption: "Big air, 4K POV, zero fear",
    hashtags: ["#sports", "#pov", "#bigair"],
    sound: "Takeoff - Gravity Anthem",
    likes: 221000,
    comments: [
      { id: "cm7", user: "vert_rider", avatar: "VR", text: "The camera work on this is insane", time: "6h", likes: 1750 },
    ],
    shares: 15400,
    saves: 9800,
    duration: 11,
    views: 4200000,
  },
  {
    id: "v5",
    creatorId: "c5",
    url: "https://limewire.com/d/eb475d61-8ad9-459e-b612-87ed22911f94#dGWJcX1Q6tRad7NqYrUGm0dMpsA1j7aaeElkr2nZzfo",
    poster: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
    caption: "Flame-seared, color-plated, camera-ready",
    hashtags: ["#chef", "#fire", "#plating"],
    sound: "Sizzle - Chroma Kitchen",
    likes: 114000,
    comments: [
      { id: "cm8", user: "foodfilm", avatar: "FF", text: "Why does this look better than my life", time: "3h", likes: 2300 },
    ],
    shares: 9900,
    saves: 18700,
    duration: 10,
    views: 2600000,
  },
  {
    id: "v6",
    creatorId: "c6",
    url: "https://limewire.com/d/4ffc8d92-06c5-4ae8-acbc-3dcf8b63f4cd#hbH4IvE7DeAB8xJux3eKXrr_4gTUusCva183M_0nf18",
    poster: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1200&auto=format&fit=crop",
    caption: "Audio-reactive world, 60fps, zero cuts",
    hashtags: ["#generative", "#art", "#60fps"],
    sound: "Pulse Form - Motion Synth",
    likes: 198000,
    comments: [
      { id: "cm9", user: "codeandcolor", avatar: "CC", text: "This is what WebGL dreams are made of", time: "7h", likes: 3100 },
    ],
    shares: 21200,
    saves: 26400,
    duration: 8,
    views: 3800000,
  },
  {
    id: "v7",
    creatorId: "c7",
    url: "https://limewire.com/d/1d354fd2-ce44-4ec8-97ff-b6bc1f032cf7#qPUN8F6Jc2WWgk9LQCqMzXrHflqQhuDSUzGkX5-Aqyo",
    poster: "https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=1200&auto=format&fit=crop",
    caption: "Tunnel acoustics at 3AM, turbo spooling",
    hashtags: ["#cars", "#night", "#turbo"],
    sound: "Spool & Echo - Midnight Motors",
    likes: 156000,
    comments: [
      { id: "cm10", user: "boost_boy", avatar: "BB", text: "That downshift was illegal", time: "2h", likes: 980 },
    ],
    shares: 18700,
    saves: 12100,
    duration: 13,
    views: 3300000,
  },
];

export const GIFTS: GiftDef[] = [
  { id: "g1", name: "Bronze Star", coins: 10, icon: "star", color: "#D4A017", label: "A bright little hello" },
  { id: "g2", name: "Silver Crown", coins: 50, icon: "crown", color: "#C0C0C8", label: "Fit for a rising star" },
  { id: "g3", name: "Neon Rose", coins: 100, icon: "rose", color: "#FF2D78", label: "Glowing midnight romance" },
  { id: "g4", name: "Red Fire Rocket", coins: 250, icon: "rocket", color: "#FF5A3C", label: "Lift-off energy" },
  { id: "g5", name: "Diamond Supernova", coins: 500, icon: "diamond", color: "#7DF9FF", label: "A supernova of style" },
  { id: "g6", name: "Crimson Dragon", coins: 1000, icon: "dragon", color: "#FF1744", label: "The rarest fire" },
];

export const LIVE_ROOMS: LiveRoom[] = [
  {
    id: "l1",
    name: "DJ Set - Crimson Nights",
    host: "@cyber_vixen",
    hostAvatar: "VO",
    category: "Music",
    viewers: 48200,
    streamUrl: "https://limewire.com/d/7a2f315e-5c3f-4b34-9ec4-f04c7d13e8f6#jb9S6vlLcTB6D3aWBH0FsXd6uIE8vSGYODUJZh7jstQ",
    credits: "Live from the neon district",
    tags: ["#EDM", "#Tokyo", "#Neon"],
  },
  {
    id: "l2",
    name: "Gaming Night - Speedrun",
    host: "@gravity_labs",
    hostAvatar: "MQ",
    category: "Gaming",
    viewers: 31600,
    streamUrl: "https://limewire.com/d/91e1ba9d-a9a0-4062-9de1-2ba9a74e1a44#qS5C2vju1z4mUWBPM8p2h4E7R9O7lWxV4ho5_HEwMDE",
    credits: "Sub-10 or we sleep",
    tags: ["#speedrun", "#WRLD", "#chat"],
  },
  {
    id: "l3",
    name: "Tokyo Night Walk",
    host: "@tokyo_pulse",
    hostAvatar: "KA",
    category: "Travel",
    viewers: 52400,
    streamUrl: "https://limewire.com/d/01d29c82-20b7-4e4b-9f6a-52350201e9cd#0JXY7OE2jWtIZKGICDMaKz6fGjbC0XYlxG8ltpQYJTU",
    credits: "Walking Shibuya after midnight",
    tags: ["#Tokyo", "#walk", "#night"],
  },
];

export const FEED_VIDEO_URLS = VIDEOS.map((v) => v.url);

export const STREAM_SRC =
  "https://limewire.com/d/2d8881b4-27ff-49d5-b812-9b98a1d38ec7#HlYaA2hmcMI0BnAf_KPHFAzG8ll4Vgmip8UrD3JkHWE";

export const DEFAULT_MUTED = true;
export const SPEED_OPTIONS = [0.5, 1, 1.5, 2];

export const NAV_ITEMS: { key: string; label: string; shortcut: string }[] = [
  { key: "feed", label: "For You", shortcut: "1" },
  { key: "explore", label: "Discover", shortcut: "2" },
  { key: "live", label: "Live", shortcut: "3" },
  { key: "profile", label: "You", shortcut: "4" },
];

export const EXPLORE_TAGS = [
  "#neon", "#tokyo", "#cyber", "#food", "#sports", "#cars", "#art", "#night",
];