// Demo data for SocialSync Agency Platform

export interface Post {
  id: string;
  title: string;
  image?: string;
  platform: string;
  status: 'draft' | 'pending' | 'approved' | 'scheduled' | 'published' | 'failed';
  client: string;
  campaign: string;
  scheduledDate?: string;
  author: string;
  comments: number;
  likes: number;
  engagement: number;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  logo: string;
  retainer: number;
  status: 'active' | 'paused' | ' churned';
  postsThisMonth: number;
  engagementRate: number;
  followers: number;
  platforms: string[];
}

export interface InboxItem {
  id: string;
  type: 'comment' | 'dm' | 'mention' | 'tag';
  platform: string;
  content: string;
  author: string;
  authorAvatar: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'high_priority';
  status: 'open' | 'resolved';
  timestamp: string;
  client: string;
  lockedBy?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  hoursLogged: number;
  capacity: number;
}

export interface Notification {
  id: string;
  user: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'comment' | 'status_change' | 'file_attach' | 'approval';
}

export interface BrandKit {
  id: string;
  clientId: string;
  clientName: string;
  colors: string[];
  typography: string;
  toneOfVoice: string;
  bannedTerms: string[];
  logoUrl: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video';
  thumbnail: string;
  client: string;
  campaign: string;
  tags: string[];
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  client: string;
  hours: number;
  task: string;
  date: string;
}

// Posts data
export const posts: Post[] = [
  { id: 'p1', title: 'Repost - TikTok Surf Challenge', image: '/assets/kanban_surf.jpg', platform: 'TikTok', status: 'draft', client: 'WaveCo', campaign: 'Summer Vibes', scheduledDate: '2025-04-15T10:00:00', author: 'Sarah Chen', comments: 3, likes: 0, engagement: 0, createdAt: '2025-03-20' },
  { id: 'p2', title: 'Fashion Week Street Style', image: '/assets/kanban_fashion.jpg', platform: 'Instagram', status: 'draft', client: 'LuxeBrand', campaign: 'SS25 Collection', scheduledDate: '2025-04-18T14:00:00', author: 'Mike Dean', comments: 5, likes: 0, engagement: 0, createdAt: '2025-03-21' },
  { id: 'p3', title: 'Behind the Scenes - Photoshoot', platform: 'Instagram', status: 'draft', client: 'LuxeBrand', campaign: 'SS25 Collection', scheduledDate: '2025-04-20T09:00:00', author: 'Sarah Chen', comments: 2, likes: 0, engagement: 0, createdAt: '2025-03-22' },
  { id: 'p4', title: 'Sports Lifestyle Video Edit', image: '/assets/kanban_horse.jpg', platform: 'TikTok', status: 'pending', client: 'FitLife Pro', campaign: 'Move More', scheduledDate: '2025-04-16T12:00:00', author: 'Anita D.', comments: 8, likes: 0, engagement: 0, createdAt: '2025-03-18' },
  { id: 'p5', title: 'Morning Routine Wellness', platform: 'Instagram', status: 'pending', client: 'FitLife Pro', campaign: 'Move More', scheduledDate: '2025-04-17T08:00:00', author: 'Brian M.', comments: 4, likes: 0, engagement: 0, createdAt: '2025-03-19' },
  { id: 'p6', title: 'Unboxing Our New Collection', image: '/assets/kanban_plant.jpg', platform: 'Instagram', status: 'approved', client: 'GreenSpace', campaign: 'Plant Parent', scheduledDate: '2025-04-14T11:00:00', author: 'Leslie W.', comments: 6, likes: 0, engagement: 0, createdAt: '2025-03-15' },
  { id: 'p7', title: 'Product Showcase - Desk Setup', platform: 'LinkedIn', status: 'approved', client: 'GreenSpace', campaign: 'Plant Parent', scheduledDate: '2025-04-14T15:00:00', author: 'Brian M.', comments: 2, likes: 0, engagement: 0, createdAt: '2025-03-16' },
  { id: 'p8', title: 'Limited Time Offer - 24hrs Only', image: '/assets/kanban_burger.jpg', platform: 'Facebook', status: 'scheduled', client: 'BurgerJoint', campaign: 'Flash Sale', scheduledDate: '2025-04-13T18:00:00', author: 'Mike Dean', comments: 1, likes: 0, engagement: 0, createdAt: '2025-03-10' },
  { id: 'p9', title: 'Customer Testimonial Compilation', platform: 'TikTok', status: 'scheduled', client: 'BurgerJoint', campaign: 'Flash Sale', scheduledDate: '2025-04-13T20:00:00', author: 'Sarah Chen', comments: 0, likes: 0, engagement: 0, createdAt: '2025-03-12' },
  { id: 'p10', title: 'Spring Collection Launch', image: '/assets/kanban_flowers.jpg', platform: 'Instagram', status: 'published', client: 'BloomFloral', campaign: 'Spring 2025', scheduledDate: '2025-04-10T09:00:00', author: 'Anita D.', comments: 12, likes: 2340, engagement: 4.2, createdAt: '2025-03-05' },
  { id: 'p11', title: 'Tutorial - How to Arrange', platform: 'TikTok', status: 'published', client: 'BloomFloral', campaign: 'Spring 2025', scheduledDate: '2025-04-08T14:00:00', author: 'Leslie W.', comments: 8, likes: 1890, engagement: 3.8, createdAt: '2025-03-01' },
  { id: 'p12', title: 'Office Plant Care Tips', platform: 'LinkedIn', status: 'published', client: 'GreenSpace', campaign: 'Plant Parent', scheduledDate: '2025-04-05T10:00:00', author: 'Brian M.', comments: 5, likes: 567, engagement: 2.1, createdAt: '2025-02-28' },
];

