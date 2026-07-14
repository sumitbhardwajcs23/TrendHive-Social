import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, CheckCircle, Lock, Unlock,
  MessageCircle, Send, ThumbsUp, ThumbsDown, AlertTriangle,
  Instagram, Facebook, Linkedin
} from 'lucide-react';
import { inboxItems } from '../data/demoData';
import type { InboxItem } from '../data/demoData';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'comment', label: 'Comments' },
  { key: 'dm', label: 'DMs' },
  { key: 'mention', label: 'Mentions' },
  { key: 'high_priority', label: 'High Priority' },
];

const sentimentConfig = {
  positive: { color: '#10B981', bg: '#D1FAE5', icon: ThumbsUp },
  neutral: { color: '#6B7280', bg: '#F3F4F6', icon: MessageCircle },
  negative: { color: '#EF4444', bg: '#FEE2E2', icon: ThumbsDown },
  high_priority: { color: '#DC2626', bg: '#FEE2E2', icon: AlertTriangle },
};

export default function InboxPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [lockedItems, setLockedItems] = useState<Set<string>>(new Set());
  const [resolvedItems, setResolvedItems] = useState<Set<string>>(new Set());

  const filteredItems = inboxItems.filter(item => {
    if (activeFilter === 'high_priority') return item.sentiment === 'high_priority' && !resolvedItems.has(item.id);
    if (activeFilter === 'all') return !resolvedItems.has(item.id);
    return item.type === activeFilter && !resolvedItems.has(item.id);
  });

  const handleLock = (id: string) => {
    setLockedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleResolve = (id: string) => {
    setResolvedItems(prev => new Set(prev).add(id));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return <Instagram className="w-4 h-4" />;
      case 'Facebook': return <Facebook className="w-4 h-4" />;
      case 'LinkedIn': return <Linkedin className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto h-[calc(100vh-64px)] lg:h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-gray-900">Global Inbox</h1>
          <span className="bg-[#6056D3] text-white text-xs font-bold px-2 py-1 rounded-full">
            {filteredItems.length}
          </span>
        </div>
        <p className="text-gray-500 text-sm">Manage all social interactions across platforms.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-80px)]">
        {/* Left: Filter + List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 flex flex-col h-full"
        >
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search inbox..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6056D3]/20 focus:border-[#6056D3]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                  ${activeFilter === f.key ? 'bg-[#6056D3] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <AnimatePresence>
              {filteredItems.map((item, i) => {
                const sent = sentimentConfig[item.sentiment];
                const isLocked = lockedItems.has(item.id);
                const isSelected = selectedItem?.id === item.id;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                      ${isSelected ? 'border-[#6056D3] bg-[#6056D3]/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6056D3] to-[#8B7FE8] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {item.authorAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{item.author}</span>
                          <span className="text-gray-300">·</span>
                          {getPlatformIcon(item.platform)}
                          <span className="text-xs text-gray-400 ml-auto">{item.timestamp.split('T')[1]?.slice(0, 5)}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1"
                            style={{ backgroundColor: sent.bg, color: sent.color }}
                          >
                            <sent.icon className="w-3 h-3" />
                            {item.sentiment.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-gray-400">{item.client}</span>
                          {isLocked && (
                            <span className="text-[10px] text-amber-600 flex items-center gap-0.5 ml-auto">
                              <Lock className="w-3 h-3" /> You
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right: Detail View */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col h-full overflow-hidden"
        >
          {selectedItem ? (
            <>
              {/* Detail Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6056D3] to-[#8B7FE8] flex items-center justify-center text-white font-bold">
                    {selectedItem.authorAvatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedItem.author}</p>
                    <p className="text-xs text-gray-500">{selectedItem.platform} · {selectedItem.client}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLock(selectedItem.id)}
                    className={`p-2 rounded-lg transition-colors ${lockedItems.has(selectedItem.id) ? 'bg-amber-50 text-amber-600' : 'hover:bg-gray-100 text-gray-400'}`}
                    title={lockedItems.has(selectedItem.id) ? 'Unlock' : 'Lock to me'}
                  >
                    {lockedItems.has(selectedItem.id) ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleResolve(selectedItem.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Resolve
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {selectedItem.authorAvatar}
                  </div>
                  <div className="bg-gray-50 rounded-2xl rounded-tl-md px-5 py-4 max-w-lg">
                    <p className="text-gray-800 leading-relaxed">{selectedItem.content}</p>
                    <p className="text-xs text-gray-400 mt-2">{selectedItem.timestamp}</p>
                  </div>
                </div>

                {/* AI Suggested Reply */}
                <div className="mt-6 ml-14">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded bg-[#6056D3] flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">AI</span>
                    </div>
                    <span className="text-xs font-medium text-[#6056D3]">Suggested Reply</span>
                  </div>
                  <div className="bg-[#6056D3]/5 border border-[#6056D3]/10 rounded-xl px-4 py-3">
                    <p className="text-sm text-gray-700">
                      {selectedItem.sentiment === 'positive'
                        ? `Thank you so much for the kind words! We're thrilled you love it. Stay tuned for more!`
                        : selectedItem.sentiment === 'negative'
                        ? `We sincerely apologize for the inconvenience. We'd love to make this right - could you DM us your order details?`
                        : `Thanks for reaching out! Let us look into this for you and get back shortly.`}
                    </p>
                    <button className="mt-2 text-xs font-medium text-[#6056D3] hover:underline">
                      Use this reply
                    </button>
                  </div>
                </div>
              </div>

              {/* Reply Input */}
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#6056D3] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    BM
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6056D3]/20 focus:border-[#6056D3] pr-12"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#6056D3] text-white rounded-lg hover:bg-[#4C45A8] transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Select a conversation to view details</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
