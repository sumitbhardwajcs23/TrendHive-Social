import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, CreditCard, User, Bell, Globe, Save } from 'lucide-react';
import api from '../api/client';
import { useAuthStore } from '../stores/authStore';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('agency');
  const [_, setAgency] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const [formData, setFormData] = useState({
    name: '',
    customDomain: '',
    planTier: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setAgency(res.data.agency);
      setFormData({
        name: res.data.agency.name || '',
        customDomain: res.data.agency.customDomain || '',
        planTier: res.data.agency.planTier || 'starter'
      });
    } catch (error) {
      console.error('Failed to fetch settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSaving(true);
    try {
      await api.put('/settings', formData);
      fetchSettings(); // Refresh
    } catch (error) {
      console.error('Failed to update settings', error);
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: 'agency', label: 'Agency Profile', icon: Building, roles: ['ADMIN'] },
    { id: 'personal', label: 'Personal Settings', icon: User, roles: ['ADMIN', 'ACCOUNT_MANAGER', 'CREATOR', 'COPYWRITER', 'LEGAL_REVIEWER'] },
    { id: 'notifications', label: 'Notifications', icon: Bell, roles: ['ADMIN', 'ACCOUNT_MANAGER', 'CREATOR', 'COPYWRITER', 'LEGAL_REVIEWER'] },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard, roles: ['ADMIN'] },
  ];

  const visibleTabs = TABS.filter(t => t.roles.includes(user?.role || ''));

  return (
    <div className="max-w-6xl mx-auto space-y-6 page-enter relative z-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-gray-400 mt-2 text-sm">Manage your agency preferences and account settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-2 flex-shrink-0">
          {visibleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(126,105,241,0.15)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary' : ''}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {loading ? (
             <div className="flex justify-center p-12">
               <div className="w-8 h-8 rounded-full border-4 border-white/10 border-t-primary animate-spin"></div>
             </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="glass-card rounded-2xl border border-white/5 p-8"
            >
              {activeTab === 'agency' && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="mb-6 border-b border-white/5 pb-6">
                    <h2 className="text-xl font-bold text-white mb-1">Agency Profile</h2>
                    <p className="text-sm text-gray-400">Update your agency's public profile and branding.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Agency Name</label>
                      <input
                        type="text"
                        disabled={!isAdmin}
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 glass-input rounded-xl text-white disabled:opacity-50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Custom Domain</label>
                      <div className="relative">
                        <Globe className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          disabled={!isAdmin}
                          value={formData.customDomain}
                          onChange={(e) => setFormData(prev => ({ ...prev, customDomain: e.target.value }))}
                          placeholder="app.youragency.com"
                          className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-white disabled:opacity-50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="pt-6 border-t border-white/5 flex justify-end">
                      <button 
                        type="submit" 
                        disabled={saving}
                        className="glass-btn px-6 py-2.5 text-white font-medium rounded-xl flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </form>
              )}

              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div className="mb-6 border-b border-white/5 pb-6">
                    <h2 className="text-xl font-bold text-white mb-1">Personal Settings</h2>
                    <p className="text-sm text-gray-400">Manage your personal account details.</p>
                  </div>
                  
                  <div className="flex items-center gap-6 mb-8">
                     <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center text-3xl font-bold border border-primary/30">
                        {user?.name?.charAt(0)}
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-white">{user?.name}</h3>
                       <p className="text-sm text-gray-400">{user?.email}</p>
                       <span className="inline-block mt-2 px-2 py-0.5 bg-white/10 rounded text-xs text-gray-300 border border-white/5">{user?.role}</span>
                     </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 italic">Personal settings editing is disabled in this demo.</p>
                </div>
              )}
              
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div className="mb-6 border-b border-white/5 pb-6">
                    <h2 className="text-xl font-bold text-white mb-1">Billing & Plans</h2>
                    <p className="text-sm text-gray-400">Manage your subscription and billing details.</p>
                  </div>
                  
                  <div className="glass-dark border border-primary/30 p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 bg-primary/20 rounded-bl-xl border-b border-l border-primary/30">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">Current Plan</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white capitalize mb-2">{formData.planTier}</h3>
                    <p className="text-gray-400 text-sm mb-6">You are currently on the {formData.planTier} plan. Upgrade to unlock more features and higher limits.</p>
                    
                    <button className="px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                      Upgrade Plan
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="mb-6 border-b border-white/5 pb-6">
                    <h2 className="text-xl font-bold text-white mb-1">Notification Preferences</h2>
                    <p className="text-sm text-gray-400">Choose what you want to be notified about.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {['Email Notifications', 'Push Notifications', 'Slack Integration', 'Daily Digest'].map(item => (
                      <div key={item} className="flex justify-between items-center p-4 glass-dark rounded-xl border border-white/5">
                        <span className="text-gray-200 font-medium">{item}</span>
                        <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer border border-primary/30">
                           <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
