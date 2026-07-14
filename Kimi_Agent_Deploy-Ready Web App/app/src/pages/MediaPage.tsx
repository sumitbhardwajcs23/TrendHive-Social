import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Grid3X3, List, Upload, ExternalLink,
  Type, Palette, Ban
} from 'lucide-react';
import { mediaAssets, brandKits } from '../data/demoData';

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<'assets' | 'brands'>('assets');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 text-sm mt-1">Manage assets and brand kits.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#6056D3] text-white rounded-lg text-sm font-medium hover:bg-[#4C45A8] transition-all hover:-translate-y-0.5 shadow-sm shadow-[#6056D3]/20">
          <Upload className="w-4 h-4" /> Upload Asset
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200">
        <div className="flex gap-1">
          {[
            { key: 'assets' as const, label: 'Assets', count: mediaAssets.length },
            { key: 'brands' as const, label: 'Brand Kits', count: brandKits.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative
                ${activeTab === tab.key ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs text-gray-400">({tab.count})</span>
              {activeTab === tab.key && (
                <motion.div
                  layoutId="mediaTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pb-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'assets' ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6056D3]/20 focus:border-[#6056D3]"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" /> Type
            </button>
            <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Client
            </button>
          </div>

          {/* Assets Grid */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {mediaAssets.map((asset, i) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer group transition-shadow"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={asset.thumbnail}
                      alt={asset.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {asset.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-gray-800 ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">{asset.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{asset.size}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-500">{asset.client}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {asset.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Asset</th>
                    <th className="text-left px-6 py-3 font-medium">Client</th>
                    <th className="text-left px-6 py-3 font-medium">Type</th>
                    <th className="text-left px-6 py-3 font-medium">Size</th>
                    <th className="text-left px-6 py-3 font-medium">Uploaded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mediaAssets.map((asset, i) => (
                    <motion.tr
                      key={asset.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={asset.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-medium text-gray-900">{asset.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{asset.client}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full
                          ${asset.type === 'video' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                          {asset.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{asset.size}</td>
                      <td className="px-6 py-4 text-gray-500">{asset.uploadedAt}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        /* Brand Kits */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {brandKits.map((kit, i) => (
            <motion.div
              key={kit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
              className="bg-white rounded-xl border border-gray-200 p-6 transition-shadow"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6056D3] to-[#8B7FE8] flex items-center justify-center text-white font-bold">
                    {kit.clientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{kit.clientName}</h3>
                    <p className="text-xs text-gray-500">Brand Kit</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Colors */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Colors</span>
                </div>
                <div className="flex gap-2">
                  {kit.colors.map((color, ci) => (
                    <div key={ci} className="group relative">
                      <div
                        className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer transition-transform hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {color}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Type className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Typography</span>
                </div>
                <p className="text-sm text-gray-700">{kit.typography}</p>
              </div>

              {/* Tone of Voice */}
              <div className="mb-4">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tone of Voice</span>
                <p className="text-sm text-gray-700 mt-1">{kit.toneOfVoice}</p>
              </div>

              {/* Banned Terms */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Ban className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Banned Terms</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {kit.bannedTerms.map(term => (
                    <span key={term} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full flex items-center gap-1">
                      <Ban className="w-3 h-3" /> {term}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
