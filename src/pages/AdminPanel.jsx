import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Shield, ToggleLeft, ToggleRight, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { dashboardService, userService } from '../services';
import StatCard from '../components/common/StatCard';
import { formatDateTime, timeAgo } from '../utils/helpers';
import { staggerContainer, staggerItem } from '../animations';

const AdminPanel = () => {
  const [adminStats, setAdminStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsRes, logsRes] = await Promise.all([
          dashboardService.getAdminStats(),
          userService.getActivityLogs(),
        ]);
        setAdminStats(statsRes.data.stats);
        setUsers(statsRes.data.stats?.recentUsers || []);
        setLogs(logsRes.data.logs?.slice(0, 10) || []);
      } catch (err) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleUser = async (userId, isActive) => {
    try {
      await userService.toggleUserStatus(userId);
      setUsers((u) => u.map((x) => x._id === userId ? { ...x, isActive: !isActive } : x));
      toast.success(isActive ? 'User deactivated' : 'User activated');
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const STAT_CARDS = [
    { title: 'Total Users', value: adminStats?.totalUsers ?? '—', icon: Users, accentColor: '#00ff9d' },
    { title: 'Total Scans', value: adminStats?.totalScans ?? '—', icon: Shield, accentColor: '#38bdf8' },
    { title: 'Active Scans', value: adminStats?.activeScans ?? '—', icon: Activity, accentColor: '#f59e0b' },
    { title: 'Vulnerabilities', value: adminStats?.totalVulnerabilities ?? '—', icon: BarChart2, accentColor: '#ef4444' },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h1 className="text-lg font-bold text-white">Admin Panel</h1>
        <p className="text-xs text-slate-500 mt-0.5">System overview and user management</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.title} {...card} loading={loading} />
        ))}
      </motion.div>

      <motion.div variants={staggerItem} className="grid lg:grid-cols-2 gap-5">
        {/* Users table */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Recent Users</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="skeleton w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3 w-1/2 rounded" />
                    <div className="skeleton h-3 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((u, idx) => (
                <motion.div
                  key={u._id}
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00ff9d]/20 to-[#38bdf8]/20 flex items-center justify-center text-xs font-bold text-[#00ff9d]">
                      {u.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-200">{u.name}</div>
                      <div className="text-[10px] text-slate-600">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${u.role === 'admin' ? 'bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20' : 'bg-slate-800 text-slate-400'}`}>
                      {u.role}
                    </span>
                    <button
                      onClick={() => toggleUser(u._id, u.isActive)}
                      className={`text-xs ${u.isActive ? 'text-emerald-400 hover:text-red-400' : 'text-red-400 hover:text-emerald-400'} transition-colors`}
                      title={u.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {u.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Activity log */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white mb-4">System Activity</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="skeleton h-3 w-2/3 rounded" />
                  <div className="skeleton h-3 w-1/4 rounded ml-auto" />
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-8">No activity logs yet</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div key={log._id || i} className="flex items-start justify-between gap-2 py-1.5 border-b border-white/3 last:border-0">
                  <div>
                    <span className="text-xs text-slate-300">{log.action || log.message}</span>
                    {log.user && (
                      <span className="text-[10px] text-slate-600 ml-1.5">by {log.user?.name || log.user}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-600 whitespace-nowrap">{timeAgo(log.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;
