import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { Users, FileText, CheckCircle, TrendingUp, ArrowUpRight, Activity } from 'lucide-react';
import api from '../api/client';

interface DashboardPost {
  id: string;
  title: string;
  status: string;
  platform: string;
  scheduledTime: string | null;
  campaign: { client: { name: string } } | null;
}

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-white/10', text: 'text-gray-300', label: 'Draft' },
  in_review_internal: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Internal Review' },
  in_review_client: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'Client Review' },
  approved: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Approved' },
  published: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Published' },
  needs_revision: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Needs Revision' },
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [upcomingPosts, setUpcomingPosts] = useState<DashboardPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, postsRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/posts'),
      ]);

      const { stats: fetchedStats, recentActivity } = dashboardRes.data;
      
      setStats([
        { label: 'Active Clients', value: fetchedStats.activeClients.toString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/20', trend: 'Current total' },
        { label: 'Posts Scheduled', value: fetchedStats.postsScheduled.toString(), icon: FileText, color: 'text-primary', bg: 'bg-primary/20', trend: 'Approved & Scheduled' },
        { label: 'Pending Approvals', value: fetchedStats.pendingApprovals.toString(), icon: CheckCircle, color: 'text-orange-400', bg: 'bg-orange-400/20', trend: 'Requires attention' },
        { label: 'Engagement Rate', value: fetchedStats.engagementRate, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/20', trend: 'Overall average' },
      ]);
      setActivity(recentActivity);

      // Get upcoming (non-published) posts
      const allPosts = postsRes.data.posts || [];
      setUpcomingPosts(allPosts.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 page-enter relative z-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-gray-400 mt-2 text-sm">Here's what's happening across your agency today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1 relative z-10 tabular-nums">{stat.value}</h3>
            <p className="text-gray-400 text-sm font-medium relative z-10">{stat.label}</p>
            <p className="text-xs text-gray-500 mt-3 relative z-10">{stat.trend}</p>
            
            <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 opacity-50`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-white">Upcoming Content</h2>
          </div>
          
          <div className="space-y-2">
            {upcomingPosts.length === 0 ? (
              <div className="text-center py-12 rounded-xl border border-dashed border-white/10">
                <p className="text-gray-400 text-sm">No posts yet. Create your first post in the Content Hub.</p>
              </div>
            ) : (
              upcomingPosts.map((post) => {
                const badge = STATUS_BADGE[post.status] || STATUS_BADGE.draft;
                return (
                  <div key={post.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-xs font-bold text-gray-400 group-hover:text-primary">{post.platform?.substring(0, 3).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{post.title}</h4>
                      <p className="text-sm text-gray-400">
                        {post.campaign?.client?.name || 'Unassigned'}
                        {post.scheduledTime && ` • ${new Date(post.scheduledTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`}
                      </p>
                    </div>
                    <span className={`px-3 py-1 ${badge.bg} ${badge.text} text-xs font-bold rounded-full whitespace-nowrap`}>
                      {badge.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
          </div>
          
          <div className="space-y-6">
            {activity.length === 0 ? (
              <div className="text-center py-12 rounded-xl border border-dashed border-white/10">
                <p className="text-gray-400 text-sm">No recent activity.</p>
              </div>
            ) : (
              activity.map((act: any, i: number) => (
                <div key={i} className="flex gap-4 relative group">
                  {i !== activity.length - 1 && <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-white/5 group-hover:bg-primary/20 transition-colors" />}
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 z-10 border border-white/5 group-hover:border-primary/30 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm text-gray-200 leading-snug">{act.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{act.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
