import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'videos.json');
const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');

// --- Video Interfaces & Helpers ---

export interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration: number | null;
  views: number;
  category: string | null;
  created_at: string;
  rating?: number;
  uploaderId?: string; // Link to User ID
}

async function readDb(): Promise<Video[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeDb(videos: Video[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(videos, null, 2), 'utf-8');
}

// --- User Interfaces & Helpers ---

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; 
    role: 'admin' | 'user';
    createdAt: string;
    tokens: number;
    subscription: 'free' | 'premium' | 'pro';
    watchHistory: string[]; // Array of Video IDs
}

async function readUsersDb(): Promise<User[]> {
    try {
        const data = await fs.readFile(USERS_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function writeUsersDb(users: User[]) {
    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), 'utf-8');
}

// --- Video Functions ---

export async function getVideos(): Promise<Video[]> {
  return readDb();
}

export async function getVideoById(id: string): Promise<Video | null> {
  const videos = await readDb();
  return videos.find((v) => v.id === id) || null;
}

export async function getVideosByCategory(category: string, excludeId?: string): Promise<Video[]> {
  const videos = await readDb();
  return videos.filter((v) => 
    (v.category?.toLowerCase() === category.toLowerCase()) && 
    (excludeId ? v.id !== excludeId : true)
  );
}

export async function createVideo(video: Omit<Video, 'id' | 'created_at' | 'views'>): Promise<Video> {
  const videos = await readDb();
  const newVideo: Video = {
    ...video,
    id: Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString(),
    views: 0,
    rating: 0,
    // uploaderId provided in spread 'video' argument
  };
  
  videos.unshift(newVideo); 
  await writeDb(videos);
  return newVideo;
}

export async function getUserVideos(userId: string): Promise<Video[]> {
    const videos = await readDb();
    return videos.filter(v => v.uploaderId === userId);
}

export async function incrementVideoViews(id: string) {
  const videos = await readDb();
  const video = videos.find((v) => v.id === id);
  if (video) {
    video.views += 1;
    await writeDb(videos);
  }
}

export async function rateVideo(id: string, rating: number) {
    const videos = await readDb();
    const video = videos.find(v => v.id === id);
    if (video) {
        const currentRating = video.rating || 0;
        const newRating = currentRating === 0 ? rating : (currentRating + rating) / 2; 
        video.rating = newRating;
        await writeDb(videos);
    }
}

export async function deleteVideo(id: string) {
    let videos = await readDb();
    videos = videos.filter(v => v.id !== id);
    await writeDb(videos);
}

// --- User Functions ---

export async function getUserByEmail(email: string): Promise<User | null> {
    const users = await readUsersDb();
    return users.find(u => u.email === email) || null;
}

export async function getUserById(id: string): Promise<User | null> {
    const users = await readUsersDb();
    return users.find(u => u.id === id) || null;
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'tokens' | 'subscription' | 'watchHistory'>): Promise<User> {
    const users = await readUsersDb();
    const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        ...userData,
        createdAt: new Date().toISOString(),
        tokens: 100, // Default starting tokens
        subscription: 'free',
        watchHistory: []
    };
    users.push(newUser);
    await writeUsersDb(users);
    return newUser;
}

export async function getUsers(): Promise<User[]> {
    return readUsersDb();
}

export async function addToWatchHistory(userId: string, videoId: string) {
    const users = await readUsersDb();
    const user = users.find(u => u.id === userId);
    if (user) {
        // Remove if exists to push to top
        user.watchHistory = user.watchHistory || [];
        user.watchHistory = user.watchHistory.filter(id => id !== videoId);
        user.watchHistory.unshift(videoId); // Add to front
        // Limit to 20 items
        if(user.watchHistory.length > 20) user.watchHistory.pop();
        await writeUsersDb(users);
    }
}

export async function getWatchHistory(userId: string): Promise<Video[]> {
    const user = await getUserById(userId);
    if (!user || !user.watchHistory) return [];
    
    // Fetch all videos to map
    const videos = await readDb();
    // Return videos in the order of history
    return user.watchHistory
        .map(id => videos.find(v => v.id === id))
        .filter((v): v is Video => v !== undefined);
}

export async function updateUserTokens(userId: string, amount: number) {
    const users = await readUsersDb();
    const user = users.find(u => u.id === userId);
    if (user) {
        user.tokens = (user.tokens || 0) + amount;
        await writeUsersDb(users);
    }
}

export async function updateUserSubscription(userId: string, tier: 'free' | 'premium' | 'pro') {
    const users = await readUsersDb();
    const user = users.find(u => u.id === userId);
    if (user) {
        user.subscription = tier;
        await writeUsersDb(users);
    }
}