// Clients data
export const clients: Client[] = [
  { id: 'c1', name: 'WaveCo', industry: 'Lifestyle', logo: 'W', retainer: 8500, status: 'active', postsThisMonth: 24, engagementRate: 5.2, followers: 128000, platforms: ['TikTok', 'Instagram'] },
  { id: 'c2', name: 'LuxeBrand', industry: 'Fashion', logo: 'L', retainer: 12000, status: 'active', postsThisMonth: 18, engagementRate: 3.8, followers: 245000, platforms: ['Instagram', 'LinkedIn'] },
  { id: 'c3', name: 'FitLife Pro', industry: 'Health & Fitness', logo: 'F', retainer: 6500, status: 'active', postsThisMonth: 32, engagementRate: 4.5, followers: 89000, platforms: ['TikTok', 'Instagram', 'YouTube'] },
  { id: 'c4', name: 'GreenSpace', industry: 'Home & Garden', logo: 'G', retainer: 4800, status: 'active', postsThisMonth: 15, engagementRate: 6.1, followers: 67000, platforms: ['Instagram', 'Pinterest'] },
  { id: 'c5', name: 'BurgerJoint', industry: 'Food & Beverage', logo: 'B', retainer: 7200, status: 'active', postsThisMonth: 28, engagementRate: 7.3, followers: 156000, platforms: ['TikTok', 'Instagram', 'Facebook'] },
  { id: 'c6', name: 'BloomFloral', industry: 'Retail', logo: 'B', retainer: 3900, status: 'active', postsThisMonth: 12, engagementRate: 8.2, followers: 45000, platforms: ['Instagram', 'Facebook'] },
];

