import { useAuthStore } from '../../stores/authStore';
import { motion } from 'framer-motion';
import { User, Building, Mail, MapPin } from 'lucide-react';

export default function ClientProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8 page-enter relative z-10 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Profile Overview</h1>
        <p className="text-gray-400 mt-2 text-sm">View your personal and company details.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-2xl border border-white/10"
      >
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50 shadow-[0_0_15px_rgba(96,86,211,0.3)]">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-primary mt-1 font-medium">{user?.role === 'CLIENT_STAKEHOLDER' ? 'Client Partner' : user?.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-white">{user?.email || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Company Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-500" />
                  <span className="text-white">TrendHive Partner</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-400 italic">Address details pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
