import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Bell, Shield, Palette, Link as LinkIcon, Save, Check
} from 'lucide-react';

const settingSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: LinkIcon },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and platform preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {settingSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-left text-sm font-medium transition-colors
                  ${activeSection === section.id ? 'bg-[#6056D3]/5 text-[#6056D3] border-l-2 border-[#6056D3]' : 'text-gray-600 hover:bg-gray-50 border-l-2 border-transparent'}`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-xl border border-gray-200">
            {/* Profile Settings */}
            {activeSection === 'profile' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>

                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6056D3] to-[#8B7FE8] flex items-center justify-center text-white text-2xl font-bold">
                    BM
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-[#6056D3] text-white rounded-lg text-sm font-medium hover:bg-[#4C45A8] transition-colors">
                      Change Avatar
                    </button>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                    <input type="text" defaultValue="Brian" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6056D3]/20 focus:border-[#6056D3]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                    <input type="text" defaultValue="McKenzie" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6056D3]/20 focus:border-[#6056D3]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input type="email" defaultValue="brian@socialsync.agency" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6056D3]/20 focus:border-[#6056D3]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                    <input type="text" defaultValue="Agency Owner" disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                    <textarea rows={3} defaultValue="Social media agency owner with 8+ years of experience. Passionate about data-driven marketing." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6056D3]/20 focus:border-[#6056D3] resize-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'New approval requests', desc: 'Get notified when a post needs your approval', checked: true },
                    { label: 'Post published', desc: 'Get notified when a post goes live', checked: true },
                    { label: 'High priority inbox items', desc: 'Get notified for negative sentiment or PR risk', checked: true },
                    { label: 'Team mentions', desc: 'Get notified when someone mentions you', checked: false },
                    { label: 'Weekly reports', desc: 'Receive weekly performance summaries', checked: true },
                    { label: 'Scope creep alerts', desc: 'Get notified when clients exceed budget', checked: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#6056D3]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6056D3]" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                    <input type="password" defaultValue="********" className="w-full max-w-sm px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6056D3]/20 focus:border-[#6056D3]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                    <input type="password" placeholder="Enter new password" className="w-full max-w-sm px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6056D3]/20 focus:border-[#6056D3]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Two-Factor Authentication</label>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-lg font-medium">Enabled</span>
                      <button className="text-sm text-[#6056D3] hover:underline">Configure</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Login Sessions</label>
                    <div className="bg-gray-50 rounded-lg p-4 max-w-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Session</p>
                          <p className="text-xs text-gray-500">Chrome on macOS · San Francisco, CA</p>
                        </div>
                        <span className="text-xs text-green-600 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeSection === 'appearance' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Appearance</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                    <div className="flex gap-3">
                      {['Light', 'Dark', 'System'].map((theme) => (
                        <button
                          key={theme}
                          className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors
                            ${theme === 'Light' ? 'bg-[#6056D3] text-white border-[#6056D3]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Sidebar Accent Color</label>
                    <div className="flex gap-3">
                      {['#6056D3', '#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#EF4444'].map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${color === '#6056D3' ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Density</label>
                    <div className="flex gap-3">
                      {['Compact', 'Default', 'Comfortable'].map((density) => (
                        <button
                          key={density}
                          className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors
                            ${density === 'Default' ? 'bg-[#6056D3] text-white border-[#6056D3]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                        >
                          {density}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations */}
            {activeSection === 'integrations' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Connected Platforms</h2>
                <div className="space-y-4">
                  {[
                    { name: 'Instagram', status: 'connected', accounts: 6 },
                    { name: 'Facebook', status: 'connected', accounts: 4 },
                    { name: 'TikTok', status: 'connected', accounts: 5 },
                    { name: 'LinkedIn', status: 'connected', accounts: 3 },
                    { name: 'X (Twitter)', status: 'disconnected', accounts: 0 },
                    { name: 'Canva', status: 'connected', accounts: 1 },
                    { name: 'Slack', status: 'connected', accounts: 1 },
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
                          {integration.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                          <p className="text-xs text-gray-500">
                            {integration.status === 'connected'
                              ? `${integration.accounts} account${integration.accounts > 1 ? 's' : ''} connected`
                              : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <button
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                          ${integration.status === 'connected'
                            ? 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                            : 'bg-[#6056D3] text-white hover:bg-[#4C45A8]'}`}
                      >
                        {integration.status === 'connected' ? 'Manage' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Save */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-green-600 flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Saved successfully
                </motion.span>
              )}
              <div className="ml-auto">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#6056D3] text-white rounded-lg text-sm font-medium hover:bg-[#4C45A8] transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
