import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, ExternalLink, Save, X, Edit2, Link as LinkIcon, Trash2 } from 'lucide-react';
import api from '../api/client';

interface Client {
  id: string;
  name: string;
}

interface TrackerItem {
  id: string;
  reelId: string;
  topicName: string;
  rawLink: string;
  driveLink: string;
  type: string;
  editor: string;
  hashtag: string;
  feedback: string;
  status: string;
  views: number;
  platformLinks: string; // Stored as JSON string in DB, but we can treat as string for now or parse it
}

export default function TrackerPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [items, setItems] = useState<TrackerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TrackerItem>>({});

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      fetchTrackerItems(selectedClientId);
    } else {
      setItems([]);
    }
  }, [selectedClientId]);

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data.clients);
      if (res.data.clients.length > 0) {
        setSelectedClientId(res.data.clients[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch clients', error);
    }
  };

  const fetchTrackerItems = async (clientId: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/tracker/${clientId}`);
      setItems(res.data.trackerItems);
    } catch (error) {
      console.error('Failed to fetch tracker items', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = async () => {
    if (!selectedClientId) return;
    
    try {
      const newItem = {
        topicName: 'New Topic',
        clientId: selectedClientId,
        status: 'pending'
      };
      const res = await api.post('/tracker', newItem);
      setItems([res.data.trackerItem, ...items]);
      startEditing(res.data.trackerItem);
    } catch (error) {
      console.error('Failed to create item', error);
    }
  };

  const startEditing = (item: TrackerItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    
    try {
      const res = await api.put(`/tracker/${editingId}`, editForm);
      setItems(items.map(item => item.id === editingId ? res.data.trackerItem : item));
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update item', error);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this row?')) return;
    try {
      await api.delete(`/tracker/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item', error);
    }
  };

  const filteredItems = items.filter(item => 
    item.topicName?.toLowerCase().includes(search.toLowerCase()) ||
    item.reelId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col relative z-10 page-enter">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Production Tracker</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage raw clips, editor assignments, and content status.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <select 
            value={selectedClientId} 
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full sm:w-64 px-4 py-2.5 glass-input rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all [&>option]:bg-[#0f1120]"
          >
            <option value="" disabled>Select a Client...</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button 
            onClick={handleAddNew}
            disabled={!selectedClientId}
            className="w-full sm:w-auto glass-btn px-4 py-2.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search topics or reel IDs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 glass-input rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 glass-card border border-white/5 rounded-2xl overflow-hidden flex flex-col relative">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-white/10 border-t-primary animate-spin"></div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-sm min-w-[1200px]">
              <thead className="bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="p-3 font-medium text-gray-400 w-12 border-b border-white/10">Actions</th>
                  <th className="p-3 font-medium text-gray-400 w-24 border-b border-white/10">Reel ID</th>
                  <th className="p-3 font-medium text-gray-400 w-48 border-b border-white/10">Topic Name</th>
                  <th className="p-3 font-medium text-gray-400 w-32 border-b border-white/10">Type</th>
                  <th className="p-3 font-medium text-gray-400 w-32 border-b border-white/10">Status</th>
                  <th className="p-3 font-medium text-gray-400 w-32 border-b border-white/10">Raw Link</th>
                  <th className="p-3 font-medium text-gray-400 w-32 border-b border-white/10">Drive Link</th>
                  <th className="p-3 font-medium text-gray-400 w-32 border-b border-white/10">Editor</th>
                  <th className="p-3 font-medium text-gray-400 w-32 border-b border-white/10">Hashtag</th>
                  <th className="p-3 font-medium text-gray-400 w-48 border-b border-white/10">Feedback</th>
                  <th className="p-3 font-medium text-gray-400 w-24 border-b border-white/10">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-gray-500">
                      No tracking rows found for this client.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => {
                    const isEditing = editingId === item.id;
                    return (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-3">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <button onClick={saveEdit} className="text-green-400 hover:text-green-300"><Save className="w-4 h-4" /></button>
                              <button onClick={cancelEditing} className="text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEditing(item)} className="text-gray-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          )}
                        </td>
                        
                        {/* Reel ID */}
                        <td className="p-3">
                          {isEditing ? (
                            <input type="text" value={editForm.reelId || ''} onChange={e => setEditForm({...editForm, reelId: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary" />
                          ) : <span className="text-gray-300 font-mono text-xs">{item.reelId || '-'}</span>}
                        </td>

                        {/* Topic Name */}
                        <td className="p-3">
                          {isEditing ? (
                            <input type="text" value={editForm.topicName || ''} onChange={e => setEditForm({...editForm, topicName: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary" />
                          ) : <span className="text-white font-medium">{item.topicName}</span>}
                        </td>

                        {/* Type */}
                        <td className="p-3">
                          {isEditing ? (
                            <input type="text" value={editForm.type || ''} onChange={e => setEditForm({...editForm, type: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary" placeholder="Reel, Short..." />
                          ) : <span className="text-gray-300">{item.type || '-'}</span>}
                        </td>

                        {/* Status */}
                        <td className="p-3">
                          {isEditing ? (
                            <select value={editForm.status || ''} onChange={e => setEditForm({...editForm, status: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary [&>option]:bg-[#0f1120]">
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="needs_review">Needs Review</option>
                              <option value="ready">Ready</option>
                              <option value="posted">Posted</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                              item.status === 'posted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              item.status === 'ready' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              item.status === 'in_progress' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                              item.status === 'needs_review' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                              'bg-white/10 text-gray-400 border-white/10'
                            }`}>
                              {item.status.replace('_', ' ').toUpperCase()}
                            </span>
                          )}
                        </td>

                        {/* Raw Link */}
                        <td className="p-3">
                          {isEditing ? (
                            <input type="text" value={editForm.rawLink || ''} onChange={e => setEditForm({...editForm, rawLink: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary" />
                          ) : item.rawLink ? (
                            <a href={item.rawLink} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                              <LinkIcon className="w-3 h-3" /> Link
                            </a>
                          ) : <span className="text-gray-500">-</span>}
                        </td>

                        {/* Drive Link */}
                        <td className="p-3">
                          {isEditing ? (
                            <input type="text" value={editForm.driveLink || ''} onChange={e => setEditForm({...editForm, driveLink: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary" />
                          ) : item.driveLink ? (
                            <a href={item.driveLink} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" /> Drive
                            </a>
                          ) : <span className="text-gray-500">-</span>}
                        </td>

                        {/* Editor */}
                        <td className="p-3">
                          {isEditing ? (
                            <input type="text" value={editForm.editor || ''} onChange={e => setEditForm({...editForm, editor: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary" />
                          ) : <span className="text-gray-300">{item.editor || '-'}</span>}
                        </td>

                        {/* Hashtag */}
                        <td className="p-3">
                          {isEditing ? (
                            <input type="text" value={editForm.hashtag || ''} onChange={e => setEditForm({...editForm, hashtag: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary" />
                          ) : <span className="text-gray-400 text-xs truncate block max-w-[100px]" title={item.hashtag}>{item.hashtag || '-'}</span>}
                        </td>

                        {/* Feedback */}
                        <td className="p-3">
                          {isEditing ? (
                            <textarea value={editForm.feedback || ''} onChange={e => setEditForm({...editForm, feedback: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary resize-none" rows={1} />
                          ) : <span className="text-gray-400 text-xs line-clamp-2" title={item.feedback}>{item.feedback || '-'}</span>}
                        </td>

                        {/* Views */}
                        <td className="p-3">
                          {isEditing ? (
                            <input type="number" value={editForm.views || 0} onChange={e => setEditForm({...editForm, views: parseInt(e.target.value) || 0})} className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary" />
                          ) : <span className="text-gray-300 font-mono text-xs">{item.views?.toLocaleString() || '0'}</span>}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
