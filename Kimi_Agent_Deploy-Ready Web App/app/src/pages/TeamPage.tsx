import { motion } from 'framer-motion';
import {
  Users, Clock, TrendingUp, AlertTriangle, Plus
} from 'lucide-react';
import { teamMembers, timeEntries } from '../data/demoData';

export default function TeamPage() {
  const totalHours = timeEntries.reduce((sum, t) => sum + t.hours, 0);
  const totalCapacity = teamMembers.reduce((sum, m) => sum + m.capacity, 0);
  const utilization = ((totalHours / totalCapacity) * 100).toFixed(0);

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-500 text-sm mt-1">Capacity planning and team management.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#6056D3] text-white rounded-lg text-sm font-medium hover:bg-[#4C45A8] transition-all hover:-translate-y-0.5 shadow-sm">
          <Plus className="w-4 h-4" /> Invite Member
        </button>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Team Size', value: teamMembers.length.toString(), icon: Users, color: '#6056D3' },
          { label: 'Hours Logged Today', value: totalHours.toFixed(1), icon: Clock, color: '#10B981' },
          { label: 'Utilization', value: `${utilization}%`, icon: TrendingUp, color: '#3B82F6' },
          { label: 'At Capacity', value: '2', icon: AlertTriangle, color: '#F59E0B' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-200"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Team Members</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {teamMembers.map((member, i) => {
              const utilizationPct = (member.hoursLogged / member.capacity) * 100;
              const isOverCapacity = utilizationPct > 90;

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#6056D3] to-[#8B7FE8] flex items-center justify-center text-white font-bold text-sm">
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white
                      ${member.status === 'online' ? 'bg-green-400' : member.status === 'away' ? 'bg-amber-400' : 'bg-gray-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <span className="text-xs text-gray-400">{member.role}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">
                        {member.status === 'online' ? 'Online' : member.lastSeen || 'Offline'}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className={`text-xs font-medium ${isOverCapacity ? 'text-red-500' : 'text-gray-500'}`}>
                        {member.hoursLogged}h / {member.capacity}h
                      </span>
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">{utilizationPct.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(utilizationPct, 100)}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                        className={`h-full rounded-full ${isOverCapacity ? 'bg-red-400' : utilizationPct > 75 ? 'bg-amber-400' : 'bg-[#6056D3]'}`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Time Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Today's Time Log</h2>
          </div>
          <div className="p-4 space-y-3">
            {timeEntries.slice(0, 6).map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6056D3] to-[#8B7FE8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {entry.userName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{entry.task}</p>
                  <p className="text-xs text-gray-500">{entry.client}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{entry.hours}h</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
