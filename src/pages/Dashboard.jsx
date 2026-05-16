import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, AlertTriangle, BarChart2, Globe, TrendingUp, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import ActivityFeed from '../components/common/ActivityFeed';
import { ScanTable } from '../components/common/VulnerabilityTable';
import { VulnerabilityTrendChart, SeverityDonutChart } from '../components/dashboard/VulnerabilityChart';
import { dashboardService, userService, scanService } from '../services';
import { useAuth } from '../context/AuthContext';
import { staggerContainer, staggerItem } from '../animations';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, trendRes, scansRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getTrend(30),
        scanService.getScans({ limit: 5, page: 1 }),
      ]);
      setStats(statsRes.data.stats);
      setTrend(trendRes.data.trend || []);
      setRecentScans(scansRes.data.scans || []);

      // Fetch notifications for activity
      try {
        const notifRes = await userService.getNotifications();
        setActivities(notifRes.data.notifications?.slice(0, 8) || []);
      } catch {}
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const STAT_CARDS = [
    {
      title: 'Total Scans',
      value: stats?.totalScans ?? '—',
      subtitle: `${stats?.runningScans || 0} active`,
      icon: Globe,
      accentColor: '#00ff9d',
      trend: stats?.totalScans > 0 ? { value: stats.totalScans, direction: 'up' } : null,
    },
    {
      title: 'Vulnerabilities',
      value: stats?.totalVulnerabilities ?? '—',
      subtitle: `${stats?.openVulnerabilities || 0} open`,
      icon: AlertTriangle,
      accentColor: '#f59e0b',
      trend: stats?.openVulnerabilities > 0 ? { value: stats.openVulnerabilities, direction: 'up' } : null,
    },
    {
      title: 'Critical Findings',
      value: stats?.criticalVulnerabilities ?? '—',
      subtitle: 'Immediate action required',
      icon: Shield,
      accentColor: '#ef4444',
    },
    {
      title: 'Scan Success Rate',
      value: stats?.successRate !== undefined ? `${stats.successRate}%` : '—',
      subtitle: `${stats?.completedScans || 0} completed`,
      icon: BarChart2,
      accentColor: '#38bdf8',
    },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Hero banner */}
      <motion.div
        variants={staggerItem}
        className="relative overflow-hidden sm:mt-13 lg:mt-0 rounded-2xl p-4 md:p-8 bg-gradient-to-r from-[#0a1628] to-[#051020] border border-[#00ff9d]/10"
      >
        <div className="absolute right-0 top-0 bottom-0 w-48 opacity-5 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #00ff9d 0, #00ff9d 1px, transparent 0, transparent 50%)',
          backgroundSize: '16px 100%',
        }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-white mb-1">
              Welcome back, <span className="text-[#00ff9d]">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm">
              {stats?.runningScans > 0
                ? `${stats.runningScans} scan${stats.runningScans > 1 ? 's' : ''} currently running`
                : 'Your security dashboard is up to date'}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={fetchAll} className="btn-secondary flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2">
              <RefreshCw size={13} /> Refresh
            </button>
            <button onClick={() => navigate('/scanner')} className="btn-primary flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2">
              <Activity size={13} /> New Scan
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.title} {...card} loading={loading} />
        ))}
      </motion.div>

      {/* Charts row */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend chart — takes 2/3 */}
        <div className="lg:col-span-2 glass-card p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-white text-sm">Vulnerability Trend</h2>
              <p className="text-xs text-slate-500 mt-0.5">Last 30 days by severity</p>
            </div>
            <TrendingUp size={16} className="text-slate-600" />
          </div>
          <VulnerabilityTrendChart data={trend} loading={loading} />
        </div>

        {/* Severity donut — takes 1/3 */}
        <div className="glass-card p-4 md:p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-white text-sm">Severity Distribution</h2>
            <p className="text-xs text-slate-500 mt-0.5">All-time findings breakdown</p>
          </div>
          <SeverityDonutChart
            data={{
              critical: stats?.criticalVulnerabilities || 0,
              high: stats?.highVulnerabilities || 0,
              medium: stats?.mediumVulnerabilities || 0,
              low: stats?.lowVulnerabilities || 0,
            }}
            loading={loading}
          />
        </div>
      </motion.div>

      {/* Bottom two-column */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Scans — takes 2/3 */}
        <div className="lg:col-span-2 glass-card p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white text-sm">Recent Scans</h2>
            <button
              onClick={() => navigate('/scanner')}
              className="text-xs text-[#00ff9d] hover:underline"
            >
              View all →
            </button>
          </div>
          <ScanTable scans={recentScans} loading={loading} />
        </div>

        {/* Activity Feed — takes 1/3 */}
        <div className="glass-card p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white text-sm">Recent Activity</h2>
          </div>
          <ActivityFeed activities={activities} loading={loading} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
