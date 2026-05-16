import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, Search, LogOut, User, Settings, ChevronDown, X, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services';
import { timeAgo } from '../../utils/helpers';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/scanner': 'Vulnerability Scanner',
  '/reports': 'Security Reports',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/admin': 'Admin Panel',
};

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const pageTitle = Object.entries(PAGE_TITLES).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || 'WebShield';

  useEffect(() => {
    userService.getNotifications()
      .then(({ data }) => {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      })
      .catch(() => {});
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllRead = async () => {
    await userService.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const getSeverityDot = (severity) => {
    const dots = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-amber-400', low: 'bg-blue-400', info: 'bg-slate-500' };
    return dots[severity] || 'bg-slate-500';
  };

  return (
    <header className="sticky top-0 z-20 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Menu + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-base font-semibold text-white leading-tight">{pageTitle}</h1>
            <p className="text-xs text-slate-500 font-mono hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
            title="Search"
          >
            <Search size={18} />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 glass-card border-[#00ff9d]/10 shadow-2xl overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <span className="text-sm font-semibold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-[#00ff9d] hover:underline flex items-center gap-1">
                        <Check size={10} /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-slate-500 text-sm">No notifications</div>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <div
                          key={n._id}
                          className={`px-4 py-3 border-b border-white/3 hover:bg-white/3 transition-colors ${!n.isRead ? 'bg-[#00ff9d]/3' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${getSeverityDot(n.severity)}`} />
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-slate-200 truncate">{n.title}</div>
                              <div className="text-xs text-slate-500 mt-0.5 truncate-2">{n.message}</div>
                              <div className="text-[10px] text-slate-600 mt-1">{timeAgo(n.createdAt)}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00ff9d]/20 to-[#38bdf8]/20 border border-[#00ff9d]/20 flex items-center justify-center">
                <span className="text-xs font-bold text-[#00ff9d]">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-medium text-slate-200 leading-tight">{user?.name}</div>
                <div className="text-[10px] text-slate-500 capitalize">{user?.role}</div>
              </div>
              <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 glass-card border-[#00ff9d]/10 shadow-2xl overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-white/5">
                    <div className="text-xs font-semibold text-white">{user?.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    {[
                      { icon: User, label: 'Profile', action: () => { navigate('/profile'); setUserMenuOpen(false); } },
                      { icon: Settings, label: 'Settings', action: () => { navigate('/settings'); setUserMenuOpen(false); } },
                    ].map(({ icon: Icon, label, action }) => (
                      <button
                        key={label}
                        onClick={action}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
                      >
                        <Icon size={15} />
                        {label}
                      </button>
                    ))}
                    <div className="border-t border-white/5 mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
            >
              <div className="glass-card p-1.5">
                <div className="flex items-center gap-3 px-4 py-2">
                  <Search size={16} className="text-slate-400" />
                  <input
                    autoFocus
                    placeholder="Search scans, vulnerabilities..."
                    className="flex-1 bg-transparent text-slate-200 text-sm placeholder-slate-500 outline-none"
                    onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                  />
                  <button onClick={() => setSearchOpen(false)} className="text-slate-500 hover:text-slate-300">
                    <X size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
