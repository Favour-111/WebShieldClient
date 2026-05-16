import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { staggerItem } from '../../animations';

const StatCard = ({ icon: Icon, title, value, subtitle, trend, trendValue, accentColor = '#00ff9d', loading = false }) => {
  if (loading) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-8 w-16 rounded" />
            <div className="skeleton h-3 w-28 rounded" />
          </div>
          <div className="skeleton w-10 h-10 rounded-xl" />
        </div>
      </div>
    );
  }

  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? '#00ff9d' : '#ef4444';

  return (
    <motion.div
      variants={staggerItem}
      className="glass-card p-5 hover:border-[#00ff9d]/20 transition-all duration-300 group cursor-default"
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">{title}</p>
          <div className="flex items-end gap-2 mb-1.5">
            <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
          </div>
          <div className="flex items-center gap-2">
            {subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
            {trendValue && (
              <div className="flex items-center gap-1" style={{ color: trendColor }}>
                <TrendIcon size={11} />
                <span className="text-xs font-semibold">{trendValue}</span>
              </div>
            )}
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 transition-all duration-300 group-hover:scale-110"
          style={{
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}25`,
            boxShadow: `0 0 12px ${accentColor}15`,
          }}
        >
          {Icon && <Icon size={18} style={{ color: accentColor }} />}
        </div>
      </div>
      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }}
      />
    </motion.div>
  );
};

export default StatCard;
