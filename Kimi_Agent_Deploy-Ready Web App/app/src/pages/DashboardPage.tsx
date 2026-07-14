import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, FileText, AlertCircle, Calendar, ChevronRight
} from 'lucide-react';
import { posts, clients, notifications } from '../data/demoData';

const kpiCards = [
  { label: 'Scheduled Posts', value: '104', change: '+12%', trend: 'up', icon: Calendar, color: '#6056D3' },
  { label: 'Publish Now', value: '24', change: '+2%', trend: 'up', icon: FileText, color: '#10B981' },
  { label: 'Pending Approval', value: '12', change: '-2%', trend: 'down', icon: AlertCircle, color: '#F59E0B' },
  { label: 'Failed Posts', value: '0', change: '0%', trend: 'neutral', icon: AlertCircle, color: '#EF4444' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } }
};

export default function DashboardPage() {
  const recentPosts = posts.slice(0, 5);
  const activeClients = clients.filter(c => c.status === 'active');

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Brian. Here's what's happening today.</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {kpiCards.map((card) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
            className="bg-white rounded-xl border border-gray-200 p-5 transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
                ${card.trend === 'up' ? 'bg-green-50 text-green-600' : card.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                {card.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : card.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                {card.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-200"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Posts</h2>
            <button className="text-[#6056D3] text-sm font-medium hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer group"
              >
                {post.image ? (
                  <img src={post.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#6056D3] transition-colors">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{post.client}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500">{post.platform}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                    ${post.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                      post.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                      post.status === 'approved' ? 'bg-green-50 text-green-600' :
                      post.status === 'scheduled' ? 'bg-blue-50 text-blue-600' :
                      'bg-gray-100 text-gray-500'}`}>
                    {post.status}
                  </span>
                  {post.engagement > 0 && (
                    <span className="text-xs text-gray-500">{post.engagement}% eng.</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="bg-white rounded-xl border border-gray-200"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Activity</h2>
            </div>
            <div className="p-4 space-y-3">
              {notifications.slice(0, 4).map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#6056D3] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {notif.userAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">{notif.user}</span>{' '}
                      {notif.action}{' '}
                      <span className="font-medium text-gray-900">{notif.target}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{notif.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Client Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-white rounded-xl border border-gray-200"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Client Health</h2>
            </div>
            <div className="p-4 space-y-3">
              {activeClients.slice(0, 4).map((client, i) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6056D3] to-[#8B7FE8] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {client.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.postsThisMonth} posts this month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{client.engagementRate}%</p>
                    <p className="text-xs text-gray-500">eng. rate</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
