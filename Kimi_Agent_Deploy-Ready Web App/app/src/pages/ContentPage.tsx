import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, Plus, Grid3X3, List, ChevronLeft, ChevronRight,
  MessageSquare, Heart, ArrowUpRight
} from 'lucide-react';
import { posts, calendarEvents, platformConfig } from '../data/demoData';
import type { Post } from '../data/demoData';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';

interface ContentPageProps {
  defaultView?: 'kanban' | 'calendar';
}

const kanbanColumns = [
  { key: 'draft', label: 'Drafts', dot: '#9CA3AF' },
  { key: 'pending', label: 'Pending Approval', dot: '#F59E0B' },
  { key: 'approved', label: 'Approved', dot: '#10B981' },
  { key: 'scheduled', label: 'Scheduled', dot: '#3B82F6' },
  { key: 'published', label: 'Published', dot: '#9CA3AF' },
] as const;

export default function ContentPage({ defaultView = 'kanban' }: ContentPageProps) {
  const [view, setView] = useState<'kanban' | 'calendar'>(defaultView);
  const [activeTab, setActiveTab] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 3, 1)); // April 2025

  const filteredPosts = activeTab === 'all'
    ? posts
    : posts.filter(p => p.status === activeTab);

  const getPostsByStatus = (status: string) => filteredPosts.filter(p => p.status === status);

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  const getEventsForDay = (day: Date) =>
    calendarEvents.filter(e => isSameDay(new Date(e.date), day));

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {view === 'kanban' ? 'Content Hub' : 'Content Calendar'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {view === 'kanban'
              ? 'Create, edit, and manage all your content drafts.'
              : 'View and schedule your content timeline.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
            View Ideas
          </button>
          <button className="px-4 py-2 bg-[#6056D3] text-white rounded-lg text-sm font-medium hover:bg-[#4C45A8] transition-all hover:-translate-y-0.5 flex items-center gap-2 shadow-sm shadow-[#6056D3]/20">
            Publish <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200">
        <div className="flex gap-1">
          {['all', 'draft', 'pending', 'approved', 'scheduled', 'published'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition-colors relative
                ${activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab === 'all' ? 'All Pages' : tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="contentTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pb-2">
          <button
            onClick={() => setView('kanban')}
            className={`p-2 rounded-lg transition-colors ${view === 'kanban' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`p-2 rounded-lg transition-colors ${view === 'calendar' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search content..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6056D3]/20 focus:border-[#6056D3] transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <SlidersHorizontal className="w-4 h-4" /> Status
        </button>
        <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          Platform
        </button>
        <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          Date Range
        </button>
        <button className="ml-auto p-2.5 bg-[#6056D3] text-white rounded-lg hover:bg-[#4C45A8] transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Content Views */}
      <AnimatePresence mode="wait">
        {view === 'kanban' ? (
          <motion.div
            key="kanban"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
          >
            {kanbanColumns.map((col, colIndex) => {
              const colPosts = getPostsByStatus(col.key);
              return (
                <motion.div
                  key={col.key}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: colIndex * 0.1, duration: 0.5, ease: 'easeOut' }}
                  className="flex flex-col"
                >
                  {/* Column Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.dot }} />
                    <span className="text-sm font-semibold text-gray-900">{col.label}</span>
                    <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">
                      {colPosts.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3">
                    {colPosts.map((post, i) => (
                      <KanbanCard key={post.id} post={post} index={i} />
                    ))}
                    {colPosts.length === 0 && (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                        <p className="text-xs text-gray-400">No items</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {/* Empty cells for start padding */}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[120px] border-b border-r border-gray-100 bg-gray-50/30" />
              ))}

              {calendarDays.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isToday = isSameDay(day, new Date(2025, 3, 14));
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <motion.div
                    key={day.toISOString()}
                    whileHover={{ backgroundColor: '#F3F4F6' }}
                    className={`min-h-[120px] border-b border-r border-gray-100 p-2 transition-colors cursor-pointer
                      ${!isCurrentMonth ? 'bg-gray-50/30' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium mb-1
                      ${isToday ? 'bg-[#6056D3] text-white' : 'text-gray-700'}`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="text-[10px] font-medium px-1.5 py-1 rounded text-white truncate"
                          style={{ backgroundColor: event.color }}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KanbanCard({ post, index }: { post: Post; index: number }) {
  const platformStyle = platformConfig[post.platform] || { color: '#6B7280', bg: '#F3F4F6' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer group transition-shadow duration-200"
    >
      {post.image && (
        <div className="relative overflow-hidden h-24">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: platformStyle.bg, color: platformStyle.color }}
          >
            {post.platform}
          </span>
          <span className="text-[10px] text-gray-400">{post.client}</span>
        </div>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#6056D3] transition-colors">
          {post.title}
        </h3>
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1 text-gray-400">
            <MessageSquare className="w-3 h-3" />
            <span className="text-[10px]">{post.comments}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Heart className="w-3 h-3" />
            <span className="text-[10px]">{post.likes || '-'}</span>
          </div>
          <div className="ml-auto w-5 h-5 rounded-full bg-gradient-to-br from-[#6056D3] to-[#8B7FE8] flex items-center justify-center text-white text-[8px] font-bold">
            {post.author.charAt(0)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