// Inbox items
export const inboxItems: InboxItem[] = [
  { id: 'i1', type: 'comment', platform: 'Instagram', content: 'This collection is absolutely stunning! When will it be available in stores?', author: 'emma_style', authorAvatar: 'E', sentiment: 'positive', status: 'open', timestamp: '2025-04-13T09:30:00', client: 'LuxeBrand' },
  { id: 'i2', type: 'dm', platform: 'TikTok', content: 'Hey, I ordered last week and still haven\'t received my package. Order #8832.', author: 'jake_m', authorAvatar: 'J', sentiment: 'negative', status: 'open', timestamp: '2025-04-13T08:15:00', client: 'BurgerJoint' },
  { id: 'i3', type: 'mention', platform: 'Instagram', content: '@waveco love the new surf gear! Can\'t wait to try it out this weekend', author: 'surfer_girl_23', authorAvatar: 'S', sentiment: 'positive', status: 'open', timestamp: '2025-04-13T07:45:00', client: 'WaveCo' },
  { id: 'i4', type: 'comment', platform: 'Facebook', content: 'Your prices have gone up way too much. Used to be our go-to spot.', author: 'frank_d', authorAvatar: 'F', sentiment: 'high_priority', status: 'open', timestamp: '2025-04-13T06:20:00', client: 'BurgerJoint' },
  { id: 'i5', type: 'dm', platform: 'Instagram', content: 'Would love to collaborate on a plant care series. I have 500k followers.', author: 'plant_mom', authorAvatar: 'P', sentiment: 'positive', status: 'open', timestamp: '2025-04-12T22:00:00', client: 'GreenSpace' },
  { id: 'i6', type: 'tag', platform: 'TikTok', content: 'Check out my transformation using @fitlifepro! Down 20lbs in 3 months!', author: 'fit_journey', authorAvatar: 'F', sentiment: 'positive', status: 'resolved', timestamp: '2025-04-12T18:30:00', client: 'FitLife Pro' },
  { id: 'i7', type: 'comment', platform: 'LinkedIn', content: 'Great tips on office ergonomics. Would love to see more content like this.', author: 'hr_professional', authorAvatar: 'H', sentiment: 'positive', status: 'resolved', timestamp: '2025-04-12T14:00:00', client: 'GreenSpace' },
  { id: 'i8', type: 'dm', platform: 'Instagram', content: 'The flowers I received were wilted. Very disappointed with the quality.', author: 'angry_customer', authorAvatar: 'A', sentiment: 'high_priority', status: 'open', timestamp: '2025-04-13T10:00:00', client: 'BloomFloral' },
];

// Team members
export const teamMembers: TeamMember[] = [
  { id: 'u1', name: 'Brian McKenzie', role: 'Agency Owner', avatar: 'B', status: 'online', hoursLogged: 32, capacity: 40 },
  { id: 'u2', name: 'Anita D.', role: 'Account Manager', avatar: 'A', status: 'online', hoursLogged: 38, capacity: 40 },
  { id: 'u3', name: 'Mike Dean', role: 'Creator', avatar: 'M', status: 'online', hoursLogged: 36, capacity: 40 },
  { id: 'u4', name: 'Sarah Chen', role: 'Copywriter', avatar: 'S', status: 'away', lastSeen: '10 min ago', hoursLogged: 28, capacity: 35 },
  { id: 'u5', name: 'Leslie Watson', role: 'Community Manager', avatar: 'L', status: 'online', hoursLogged: 34, capacity: 40 },
  { id: 'u6', name: 'David Park', role: 'Designer', avatar: 'D', status: 'offline', lastSeen: '2 hr ago', hoursLogged: 30, capacity: 40 },
];

// Notifications
export const notifications: Notification[] = [
  { id: 'n1', user: 'Brian McKenzie', userAvatar: 'B', action: 'left a comment on', target: 'Sports Lifestyle Video', timestamp: '30 min ago', type: 'comment' },
  { id: 'n2', user: 'Anita D.', userAvatar: 'A', action: 'approved', target: 'Unboxing Our New Collection', timestamp: '45 min ago', type: 'approval' },
  { id: 'n3', user: 'Leslie Watson', userAvatar: 'L', action: 'attached 3 files to', target: 'Spring Campaign', timestamp: '1 hr ago', type: 'file_attach' },
  { id: 'n4', user: 'Mike Dean', userAvatar: 'M', action: 'changed status to "In Review" for', target: 'Fashion Week Street Style', timestamp: '2 hr ago', type: 'status_change' },
  { id: 'n5', user: 'Sarah Chen', userAvatar: 'S', action: 'left a comment on', target: 'Limited Time Offer', timestamp: '3 hr ago', type: 'comment' },
];

