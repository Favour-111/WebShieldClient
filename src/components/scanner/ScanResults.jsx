import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, FileText, BarChart2 } from 'lucide-react';
import { getSeverityBg, getRiskLevel, formatDuration } from '../../utils/helpers';
import { staggerContainer, staggerItem } from '../../animations';

const ScanResults = ({ scan, vulnCount = 0 }) => {
  const navigate = useNavigate();
  if (!scan || scan.status !== 'completed') return null;

  const { summary = {}, riskScore, duration } = scan;

  const SEVERITIES = [
    { key: 'critical', label: 'Critical', color: 'text-red-400' },
    { key: 'high', label: 'High', color: 'text-orange-400' },
    { key: 'medium', label: 'Medium', color: 'text-amber-400' },
    { key: 'low', label: 'Low', color: 'text-blue-400' },
    { key: 'info', label: 'Info', color: 'text-slate-400' },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Success Banner */}
      <motion.div variants={staggerItem} className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
        <div>
          <p className="text-sm font-semibold text-emerald-400">Scan Complete</p>
          {duration && (
            <p className="text-xs text-emerald-600 mt-0.5">Completed in {formatDuration(duration)}</p>
          )}
        </div>
      </motion.div>

      {/* Risk Score */}
      <motion.div variants={staggerItem} className="glass-card p-4 text-center">
        <div className="text-3xl font-bold font-mono" style={{
          color: riskScore >= 75 ? '#ef4444' : riskScore >= 50 ? '#f97316' : riskScore >= 25 ? '#f59e0b' : '#00ff9d'
        }}>
          {riskScore ?? '—'}
        </div>
        <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Risk Score · {getRiskLevel(riskScore)}</div>
        <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${riskScore}%`,
              background: riskScore >= 75 ? '#ef4444' : riskScore >= 50 ? '#f97316' : riskScore >= 25 ? '#f59e0b' : '#00ff9d',
            }}
          />
        </div>
      </motion.div>

      {/* Severity Breakdown */}
      <motion.div variants={staggerItem} className="glass-card p-4 space-y-2">
        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Findings Summary</div>
        {SEVERITIES.map(({ key, label, color }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{label}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${((summary[key] || 0) / Math.max(summary.total || 1, 1)) * 100}%`,
                    background: key === 'critical' ? '#ef4444' : key === 'high' ? '#f97316' : key === 'medium' ? '#f59e0b' : key === 'low' ? '#38bdf8' : '#64748b',
                  }}
                />
              </div>
              <span className={`text-xs font-bold w-4 text-right ${color}`}>{summary[key] || 0}</span>
            </div>
          </div>
        ))}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-500">Total</span>
          <span className="text-sm font-bold text-white">{summary.total || 0}</span>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={staggerItem} className="flex gap-2">
        <button
          onClick={() => navigate(`/scans/${scan._id}`)}
          className="flex-1 btn-secondary flex items-center justify-center gap-1.5 text-sm py-2"
        >
          <BarChart2 size={14} />
          View Details
        </button>
        <button
          onClick={() => navigate(`/scans/${scan._id}/report`)}
          className="flex-1 btn-primary flex items-center justify-center gap-1.5 text-sm py-2"
        >
          <FileText size={14} />
          Full Report
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ScanResults;
