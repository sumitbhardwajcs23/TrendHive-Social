import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, Calendar, LayoutGrid, X, GripVertical } from 'lucide-react';
import api from '../api/client';

interface Post {
  id: string;
  title: string;
  content: string;
  status: string;
  platform: string;
  scheduledTime: string | null;
  campaign: { client: { name: string } } | null;
  author: { name: string; avatar: string } | null;
}

interface ClientWorkspace {
  id: string;
  name: string;
  client: { id: string; name: string };
}

const STATUSES = ['draft', 'in_review_internal', 'in_review_client', 'approved', 'published'] as const;

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  in_review_internal: 'Internal Review',
  in_review_client: 'Client Review',
  approved: 'Approved',
  published: 'Published',
  needs_revision: 'Needs Revision',
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'border-l-gray-500',
  in_review_internal: 'border-l-yellow-500',
  in_review_client: 'border-l-orange-500',
  approved: 'border-l-green-500',
  published: 'border-l-blue-500',
  needs_revision: 'border-l-red-500',
};

export default function ContentPage({ defaultView = 'kanban' }: { defaultView?: 'kanban' | 'calendar' }) {
  const [view, setView] = useState(defaultView);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [workspaces, setWorkspaces] = useState<ClientWorkspace[]>([]);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platform: 'Instagram',
    workspaceId: '',
    scheduledTime: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchWorkspaces();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const response = await api.get('/clients');
      const allWorkspaces: ClientWorkspace[] = [];
      response.data.clients.forEach((client: any) => {
        (client.workspaces || []).forEach((ws: any) => {
          allWorkspaces.push({ id: ws.id, name: ws.name || 'Default', client: { id: client.id, name: client.name } });
        });
      });
      setWorkspaces(allWorkspaces);
    } catch (error) {
      console.error('Failed to fetch workspaces', error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Post title is required');
      return;
    }
    setCreating(true);
    setFormError('');
    try {
      await api.post('/posts', {
        title: formData.title.trim(),
        content: formData.content.trim(),
        platform: formData.platform,
        workspaceId: formData.workspaceId || undefined,
        scheduledTime: formData.scheduledTime || undefined,
      });
      setShowModal(false);
      setFormData({ title: '', content: '', platform: 'Instagram', workspaceId: '', scheduledTime: '' });
      fetchPosts();
    } catch (error: any) {
      setFormError(error.response?.data?.error || 'Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  // --- Drag and Drop handlers ---
  const handleDragStart = useCallback((e: React.DragEvent, postId: string) => {
    e.dataTransfer.setData('text/plain', postId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedPostId(postId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    setDraggedPostId(null);

    const postId = e.dataTransfer.getData('text/plain');
    if (!postId) return;

    const post = posts.find(p => p.id === postId);
    if (!post || post.status === targetStatus) return;

    // Optimistic update
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: targetStatus } : p));

    try {
      await api.put(`/posts/${postId}`, { status: targetStatus });
    } catch (error) {
      console.error('Failed to update post status', error);
      // Revert on failure
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: post.status } : p));
    }
  }, [posts]);

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col relative z-10 page-enter">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Content Hub</h1>
          <p className="text-gray-400 mt-2 text-sm">Manage and schedule all your social media content.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass-card p-1 flex rounded-xl">
            <button
              onClick={() => setView('kanban')}
              className={`p-2 rounded-lg transition-colors ${view === 'kanban' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`p-2 rounded-lg transition-colors ${view === 'calendar' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
          
          <button className="glass-card text-gray-300 px-4 py-2.5 rounded-xl font-medium hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="glass-btn px-4 py-2.5 rounded-xl text-white font-medium flex items-center gap-2 text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Post
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-primary animate-spin"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
          {view === 'kanban' ? (
            <div className="flex gap-5 h-full min-w-max">
              {STATUSES.map((status) => {
                const columnPosts = posts.filter(p => p.status === status);
                const isOver = dragOverColumn === status;
                return (
                  <div
                    key={status}
                    className={`w-[320px] rounded-2xl border flex flex-col transition-all duration-300 ${
                      isOver
                        ? 'bg-primary/10 border-primary/50 shadow-[0_0_30px_rgba(126,105,241,0.2)]'
                        : 'glass-dark border-white/5 hover:border-white/10'
                    }`}
                    onDragOver={(e) => handleDragOver(e, status)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, status)}
                  >
                    <div className="p-4 border-b border-white/5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            status === 'draft' ? 'bg-gray-400' :
                            status === 'in_review_internal' ? 'bg-yellow-400' :
                            status === 'in_review_client' ? 'bg-orange-400' :
                            status === 'approved' ? 'bg-green-400' :
                            'bg-blue-400'
                          } ${isOver ? 'animate-pulse-glow' : ''}`} />
                          <h3 className="font-semibold text-gray-200 text-sm">{STATUS_LABELS[status]}</h3>
                        </div>
                        <span className="bg-white/10 text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full border border-white/5">
                          {columnPosts.length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {columnPosts.map((post) => (
                        <motion.div
                          layout
                          key={post.id}
                          draggable
                          onDragStart={(e: any) => handleDragStart(e, post.id)}
                          className={`glass-card p-4 rounded-xl border-l-[3px] cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-all group ${STATUS_COLORS[post.status] || 'border-l-gray-600'} ${
                            draggedPostId === post.id ? 'opacity-40 scale-95 border-primary/50' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {post.campaign?.client?.name || 'Unassigned'}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-medium border border-blue-500/20">{post.platform}</span>
                              <GripVertical className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <h4 className="font-medium text-white text-sm mb-1 leading-snug">{post.title}</h4>
                          {post.content && (
                            <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">{post.content}</p>
                          )}
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold border border-primary/30">
                              {post.author?.name?.charAt(0) || '?'}
                            </div>
                            {post.scheduledTime && (
                              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(post.scheduledTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}

                      {columnPosts.length === 0 && (
                        <div className={`border border-dashed rounded-xl p-6 text-center transition-colors ${
                          isOver ? 'border-primary/50 bg-primary/5' : 'border-white/10'
                        }`}>
                          <p className="text-xs text-gray-500">
                            {isOver ? 'Drop post here' : 'No posts in this stage'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card border border-white/5 rounded-2xl h-full p-6 flex flex-col">
               <div className="grid grid-cols-7 gap-[1px] bg-white/5 border-l border-t border-white/5 flex-1 rounded-lg overflow-hidden">
                 {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                   <div key={d} className="glass p-2 text-center text-xs font-semibold text-gray-400">{d}</div>
                 ))}
                 {Array.from({length: 35}).map((_, i) => {
                    const dayNum = i + 1 > 31 ? i - 30 : i + 1;
                    const scheduledPosts = posts.filter(p => {
                      if (!p.scheduledTime) return false;
                      const d = new Date(p.scheduledTime);
                      return d.getDate() === dayNum;
                    });
                    return (
                      <div key={i} className="glass-dark p-2 min-h-[100px] group hover:bg-white/5 transition-colors">
                        <span className="text-sm text-gray-500 group-hover:text-white transition-colors">{dayNum}</span>
                        {scheduledPosts.map(p => (
                          <div key={p.id} className="mt-1 p-1.5 bg-primary/20 text-primary text-[10px] font-medium rounded border border-primary/30 truncate">
                            {p.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
               </div>
            </div>
          )}
        </div>
      )}

      {/* Create Post Modal */}
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
              className="glass-dark border border-white/10 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">Create New Post</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="p-6 space-y-5">
                {formError && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive-foreground px-4 py-3 rounded-xl text-sm">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Post Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Summer Sale Launch Post"
                    className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Content</label>
                  <textarea
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your post content here..."
                    className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Platform</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                      className="w-full px-4 py-3 glass-input rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all [&>option]:bg-[#0f1120]"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Twitter">Twitter / X</option>
                      <option value="TikTok">TikTok</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="YouTube">YouTube</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Client Workspace</label>
                    <select
                      value={formData.workspaceId}
                      onChange={(e) => setFormData(prev => ({ ...prev, workspaceId: e.target.value }))}
                      className="w-full px-4 py-3 glass-input rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all [&>option]:bg-[#0f1120]"
                    >
                      <option value="">No Workspace</option>
                      {workspaces.map(ws => (
                        <option key={ws.id} value={ws.id}>{ws.client.name} — {ws.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Schedule For</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all [color-scheme:dark]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 text-gray-400 font-medium hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="glass-btn px-6 py-2.5 text-white font-medium rounded-xl disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Create Post'}
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