// Brand kits
export const brandKits: BrandKit[] = [
  { id: 'bk1', clientId: 'c1', clientName: 'WaveCo', colors: ['#0066CC', '#00CCFF', '#FFFFFF', '#1A1A1A'], typography: 'Montserrat + Open Sans', toneOfVoice: 'Energetic, adventurous, inclusive', bannedTerms: ['cheap', 'discount', 'boring'], logoUrl: '' },
  { id: 'bk2', clientId: 'c2', clientName: 'LuxeBrand', colors: ['#000000', '#D4AF37', '#FFFFFF', '#8B7355'], typography: 'Playfair Display + Lato', toneOfVoice: 'Sophisticated, aspirational, confident', bannedTerms: ['cheap', 'budget', 'sale'], logoUrl: '' },
  { id: 'bk3', clientId: 'c3', clientName: 'FitLife Pro', colors: ['#FF4444', '#222222', '#FFFFFF', '#44FF88'], typography: 'Oswald + Roboto', toneOfVoice: 'Motivational, direct, empowering', bannedTerms: ['lazy', 'easy', 'magic pill'], logoUrl: '' },
  { id: 'bk4', clientId: 'c4', clientName: 'GreenSpace', colors: ['#2D5016', '#8FBC8F', '#FFFFFF', '#F5F5DC'], typography: 'Merriweather + Nunito', toneOfVoice: 'Calm, knowledgeable, nurturing', bannedTerms: ['fake', 'plastic', 'toxic'], logoUrl: '' },
  { id: 'bk5', clientId: 'c5', clientName: 'BurgerJoint', colors: ['#FF6B00', '#FFD700', '#FFFFFF', '#8B0000'], typography: 'Bebas Neue + Arial', toneOfVoice: 'Fun, bold, crave-worthy', bannedTerms: ['bland', 'small', 'overpriced'], logoUrl: '' },
];

// Media assets
export const mediaAssets: MediaAsset[] = [
  { id: 'a1', name: 'Surf Challenge Hero', type: 'video', thumbnail: '/assets/kanban_surf.jpg', client: 'WaveCo', campaign: 'Summer Vibes', tags: ['surf', 'lifestyle', 'hero'], size: '24.5 MB', uploadedAt: '2025-03-20', uploadedBy: 'Mike Dean' },
  { id: 'a2', name: 'Fashion Week BTS', type: 'image', thumbnail: '/assets/kanban_fashion.jpg', client: 'LuxeBrand', campaign: 'SS25 Collection', tags: ['fashion', 'street-style', 'bts'], size: '3.2 MB', uploadedAt: '2025-03-21', uploadedBy: 'Sarah Chen' },
  { id: 'a3', name: 'Sports Lifestyle Edit', type: 'video', thumbnail: '/assets/kanban_horse.jpg', client: 'FitLife Pro', campaign: 'Move More', tags: ['sports', 'lifestyle', 'edit'], size: '45.1 MB', uploadedAt: '2025-03-18', uploadedBy: 'Anita D.' },
  { id: 'a4', name: 'Plant Unboxing', type: 'image', thumbnail: '/assets/kanban_plant.jpg', client: 'GreenSpace', campaign: 'Plant Parent', tags: ['unboxing', 'plant', 'minimal'], size: '2.8 MB', uploadedAt: '2025-03-15', uploadedBy: 'Leslie Watson' },
  { id: 'a5', name: 'Burger Promo', type: 'image', thumbnail: '/assets/kanban_burger.jpg', client: 'BurgerJoint', campaign: 'Flash Sale', tags: ['food', 'promo', 'limited'], size: '4.1 MB', uploadedAt: '2025-03-10', uploadedBy: 'Mike Dean' },
  { id: 'a6', name: 'Spring Flowers', type: 'image', thumbnail: '/assets/kanban_flowers.jpg', client: 'BloomFloral', campaign: 'Spring 2025', tags: ['flowers', 'spring', 'beauty'], size: '3.5 MB', uploadedAt: '2025-03-05', uploadedBy: 'Anita D.' },
];

