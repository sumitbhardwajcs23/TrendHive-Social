import { useState, useEffect } from 'react';
import { Folder, Link as LinkIcon, Save, Edit2, X } from 'lucide-react';
import api from '../../api/client';

export default function ClientRawClipsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ rawLink: '', driveLink: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/tracker');
      setItems(res.data.trackerItems);
    } catch (error) {
      console.error('Failed to fetch tracker items', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm({
      rawLink: item.rawLink || '',
      driveLink: item.driveLink || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (id: string) => {
    try {
      const res = await api.put(`/tracker/${id}`, editForm);
      setItems(items.map(item => item.id === id ? res.data.trackerItem : item));
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update links', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 page-enter relative z-10 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Raw Clips Manager</h1>
        <p className="text-gray-400 mt-2 text-sm">Provide links to your raw footage or shared drive folders.</p>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-sm font-semibold text-gray-300">Topic</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Platform</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Raw Link</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Drive Link</th>
                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm text-white font-medium">
                    {item.topicName}
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {item.platform || '-'}
                  </td>
                  <td className="p-4 text-sm">
                    {editingId === item.id ? (
                      <input
                        type="url"
                        value={editForm.rawLink}
                        onChange={(e) => setEditForm({ ...editForm, rawLink: e.target.value })}
                        placeholder="Paste URL..."
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    ) : item.rawLink ? (
                      <a href={item.rawLink} target="_blank" rel="noreferrer" className="text-primary hover:text-primary-light flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" /> View Link
                      </a>
                    ) : (
                      <span className="text-gray-500 italic">Not provided</span>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    {editingId === item.id ? (
                      <input
                        type="url"
                        value={editForm.driveLink}
                        onChange={(e) => setEditForm({ ...editForm, driveLink: e.target.value })}
                        placeholder="Paste Drive URL..."
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    ) : item.driveLink ? (
                      <a href={item.driveLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <Folder className="w-4 h-4" /> Open Drive
                      </a>
                    ) : (
                      <span className="text-gray-500 italic">Not provided</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {editingId === item.id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleSave(item.id)}
                          className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                          title="Save"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="Edit Links"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No production tracker items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
