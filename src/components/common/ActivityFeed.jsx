import { motion } from 'framer-motion';
import { timeAgo } from '../../utils/helpers';
import { staggerItem } from '../../animations';

const TYPE_STYLES = {
  scan_complete: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400', label: 'Scan' },
  vulnerability_found: { bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400', label: 'Vuln' },
  report_ready: { bg: 'bg-[#38bdf8]/10', border: 'border-[#38bdf8]/20', dot: 'bg-[#38bdf8]', label: 'Report' },
  system: { bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400', label: 'System' },
  alert: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', dot: 'bg-orange-400', label: 'Alert' },
  info: { bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400', label: 'Info' },
};

const ActivityFeed = ({ activities = [], loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-white/2">
            <div className="skeleton w-8 h-8 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="skeleton h-3 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-10 text-slate-600 text-sm">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((item, idx) => {
        const style = TYPE_STYLES[item.type] || TYPE_STYLES.info;
        return (
          <motion.div
            key={item._id || idx}
            variants={staggerItem}
            initial="hidden"
            animate="visible"
            transition={{ delay: idx * 0.06 }}
            className={`flex gap-3 items-start p-3 rounded-xl ${style.bg} border ${style.border} hover:opacity-90 transition-opacity`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <div className={`w-2 h-2 rounded-full ${style.dot} mt-1`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 leading-snug">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate-2">{item.message}</p>
                </div>
                <span className="text-[10px] text-slate-600 whitespace-nowrap flex-shrink-0 mt-0.5">
                  {timeAgo(item.createdAt)}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