// Time entries
export const timeEntries: TimeEntry[] = [
  { id: 't1', userId: 'u1', userName: 'Brian McKenzie', client: 'WaveCo', hours: 4.5, task: 'Strategy Review', date: '2025-04-13' },
  { id: 't2', userId: 'u2', userName: 'Anita D.', client: 'LuxeBrand', hours: 6.0, task: 'Campaign Planning', date: '2025-04-13' },
  { id: 't3', userId: 'u3', userName: 'Mike Dean', client: 'BurgerJoint', hours: 5.5, task: 'Video Editing', date: '2025-04-13' },
  { id: 't4', userId: 'u4', userName: 'Sarah Chen', client: 'FitLife Pro', hours: 4.0, task: 'Copywriting', date: '2025-04-13' },
  { id: 't5', userId: 'u5', userName: 'Leslie Watson', client: 'GreenSpace', hours: 7.0, task: 'Community Management', date: '2025-04-13' },
  { id: 't6', userId: 'u6', userName: 'David Park', client: 'BloomFloral', hours: 3.5, task: 'Design Work', date: '2025-04-13' },
  { id: 't7', userId: 'u1', userName: 'Brian McKenzie', client: 'BurgerJoint', hours: 2.0, task: 'Client Call', date: '2025-04-12' },
  { id: 't8', userId: 'u2', userName: 'Anita D.', client: 'WaveCo', hours: 5.0, task: 'Content Review', date: '2025-04-12' },
];

// Platform icons mapping
export const platformConfig: Record<string, { color: string; bg: string }> = {
  Instagram: { color: '#E4405F', bg: '#FCE4EC' },
  TikTok: { color: '#000000', bg: '#F5F5F5' },
  Facebook: { color: '#1877F2', bg: '#E3F2FD' },
  LinkedIn: { color: '#0A66C2', bg: '#E8F0FE' },
  'X': { color: '#000000', bg: '#F5F5F5' },
  YouTube: { color: '#FF0000', bg: '#FFEBEE' },
  Pinterest: { color: '#BD081C', bg: '#FCE4EC' },
};

// Status colors
export const statusConfig: Record<string, { color: string; bg: string; dot: string }> = {
  draft: { color: '#6B7280', bg: '#F3F4F6', dot: '#9CA3AF' },
  pending: { color: '#D97706', bg: '#FEF3C7', dot: '#F59E0B' },
  approved: { color: '#059669', bg: '#D1FAE5', dot: '#10B981' },
  scheduled: { color: '#2563EB', bg: '#DBEAFE', dot: '#3B82F6' },
  published: { color: '#6B7280', bg: '#F3F4F6', dot: '#9CA3AF' },
  failed: { color: '#DC2626', bg: '#FEE2E2', dot: '#EF4444' },
};

// Calendar events
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  color: string;
  client: string;
  platform: string;
}

export const calendarEvents: CalendarEvent[] = [
  { id: 'e1', title: 'Launch Limited Edition', date: '2025-04-14', color: '#EC4899', client: 'LuxeBrand', platform: 'Instagram' },
  { id: 'e2', title: 'Set Up Retargeting Ads', date: '2025-04-14', color: '#6056D3', client: 'BurgerJoint', platform: 'Facebook' },
  { id: 'e3', title: 'Post Unboxing Stories', date: '2025-04-15', color: '#6056D3', client: 'GreenSpace', platform: 'Instagram' },
  { id: 'e4', title: 'Create Teaser Poll', date: '2025-04-15', color: '#10B981', client: 'WaveCo', platform: 'TikTok' },
  { id: 'e5', title: 'Behind the Scenes', date: '2025-04-16', color: '#F59E0B', client: 'FitLife Pro', platform: 'Instagram' },
  { id: 'e6', title: 'Product Feature Reel', date: '2025-04-17', color: '#EC4899', client: 'BloomFloral', platform: 'Instagram' },
  { id: 'e7', title: 'Weekend Vibes Post', date: '2025-04-18', color: '#3B82F6', client: 'WaveCo', platform: 'TikTok' },
  { id: 'e8', title: 'Flash Sale Reminder', date: '2025-04-19', color: '#EF4444', client: 'BurgerJoint', platform: 'Facebook' },
];
