import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Shield, FileText, BarChart3, Settings,
  User, ChevronLeft, ChevronRight, ShieldAlert, X, Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useScan } from '../../context/ScanContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/scanner', icon: Shield, label: 'Scanner' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const adminItems = [
  { path: '/admin', icon: ShieldAlert, label: 'Admin Panel' },
];

const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const { activeScan } = useScan();
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 p-5 border-b border-[#00ff9d]/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center flex-shrink-0 neon-primary">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <path d="M16 4L6 9v7c0 5.5 4.3 10.7 10 12 5.7-1.3 10-6.5 10-12V9L16 4z" fill="none" stroke="#00ff9d" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M12 16l3 3 6-6" stroke="#00ff9d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <div className="text-sm font-bold text-white whitespace-nowrap">WebShield</div>
              <div className="text-[10px] text-[#00ff9d] font-mono uppercase tracking-widest whitespace-nowrap">Scanner v1.0</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Scan Indicator */}
      {activeScan && !collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-[#00ff9d]/5 border border-[#00ff9d]/20">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#00ff9d] animate-pulse" />
            <span className="text-[10px] text-[#00ff9d] font-mono uppercase tracking-wider">Scan Active</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Main nav */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 py-1 text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
              Navigation
            </div>
          )}
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                } ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-[#00ff9d]' : 'text-slate-500 group-hover:text-slate-300'}`} size={18} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {path === '/scanner' && activeScan && !collapsed && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Admin nav */}
        {isAdmin && (
          <div className="pt-3 space-y-1">
            {!collapsed && (
              <div className="px-3 py-1 text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
                Admin
              </div>
            )}
            {adminItems.map(({ path, icon: Icon, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'text-slate-400 hover:bg-red-500/5 hover:text-red-400'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* User Profile */}
      <div className={`p-3 border-t border-white/5`}>
        <div className={`flex items-center gap-3 px-2 py-2 rounded-lg ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff9d]/20 to-[#38bdf8]/20 border border-[#00ff9d]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-[#00ff9d]">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <div className="text-xs font-semibold text-slate-200 truncate">{user?.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{user?.role}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-[#0a1628] border-r border-white/5 fixed left-0 inset-y-0 z-30"
      >
        <SidebarContent />
        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0a1628] border border-[#00ff9d]/20 flex items-center justify-center text-slate-400 hover:text-[#00ff9d] transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 h-dvh w-[240px] bg-[#0a1628] border-r border-white/5 z-50 lg:hidden flex flex-col shadow-2xl"
          >
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-1 rounded text-slate-500 hover:text-slate-200"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
