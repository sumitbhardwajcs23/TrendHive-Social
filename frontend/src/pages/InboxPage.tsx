import { useState, useEffect } from 'react';
import { MessageSquare, Heart, Search, ArrowLeft } from 'lucide-react';
import api from '../api/client';

interface InboxItem {
  id: string;
  type: string;
  platform: string;
  content: string;
  author: string;
  authorAvatar: string | null;
  sentiment: string;
  status: string;
  createdAt: string;
  client: { name: string; logo: string | null };
}

export default function InboxPage() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    try {
      const res = await api.get('/inbox');
      setItems(res.data.inboxItems || []);
      if (res.data.inboxItems?.length > 0) {
        setSelectedItemId(res.data.inboxItems[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch inbox items', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await api.put(`/inbox/${id}/resolve`);
      setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'resolved' } : item));
    } catch (error) {
      console.error('Failed to resolve item', error);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
    setMobileShowDetail(true);
  };

  const filteredItems = items.filter(item => 
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedItem = items.find(i => i.id === selectedItemId);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col relative z-10 page-enter">
      <div className="mb-4 lg:mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Social Inbox</h1>
        <p className="text-gray-400 mt-1 lg:mt-2 text-sm">Manage and respond to all client social engagements.</p>
      </div>

      <div className="flex flex-1 gap-0 lg:gap-6 overflow-hidden min-h-0 pb-4 lg:pb-6">
        {/* Message List — hidden on mobile when detail is shown */}
        <div className={`${mobileShowDetail ? 'hidden lg:flex' : 'flex'} w-full lg:w-1/3 flex-col gap-3 lg:gap-4`}>
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 lg:pr-2">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="w-8 h-8 rounded-full border-4 border-white/10 border-t-primary animate-spin"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center p-8 glass-card rounded-xl border border-dashed border-white/10">
                <p className="text-gray-400">No messages found.</p>
              </div>
            ) : (
              filteredItems.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => handleSelectItem(item.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedItemId === item.id ? 'glass-card border-primary/50 shadow-[0_0_15px_rgba(126,105,241,0.2)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.client.name}</span>
                    <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                      {item.authorAvatar ? <img src={item.authorAvatar} className="w-full h-full rounded-full" /> : item.author.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-200 text-sm">{item.author}</span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{item.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail View — full-width on mobile, flex-1 on desktop */}
        <div className={`${mobileShowDetail ? 'flex' : 'hidden lg:flex'} flex-1 glass-card rounded-2xl border border-white/5 flex-col overflow-hidden`}>
          {selectedItem ? (
            <>
              <div className="p-4 lg:p-6 border-b border-white/5 flex justify-between items-start">
                <div className="flex items-center gap-3 lg:gap-4">
                  {/* Mobile back button */}
                  <button 
                    onClick={() => setMobileShowDetail(false)}
                    className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                  </button>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center text-base lg:text-lg font-bold flex-shrink-0">
                    {selectedItem.authorAvatar ? <img src={selectedItem.authorAvatar} className="w-full h-full rounded-full" /> : selectedItem.author.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-base lg:text-lg truncate">{selectedItem.author}</h3>
                    <p className="text-xs lg:text-sm text-gray-400 flex items-center gap-2">
                      <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{selectedItem.platform}</span>
                      <span className="hidden sm:inline">• {new Date(selectedItem.createdAt).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-bold border ${selectedItem.status === 'resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                    {selectedItem.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
                <div className="glass-dark p-4 lg:p-6 rounded-2xl border border-white/10 mb-6 relative">
                   <p className="text-gray-200 leading-relaxed text-base lg:text-lg">{selectedItem.content}</p>
                   <div className="flex gap-4 mt-4 lg:mt-6 pt-4 border-t border-white/5">
                     <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                       <MessageSquare className="w-4 h-4" /> Reply
                     </button>
                     <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                       <Heart className="w-4 h-4" /> Like
                     </button>
                   </div>
                </div>
              </div>

              <div className="p-4 lg:p-6 border-t border-white/5 bg-white/5">
                <textarea 
                  placeholder="Write a reply..." 
                  className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none h-20 lg:h-24 mb-3 lg:mb-4"
                />
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                  <button className="text-sm text-gray-400 hover:text-white transition-colors">Use AI Template</button>
                  <div className="flex gap-3">
                    {selectedItem.status !== 'resolved' && (
                      <button 
                        onClick={() => handleResolve(selectedItem.id)}
                        className="flex-1 sm:flex-none px-4 lg:px-5 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors text-sm"
                      >
                        Resolve
                      </button>
                    )}
                    <button className="flex-1 sm:flex-none glass-btn px-5 lg:px-6 py-2.5 text-white font-medium rounded-xl text-sm">
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
