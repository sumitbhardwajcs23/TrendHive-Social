import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Building2, Tag, IndianRupee, FolderOpen, X, Edit2 } from 'lucide-react';
import api from '../api/client';
import { useAuthStore } from '../stores/authStore';

interface Client {
  id: string;
  name: string;
  industry: string;
  retainerValue: number;
  industryTags: string;
  _count: { workspaces: number };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', industry: '', retainerValue: '', tags: '' });
  const [formError, setFormError] = useState('');
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ACCOUNT_MANAGER';

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data.clients);
    } catch (error) {
      console.error('Failed to fetch clients', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingClientId(null);
    setFormData({ name: '', industry: '', retainerValue: '', tags: '' });
    setShowModal(true);
  };

  const openEditModal = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClientId(client.id);
    setFormData({
      name: client.name,
      industry: client.industry || '',
      retainerValue: client.retainerValue?.toString() || '',
      tags: client.industryTags ? JSON.parse(client.industryTags).join(', ') : ''
    });
    setShowModal(true);
  };

  const handleSubmitClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Client name is required');
      return;
    }
    setCreating(true);
    setFormError('');
    try {
      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        industry: formData.industry.trim(),
        retainerValue: formData.retainerValue || '0',
        industryTags: tags,
      };

      if (editingClientId) {
        await api.put(`/clients/${editingClientId}`, payload);
      } else {
        await api.post('/clients', payload);
      }
      
      setShowModal(false);
      setFormData({ name: '', industry: '', retainerValue: '', tags: '' });
      setEditingClientId(null);
      fetchClients();
    } catch (error: any) {
      setFormError(error.response?.data?.error || `Failed to ${editingClientId ? 'update' : 'create'} client`);
    } finally {
      setCreating(false);
    }
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 page-enter relative z-10">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Clients</h1>
          <p className="text-gray-400 mt-2 text-sm">Manage your agency's client portfolio and workspaces.</p>
        </div>
        
        {isAdmin && (
          <button
            onClick={openCreateModal}
            className="glass-btn px-4 py-2.5 rounded-xl text-white font-medium flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </button>
        )}
      </div>

      <div className="glass-card p-3 rounded-2xl flex gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search clients by name or industry..." 
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
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center border-dashed border-white/20">
          <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">
            {searchQuery ? 'No clients match your search' : 'No clients yet'}
          </h3>
          <p className="text-gray-400">
            {searchQuery ? 'Try adjusting your search term.' : 'Add your first client to get started.'}
          </p>
          {!searchQuery && isAdmin && (
            <button
              onClick={openCreateModal}
              className="mt-6 glass-btn px-5 py-2.5 rounded-xl text-white font-medium inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Client
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((client, i) => {
            const tags = client.industryTags ? JSON.parse(client.industryTags) : [];
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={client.id}
                className="glass-card rounded-2xl p-6 hover:-translate-y-1 hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors pointer-events-none" />
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center font-bold text-xl group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30 transition-colors shadow-inner">
                    {client.name.substring(0, 2).toUpperCase()}
                  </div>
                  {isAdmin && (
                    <div className="flex items-start gap-4">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Retainer</p>
                        <p className="font-bold text-white tabular-nums flex items-center justify-end">
                          <IndianRupee className="w-4 h-4 text-emerald-400 mr-0.5" />
                          {client.retainerValue.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => openEditModal(client, e)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{client.name}</h3>
                  <div className="flex items-center text-sm text-gray-400 mb-6">
                    <Building2 className="w-4 h-4 mr-1.5 opacity-70" />
                    {client.industry}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6 min-h-[28px]">
                    {tags.slice(0, 3).map((tag: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 text-gray-300 border border-white/10">
                        <Tag className="w-3 h-3 mr-1 opacity-70" />
                        {tag}
                      </span>
                    ))}
                    {tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-white/5 text-gray-400 border border-white/10">
                        +{tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-400">
                      <FolderOpen className="w-4 h-4 mr-2 opacity-70 text-primary" />
                      <span className="font-medium text-white">{client._count.workspaces}</span>
                      <span className="ml-1">workspace{client._count.workspaces !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <span className="text-primary text-lg leading-none mb-1">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Client Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-dark border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">{editingClientId ? 'Edit Client' : 'Add New Client'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmitClient} className="p-6 space-y-5">
                {formError && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive-foreground px-4 py-3 rounded-xl text-sm">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g. E-commerce"
                    className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Monthly Retainer (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.retainerValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, retainerValue: e.target.value }))}
                    placeholder="e.g. 50000"
                    className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Industry Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g. SaaS, B2B, Tech"
                    className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-medium text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 glass-btn px-4 py-3 rounded-xl font-medium text-white shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    ) : (
                      editingClientId ? 'Save Changes' : 'Create Client'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
