import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, Video, FileText, Search, X } from 'lucide-react';
import api from '../api/client';

interface Asset {
  id: string;
  name: string;
  type: string;
  url: string;
  size: string;
  createdAt: string;
  workspace: { client: { name: string } };
  campaign?: { name: string };
  uploadedBy: string;
}

export default function MediaPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState({ name: '', type: 'image' });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await api.get('/media');
      setAssets(res.data.assets || []);
    } catch (error) {
      console.error('Failed to fetch media', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.name.trim()) return;
    setUploading(true);
    try {
      await api.post('/media', { ...uploadData });
      setShowUploadModal(false);
      setUploadData({ name: '', type: 'image' });
      fetchMedia();
    } catch (error) {
      console.error('Failed to upload', error);
    } finally {
      setUploading(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || asset.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 page-enter relative z-10">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Media Library</h1>
          <p className="text-gray-400 mt-2 text-sm">Store and manage all your brand assets in one place.</p>
        </div>
        
        <button
          onClick={() => setShowUploadModal(true)}
          className="glass-btn px-4 py-2.5 rounded-xl text-white font-medium flex items-center gap-2 shadow-sm"
        >
          <UploadCloud className="w-4 h-4" />
          Upload Asset
        </button>
      </div>

      <div className="glass-card p-3 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-white/5 rounded-xl p-1 w-full md:w-auto">
          {['all', 'image', 'video', 'document'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-auto flex-1 md:max-w-xs">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-primary animate-spin"></div>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center border-dashed border-white/20">
          <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">
            {searchQuery ? 'No assets match your search' : 'No assets uploaded yet'}
          </h3>
          <p className="text-gray-400">
            {searchQuery ? 'Try adjusting your search filters.' : 'Upload your first asset to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAssets.map((asset, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={asset.id}
              className="glass-card rounded-xl overflow-hidden hover:border-primary/30 transition-colors group relative cursor-pointer"
            >
              <div className="aspect-square bg-white/5 relative overflow-hidden">
                {asset.type === 'image' && asset.url ? (
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    {asset.type === 'video' ? <Video className="w-12 h-12" /> : <FileText className="w-12 h-12" />}
                  </div>
                )}
                
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-medium text-white uppercase tracking-wider">
                  {asset.type}
                </div>
              </div>
              
              <div className="p-3">
                <h4 className="font-medium text-white text-sm truncate mb-1" title={asset.name}>{asset.name}</h4>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{asset.size}</span>
                  <span className="truncate max-w-[60%] text-right">{asset.workspace.client.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowUploadModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-dark border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">Upload Asset</h2>
                <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Asset Name *</label>
                  <input
                    type="text"
                    required
                    value={uploadData.name}
                    onChange={(e) => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Summer Campaign Logo"
                    className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Asset Type</label>
                  <select
                    value={uploadData.type}
                    onChange={(e) => setUploadData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 glass-input rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all [&>option]:bg-[#0f1120]"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                  </select>
                </div>

                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/5 cursor-not-allowed hover:bg-white/10 transition-colors">
                   <UploadCloud className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                   <p className="text-sm text-gray-300 font-medium">Click to browse or drag and drop</p>
                   <p className="text-xs text-gray-500 mt-1">(Dummy upload - will use placeholder image)</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-5 py-2.5 text-gray-400 font-medium hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="glass-btn px-6 py-2.5 text-white font-medium rounded-xl disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
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
