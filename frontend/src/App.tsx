import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, MessageSquare, Image, Calendar,
  Settings, CheckCircle, BarChart3, Bell, Menu, LogOut
} from 'lucide-react';
import { useAuthStore } from './stores/authStore';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ContentPage from './pages/ContentPage';
import InboxPage from './pages/InboxPage';
import ApprovalsPage from './pages/ApprovalsPage';
import MediaPage from './pages/MediaPage';
import ClientsPage from './pages/ClientsPage';
import TeamPage from './pages/TeamPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ClientDashboard from './pages/client/ClientDashboard';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  roles: string[];
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'ACCOUNT_MANAGER', 'CREATOR', 'COPYWRITER', 'FREELANCER'] },
  { label: 'Content Hub', icon: FileText, path: '/content', roles: ['ADMIN', 'ACCOUNT_MANAGER', 'CREATOR', 'COPYWRITER', 'LEGAL_REVIEWER', 'FREELANCER'] },
  { label: 'Global Inbox', icon: MessageSquare, path: '/inbox', badge: 5, roles: ['ADMIN', 'ACCOUNT_MANAGER', 'COMMUNITY_MANAGER'] },
  { label: 'Approvals', icon: CheckCircle, path: '/approvals', badge: 2, roles: ['ADMIN', 'ACCOUNT_MANAGER', 'CREATOR', 'COPYWRITER', 'LEGAL_REVIEWER', 'FREELANCER'] },
  { label: 'Media Library', icon: Image, path: '/media', roles: ['ADMIN', 'ACCOUNT_MANAGER', 'CREATOR', 'COPYWRITER', 'FREELANCER'] },
  { label: 'Calendar', icon: Calendar, path: '/calendar', roles: ['ADMIN', 'ACCOUNT_MANAGER', 'CREATOR', 'COPYWRITER', 'FREELANCER'] },
  { label: 'Clients', icon: Users, path: '/clients', roles: ['ADMIN', 'ACCOUNT_MANAGER'] },
  { label: 'Team', icon: Users, path: '/team', roles: ['ADMIN'] },
  { label: 'Analytics', icon: BarChart3, path: '/analytics', roles: ['ADMIN', 'ACCOUNT_MANAGER'] },
];

const bottomNavItems: NavItem[] = [
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['ADMIN'] },
];

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const filterNavItems = (items: NavItem[]) => {
    if (!user) return [];
    return items.filter(item => item.roles.includes(user.role));
  };

  const filteredMain = filterNavItems(mainNavItems);
  const filteredBottom = filterNavItems(bottomNavItems);

  if (!user || user.role === 'CLIENT_STAKEHOLDER') return null; // Client has different layout

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed left-0 top-0 h-full w-[260px] glass-dark border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 pb-3">
          <Link to="/" className="block">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded bg-primary animate-pulse-glow" />
              </div>
              <h1 className="text-white font-bold text-lg tracking-wide">TrendHive Social</h1>
            </div>
          </Link>
          <p className="text-gray-400 text-xs mt-2 pl-10">Agency OS</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredMain.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative
                  ${isActive ? 'bg-[#1A1A1A] text-white' : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]/50'}`}
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

        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          {filteredBottom.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive ? 'bg-[#1A1A1A] text-white' : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]/50'}`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1A1A1A]/50 transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Sign Out</span>
          </button>

          <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full bg-[#6056D3] flex items-center justify-center text-white text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.name}</p>
              <p className="text-gray-500 text-xs truncate">{user.role}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
}

function MobileHeader({ onMenuClick, unreadCount }: { onMenuClick: () => void; unreadCount: number }) {
  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <button onClick={onMenuClick} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Menu className="w-5 h-5 text-gray-700" />
      </button>
      <h1 className="font-bold text-gray-900">TRENDHIVE</h1>
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
  const { user, isAuthenticated } = useAuthStore();

  const isClient = user?.role === 'CLIENT_STAKEHOLDER';
  const location = useLocation();
  
  const isLanding = location.pathname === '/';

  return (
    <div className={`min-h-screen relative overflow-hidden ${isLanding ? 'bg-[#050A0F]' : 'bg-[#0a0b14]'}`}>
      {/* Global Background Effects for Authenticated App */}
      {!isLanding && (
        <>
          <div className="fixed inset-0 mesh-gradient-dark opacity-40 pointer-events-none"></div>
          <div className="fixed inset-0 glass-grid opacity-20 pointer-events-none"></div>
        </>
      )}

      {/* Mobile Header - Outside flex row so it spans full width */}
      {isAuthenticated && !isClient && !isLanding && (
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} unreadCount={5} />
      )}

      <div className="relative z-10 flex min-h-screen">
        {isAuthenticated && !isClient && !isLanding && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className={`flex-1 ${isAuthenticated && !isClient && !isLanding ? 'lg:ml-[260px]' : ''} min-h-screen ${isLanding ? 'p-0' : 'px-3 py-4 sm:px-4 lg:p-8'}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Client Routes */}
            <Route element={<ProtectedRoute allowedRoles={['CLIENT_STAKEHOLDER']} />}>
              <Route path="/client" element={<ClientDashboard />} />
            </Route>

            {/* Admin/Agency Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'ACCOUNT_MANAGER', 'CREATOR', 'COPYWRITER', 'COMMUNITY_MANAGER', 'FREELANCER']} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/content" element={<ContentPage />} />
              <Route path="/inbox" element={<InboxPage />} />
              <Route path="/approvals" element={<ApprovalsPage />} />
              <Route path="/media" element={<MediaPage />} />
              <Route path="/calendar" element={<ContentPage defaultView="calendar" />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </AnimatePresence>
        </main>
      </div>
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
