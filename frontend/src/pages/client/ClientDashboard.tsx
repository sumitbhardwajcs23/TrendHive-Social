import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { LogOut, CheckCircle, ExternalLink, Link as LinkIcon, Edit2, Save, X } from 'lucide-react';
import api from '../../api/client';

interface TrackerItem {
  id: string;
  reelId: string;
  topicName: string;
  rawLink: string;
  driveLink: string;
  type: string;
  status: string;
  feedback: string;
}

export default function ClientDashboard() {
  const { user, logout } = useAuthStore();
  const [items, setItems] = useState<TrackerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ feedback?: string }>({});

  useEffect(() => {
    fetchTrackerItems();
  }, []);

  const fetchTrackerItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tracker`);
      setItems(res.data.trackerItems || []);
    } catch (error) {
      console.error('Failed to fetch tracker items', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (item: TrackerItem) => {
    setEditingId(item.id);
    setEditForm({ feedback: item.feedback || '' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await api.put(`/tracker/${id}`, { feedback: editForm.feedback });
      setItems(items.map(item => item.id === id ? res.data.trackerItem : item));
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update feedback', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Client Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Welcome, {user?.name}</span>
              <button
                onClick={() => logout()}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Approvals</h2>
          
          <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 mb-8">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">All caught up</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any posts waiting for approval.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Production Tracker</h2>
            <p className="text-sm text-gray-500">View the status of your raw clips and content.</p>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-x-auto">
            {loading ? (
              <div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div></div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No production items tracked yet.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reel / Topic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raw Link</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drive Link</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map(item => {
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{item.topicName}</div>
                          {item.type && <div className="text-xs text-gray-500">{item.type} {item.reelId ? `• ${item.reelId}` : ''}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'ready' || item.status === 'posted' ? 'bg-green-100 text-green-800' :
                            item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {item.rawLink ? (
                            <a href={item.rawLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-sm"><LinkIcon className="w-4 h-4"/> Link</a>
                          ) : <span className="text-gray-400 text-sm">Not provided</span>}
                        </td>
                        <td className="px-6 py-4">
                          {item.driveLink ? (
                            <a href={item.driveLink} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline flex items-center gap-1 text-sm"><ExternalLink className="w-4 h-4"/> Drive</a>
                          ) : <span className="text-gray-400 text-sm">Not provided</span>}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === item.id ? (
                            <div className="flex items-start gap-2">
                              <textarea
                                value={editForm.feedback || ''}
                                onChange={e => setEditForm({ ...editForm, feedback: e.target.value })}
                                placeholder="Add your feedback..."
                                className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[60px]"
                              />
                              <div className="flex flex-col gap-1">
                                <button onClick={() => saveEdit(item.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Save className="w-4 h-4"/></button>
                                <button onClick={cancelEditing} className="p-1 text-gray-400 hover:bg-gray-50 rounded"><X className="w-4 h-4"/></button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between group">
                              <p className="text-sm text-gray-600 max-w-[200px] truncate pr-4">
                                {item.feedback || <span className="text-gray-400 italic">No feedback</span>}
                              </p>
                              <button onClick={() => startEditing(item)} className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Edit2 className="w-4 h-4"/>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
