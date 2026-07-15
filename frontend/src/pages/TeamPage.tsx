import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Search, Mail, Shield, ShieldCheck, X, Lock } from 'lucide-react';
import api from '../api/client';
import { useAuthStore } from '../stores/authStore';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string | null;
  lastSeen: string | null;
  createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  ACCOUNT_MANAGER: 'Account Manager',
  CREATOR: 'Creator',
  COPYWRITER: 'Copywriter',
  LEGAL_REVIEWER: 'Legal Reviewer',
  CLIENT_STAKEHOLDER: 'Client Stakeholder',
};

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '', role: 'CREATOR' });
  const [inviteError, setInviteError] = useState('');
  
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);
  const [availableClients, setAvailableClients] = useState<any[]>([]);
  const [assignedWorkspaceIds, setAssignedWorkspaceIds] = useState<string[]>([]);
  const [savingAccess, setSavingAccess] = useState(false);

  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ACCOUNT_MANAGER';

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await api.get('/team');
      setTeam(res.data.team || []);
    } catch (error) {
      console.error('Failed to fetch team', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteData.name.trim() || !inviteData.email.trim()) return;
    setInviting(true);
    setInviteError('');
    try {
      await api.post('/team', inviteData);
      setShowInviteModal(false);
      setInviteData({ name: '', email: '', role: 'CREATOR' });
      fetchTeam();
    } catch (error: any) {
      setInviteError(error.response?.data?.error || 'Failed to invite team member');
    } finally {
      setInviting(false);
    }
  };

  const openAccessModal = async (member: TeamMember) => {
    setSelectedUser(member);
    setShowAccessModal(true);
    setAssignedWorkspaceIds([]);
    try {
      const [clientsRes, assignmentsRes] = await Promise.all([
        api.get('/clients'),
        api.get(`/workspaces/assignments/${member.id}`)
      ]);
      setAvailableClients(clientsRes.data.clients || []);
      
      const assignedIds = (assignmentsRes.data.assignments || []).map((a: any) => a.workspaceId);
      setAssignedWorkspaceIds(assignedIds);
    } catch (error) {
      console.error('Failed to load access data', error);
    }
  };

  const handleSaveAccess = async () => {
    if (!selectedUser) return;
    setSavingAccess(true);
    try {
      await api.put(`/workspaces/assignments/${selectedUser.id}`, {
        workspaceIds: assignedWorkspaceIds
      });
      setShowAccessModal(false);
    } catch (error) {
      console.error('Failed to save access', error);
    } finally {
      setSavingAccess(false);
    }
  };

  const toggleWorkspace = (workspaceId: string) => {
    setAssignedWorkspaceIds(prev => 
      prev.includes(workspaceId) 
        ? prev.filter(id => id !== workspaceId)
        : [...prev, workspaceId]
    );
  };

  const filteredTeam = team.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 page-enter relative z-10">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Team Directory</h1>
          <p className="text-gray-400 mt-2 text-sm">Manage your agency team members and their roles.</p>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="glass-btn px-4 py-2.5 rounded-xl text-white font-medium flex items-center gap-2 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        )}
      </div>

      <div className="glass-card p-3 rounded-2xl flex gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search team members by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-primary animate-spin"></div>
        </div>
      ) : filteredTeam.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center border-dashed border-white/20">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">
            {searchQuery ? 'No members match your search' : 'No team members yet'}
          </h3>
          <p className="text-gray-400">
            {searchQuery ? 'Try adjusting your search term.' : 'Invite your first team member to collaborate.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeam.map((member, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={member.id}
              className="glass-card rounded-2xl p-6 hover:-translate-y-1 hover:border-primary/30 transition-all group relative overflow-hidden text-center"
            >
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto bg-white/5 border border-white/10 text-white rounded-full flex items-center justify-center font-bold text-3xl group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30 transition-colors shadow-inner mb-4 relative">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    member.name.substring(0, 1).toUpperCase()
                  )}
                  <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-[#0B0C15] ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
                
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-4 bg-white/5 mx-auto w-max px-3 py-1 rounded-full border border-white/5">
                  {member.role === 'ADMIN' ? <ShieldCheck className="w-3.5 h-3.5 text-primary" /> : <Shield className="w-3.5 h-3.5" />}
                  {ROLE_LABELS[member.role] || member.role}
                </div>

                <div className="flex items-center justify-center text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer mb-4">
                  <Mail className="w-4 h-4 mr-2" />
                  {member.email}
                </div>

                {isAdmin && (
                  <button 
                    onClick={() => openAccessModal(member)}
                    className="w-full py-2 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Manage Access
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowInviteModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-dark border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">Invite Team Member</h2>
                <button onClick={() => setShowInviteModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleInvite} className="p-6 space-y-5">
                {inviteError && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive-foreground px-4 py-3 rounded-xl text-sm">
                    {inviteError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={inviteData.name}
                    onChange={(e) => setInviteData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={inviteData.email}
                    onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. jane@agency.com"
                    className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Role *</label>
                  <select
                    value={inviteData.role}
                    onChange={(e) => setInviteData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-3 glass-input rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all [&>option]:bg-[#0f1120]"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="ACCOUNT_MANAGER">Account Manager</option>
                    <option value="CREATOR">Creator</option>
                    <option value="COPYWRITER">Copywriter</option>
                    <option value="LEGAL_REVIEWER">Legal Reviewer</option>
                    <option value="CLIENT_STAKEHOLDER">Client Stakeholder</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-5 py-2.5 text-gray-400 font-medium hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="glass-btn px-6 py-2.5 text-white font-medium rounded-xl disabled:opacity-50"
                  >
                    {inviting ? 'Inviting...' : 'Send Invite'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Access Management Modal */}
      <AnimatePresence>
        {showAccessModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAccessModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-dark border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <div>
                  <h2 className="text-xl font-bold text-white">Manage Access</h2>
                  <p className="text-sm text-gray-400 mt-1">{selectedUser.name}</p>
                </div>
                <button onClick={() => setShowAccessModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {availableClients.length === 0 ? (
                  <p className="text-gray-400 text-sm">No client workspaces available to assign.</p>
                ) : (
                  availableClients.map(client => {
                    const workspace = client.workspaces?.[0];
                    if (!workspace) return null;
                    const isAssigned = assignedWorkspaceIds.includes(workspace.id);
                    
                    return (
                      <div 
                        key={client.id}
                        onClick={() => toggleWorkspace(workspace.id)}
                        className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isAssigned 
                            ? 'bg-primary/10 border-primary/50 text-white' 
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-xs opacity-70 mt-0.5">{client.industry}</div>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isAssigned ? 'bg-primary border-primary text-white' : 'border-gray-500'
                        }`}>
                          {isAssigned && <ShieldCheck className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-white/5 bg-black/20">
                <button
                  onClick={() => setShowAccessModal(false)}
                  className="px-5 py-2.5 text-gray-400 font-medium hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAccess}
                  disabled={savingAccess}
                  className="glass-btn px-6 py-2.5 text-white font-medium rounded-xl disabled:opacity-50 flex items-center gap-2"
                >
                  {savingAccess ? 'Saving...' : 'Save Access'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
