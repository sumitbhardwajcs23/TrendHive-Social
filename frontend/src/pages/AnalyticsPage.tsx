import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Heart, MessageCircle, Eye } from 'lucide-react';
import api from '../api/client';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics/dashboard');
      setStats(res.data.stats);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    } finally {
      setLoading(false);
    }
  };

  const platforms = [
    { name: 'Instagram', reach: 45000, engagement: '5.2%', color: 'bg-pink-500' },
    { name: 'TikTok', reach: 82000, engagement: '8.4%', color: 'bg-black' },
    { name: 'LinkedIn', reach: 12000, engagement: '3.1%', color: 'bg-blue-600' },
    { name: 'Twitter / X', reach: 28000, engagement: '4.7%', color: 'bg-gray-800' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 page-enter relative z-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics & Reports</h1>
          <p className="text-gray-400 mt-2 text-sm">Track performance across all clients and platforms.</p>
        </div>
        
        <div className="bg-white/5 rounded-xl p-1 flex">
          {['7d', '30d', '90d', '1y'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-primary animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400"><Eye className="w-5 h-5" /></div>
                <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3 mr-1" /> +12%</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1 relative z-10 tabular-nums">167K</h3>
              <p className="text-gray-400 text-sm font-medium relative z-10">Total Reach</p>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 opacity-50" />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 rounded-xl bg-pink-500/20 text-pink-400"><Heart className="w-5 h-5" /></div>
                <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3 mr-1" /> +8%</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1 relative z-10 tabular-nums">24.5K</h3>
              <p className="text-gray-400 text-sm font-medium relative z-10">Total Engagement</p>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 opacity-50" />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400"><Users className="w-5 h-5" /></div>
                <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3 mr-1" /> +5%</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1 relative z-10 tabular-nums">12.8K</h3>
              <p className="text-gray-400 text-sm font-medium relative z-10">Audience Growth</p>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 opacity-50" />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400"><TrendingUp className="w-5 h-5" /></div>
                <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3 mr-1" /> +2%</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1 relative z-10 tabular-nums">{stats?.engagementRate || '4.8%'}</h3>
              <p className="text-gray-400 text-sm font-medium relative z-10">Avg. Engagement Rate</p>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 opacity-50" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-6">Platform Breakdown</h2>
              <div className="space-y-6">
                {platforms.map((platform) => (
                  <div key={platform.name}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-gray-200">{platform.name}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white">{platform.reach.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 ml-2">Reach</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                      <div className={`h-full ${platform.color} rounded-full`} style={{ width: `${(platform.reach / 82000) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card rounded-2xl p-6">
               <h2 className="text-lg font-bold text-white mb-6">Recent Top Performing Posts</h2>
               <div className="space-y-4">
                 {[1, 2, 3].map((item) => (
                   <div key={item} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer group">
                     <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                       <span className="text-xs font-bold text-gray-400 group-hover:text-primary">IG</span>
                     </div>
                     <div className="flex-1 min-w-0">
                       <h4 className="font-medium text-white truncate text-sm">Summer Campaign {item}</h4>
                       <p className="text-xs text-gray-400">Published 2 days ago</p>
                     </div>
                     <div className="flex items-center gap-4 text-gray-400 text-sm">
                       <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> 1.2k</span>
                       <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> 84</span>
                     </div>
                   </div>
                 ))}
               </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
