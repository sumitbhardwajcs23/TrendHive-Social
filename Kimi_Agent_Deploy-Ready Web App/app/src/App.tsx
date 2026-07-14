import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, MessageSquare, Image, Calendar,
  Settings, CheckCircle, BarChart3, Bell,
  Menu
} from 'lucide-react';
import DashboardPage from './pages/DashboardPage';
import ContentPage from './pages/ContentPage';
import InboxPage from './pages/InboxPage';
import ApprovalsPage from './pages/ApprovalsPage';
import MediaPage from './pages/MediaPage';
import ClientsPage from './pages/ClientsPage';
import TeamPage from './pages/TeamPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Content Hub', icon: FileText, path: '/content' },
  { label: 'Global Inbox', icon: MessageSquare, path: '/inbox', badge: 5 },
  { label: 'Approvals', icon: CheckCircle, path: '/approvals', badge: 2 },
  { label: 'Media Library', icon: Image, path: '/media' },
  { label: 'Calendar', icon: Calendar, path: '/calendar' },
  { label: 'Clients', icon: Users, path: '/clients' },
  { label: 'Team', icon: Users, path: '/team' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
];

const bottomNavItems: NavItem[] = [
  { label: 'Settings', icon: Settings, path: '/settings' },
];

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-[240px] bg-[#111111] z-50 flex flex-col transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="p-5 pb-3">
          <Link to="/" className="block">
            <h1 className="text-white font-bold text-lg tracking-wide">SOCIALSYNC</h1>
          </Link>
          <p className="text-gray-500 text-xs mt-1">Agency Management</p>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]/50'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-[#6056D3] rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-[18px] h-[18px]" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-[#6056D3] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Nav */}
        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]/50'
                  }`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* User profile mini */}
          <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full bg-[#6056D3] flex items-center justify-center text-white text-xs font-bold">
              BM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">Brian McKenzie</p>
              <p className="text-gray-500 text-xs">Agency Owner</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
        </div>
      </aside>
    </>
  );
}

function MobileHeader({ onMenuClick, unreadCount }: { onMenuClick: () => void; unreadCount: number }) {
  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>
      <h1 className="font-bold text-gray-900">SOCIALSYNC</h1>
      <button className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors relative">
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#6056D3] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} unreadCount={5} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="lg:ml-[240px] min-h-screen">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/calendar" element={<ContentPage defaultView="calendar" />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
