import { motion } from 'framer-motion';
import {
  TrendingUp, Users, FileText, DollarSign, Instagram,
  Facebook, Linkedin, Youtube, ExternalLink
} from 'lucide-react';
import { clients } from '../data/demoData';

const platformIcons: Record<string, React.ElementType> = {
  Instagram,
  Facebook,
  LinkedIn: Linkedin,
  TikTok: FileText,
  YouTube: Youtube,
  Pinterest: ExternalLink,
};

export default function ClientsPage() {
  const totalRetainer = clients.reduce((sum, c) => sum + c.retainer, 0);
  const avgEngagement = (clients.reduce((sum, c) => sum + c.engagementRate, 0) / clients.length).toFixed(1);
  const totalFollowers = clients.reduce((sum, c) => sum + c.followers, 0);

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your client relationships and performance.</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Clients', value: clients.length.toString(), icon: Users, color: '#6056D3' },
          { label: 'Monthly Retainer', value: `$${(totalRetainer / 1000).toFixed(1)}k`, icon: DollarSign, color: '#10B981' },
          { label: 'Avg Engagement', value: `${avgEngagement}%`, icon: TrendingUp, color: '#F59E0B' },
          { label: 'Total Reach', value: `${(totalFollowers / 1000).toFixed(0)}k`, icon: FileText, color: '#3B82F6' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
            className="bg-white rounded-xl border border-gray-200 p-5 transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, boxShadow: '0 12px 48px rgba(0,0,0,0.08)' }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 cursor-pointer group"
          >
            {/* Header Banner */}
            <div className="h-20 bg-gradient-to-r from-[#6056D3] to-[#8B7FE8] relative">
              <div className="absolute -bottom-6 left-5">
                <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center text-xl font-bold text-[#6056D3]">
                  {client.logo}
                </div>
              </div>
            </div>

            <div className="pt-8 pb-5 px-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#6056D3] transition-colors">{client.name}</h3>
                  <p className="text-sm text-gray-500">{client.industry}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                  ${client.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {client.status}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mt-5 py-4 border-t border-gray-100">
                <div>
                  <p className="text-lg font-bold text-gray-900">{client.engagementRate}%</p>
                  <p className="text-xs text-gray-500">Engagement</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{(client.followers / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{client.postsThisMonth}</p>
                  <p className="text-xs text-gray-500">Posts/mo</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  {client.platforms.map((platform) => {
                    const Icon = platformIcons[platform] || FileText;
                    return (
                      <div key={platform} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center" title={platform}>
                        <Icon className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    );
                  })}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">${(client.retainer / 1000).toFixed(1)}k<span className="text-gray-400 font-normal">/mo</span></p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
