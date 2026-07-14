import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3,
  AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, ResponsiveContainer
} from 'recharts';
import { clients, timeEntries } from '../data/demoData';

const engagementData = [
  { name: 'Jan', WaveCo: 4.2, LuxeBrand: 3.5, FitLife: 3.8, GreenSpace: 5.1, BurgerJoint: 6.2 },
  { name: 'Feb', WaveCo: 4.5, LuxeBrand: 3.2, FitLife: 4.1, GreenSpace: 5.8, BurgerJoint: 6.5 },
  { name: 'Mar', WaveCo: 4.8, LuxeBrand: 3.8, FitLife: 4.5, GreenSpace: 6.1, BurgerJoint: 7.1 },
  { name: 'Apr', WaveCo: 5.2, LuxeBrand: 3.8, FitLife: 4.5, GreenSpace: 6.1, BurgerJoint: 7.3 },
];

const profitabilityData = clients.map(c => {
  const clientHours = timeEntries.filter(t => t.client === c.name).reduce((sum, t) => sum + t.hours, 0);
  const cost = clientHours * 85; // $85/hour
  const profit = c.retainer - cost;
  const margin = ((profit / c.retainer) * 100).toFixed(1);
  return {
    name: c.name,
    retainer: c.retainer,
    cost,
    profit,
    margin: parseFloat(margin),
    hours: clientHours,
  };
});

const COLORS = ['#6056D3', '#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'];

export default function AnalyticsPage() {
  const totalRetainer = profitabilityData.reduce((sum, c) => sum + c.retainer, 0);
  const totalProfit = profitabilityData.reduce((sum, c) => sum + c.profit, 0);
  const avgMargin = ((totalProfit / totalRetainer) * 100).toFixed(1);
  const scopeCreepClients = profitabilityData.filter(c => c.margin < 20);

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Agency performance and profitability metrics.</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Monthly Revenue', value: `$${(totalRetainer / 1000).toFixed(1)}k`, change: '+8%', icon: DollarSign, color: '#6056D3', trend: 'up' },
          { label: 'Net Profit', value: `$${(totalProfit / 1000).toFixed(1)}k`, change: '+12%', icon: TrendingUp, color: '#10B981', trend: 'up' },
          { label: 'Avg Margin', value: `${avgMargin}%`, change: '-2%', icon: BarChart3, color: '#F59E0B', trend: 'down' },
          { label: 'Scope Creep Alerts', value: scopeCreepClients.length.toString(), change: '', icon: AlertTriangle, color: '#EF4444', trend: 'neutral' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
            className="bg-white rounded-xl border border-gray-200 p-5 transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              {card.change && (
                <span className={`text-xs font-medium flex items-center gap-0.5
                  ${card.trend === 'up' ? 'text-green-600' : card.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                  {card.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {card.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Engagement Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="font-semibold text-gray-900 mb-6">Engagement Rate Trends</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={engagementData}>
              <defs>
                {['WaveCo', 'LuxeBrand', 'FitLife', 'GreenSpace', 'BurgerJoint'].map((key, i) => (
                  <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} unit="%" />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Area type="monotone" dataKey="WaveCo" stroke={COLORS[0]} fill={`url(#colorWaveCo)`} strokeWidth={2} />
              <Area type="monotone" dataKey="BurgerJoint" stroke={COLORS[4]} fill={`url(#colorBurgerJoint)`} strokeWidth={2} />
              <Area type="monotone" dataKey="GreenSpace" stroke={COLORS[3]} fill={`url(#colorGreenSpace)`} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Profitability by Client */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="font-semibold text-gray-900 mb-6">Profitability by Client</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={profitabilityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} width={80} />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
              />
              <Bar dataKey="retainer" fill="#E5E7EB" radius={[0, 4, 4, 0]} barSize={16} name="Retainer" />
              <Bar dataKey="profit" fill="#6056D3" radius={[0, 4, 4, 0]} barSize={16} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Client Profitability Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Client Profitability Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Client</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Monthly Retainer</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Hours Logged</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Cost (@$85/hr)</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Profit</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Margin</th>
                <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {profitabilityData.map((client, i) => {
                const isCreep = client.margin < 20;
                return (
                  <motion.tr
                    key={client.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 + i * 0.03 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{client.name}</td>
                    <td className="px-6 py-4 text-right text-gray-700">${client.retainer.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-gray-700">{client.hours}h</td>
                    <td className="px-6 py-4 text-right text-gray-700">${client.cost.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">${client.profit.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-medium ${isCreep ? 'text-red-600' : 'text-green-600'}`}>
                        {client.margin}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isCreep ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 text-red-600 px-2 py-1 rounded-full">
                          <AlertTriangle className="w-3 h-3" /> Scope Creep
                        </span>
                      ) : (
                        <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-1 rounded-full">Healthy</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
