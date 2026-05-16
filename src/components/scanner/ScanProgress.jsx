import { motion } from 'framer-motion';
import { Pause, Play, Square, Loader2, CheckCircle, XCircle, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { scanService } from '../../services';
import { getSeverityBg } from '../../utils/helpers';

const ScanProgress = ({ scan, progress = 0, phase = '', liveVulns = [], onUpdate }) => {
  if (!scan) return null;

  const isRunning = scan.status === 'running';
  const isPaused = scan.status === 'paused';
  const isCompleted = scan.status === 'completed';
  const isFailed = scan.status === 'failed';
  const isStopped = scan.status === 'stopped';

  const handlePause = async () => {
    try {
      await scanService.pauseScan(scan._id);
      onUpdate?.({ ...scan, status: 'paused' });
      toast('Scan paused', { icon: '⏸️' });
    } catch (e) {
      toast.error('Failed to pause scan');
    }
  };

  const handleResume = async () => {
    try {
      await scanService.resumeScan(scan._id);
      onUpdate?.({ ...scan, status: 'running' });
      toast('Scan resumed', { icon: '▶️' });
    } catch (e) {
      toast.error('Failed to resume scan');
    }
  };

  const handleStop = async () => {
    try {
      await scanService.stopScan(scan._id);
      onUpdate?.({ ...scan, status: 'stopped' });
      toast('Scan stopped', { icon: '⏹️' });
    } catch (e) {
      toast.error('Failed to stop scan');
    }
  };

  const displayProgress = isCompleted ? 100 : progress;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Status header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isRunning && <Activity className="w-4 h-4 text-[#00ff9d] animate-pulse" />}
          {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          {isFailed && <XCircle className="w-4 h-4 text-red-400" />}
          {(isPaused || isStopped) && <Loader2 className="w-4 h-4 text-slate-400" />}
          <span className="text-sm font-semibold text-white capitalize">
            {scan.status} {isRunning || isPaused ? `— ${displayProgress}%` : ''}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {(isRunning || isPaused) && (
            <>
              <button
                onClick={isRunning ? handlePause : handleResume}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title={isRunning ? 'Pause' : 'Resume'}
              >
                {isRunning ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                onClick={handleStop}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                title="Stop"
              >
                <Square size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full scan-progress-bar rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${displayProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        {phase && isRunning && (
          <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#00ff9d] inline-block animate-pulse" />
            {phase}...
          </p>
        )}
      </div>

      {/* Target info */}
      <div className="p-3 rounded-xl bg-white/3 border border-white/5">
        <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Target</div>
        <div className="text-xs text-slate-300 font-mono break-all">{scan.targetUrl}</div>
      </div>

      {/* Live vulnerabilities */}
      {liveVulns.length > 0 && (
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Live Findings ({liveVulns.length})
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {liveVulns.map((vuln, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/3"
              >
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getSeverityBg(vuln.severity)}`}>
                  {vuln.severity?.toUpperCase()}
                </span>
                <span className="text-xs text-slate-300 truncate">{vuln.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ScanProgress;
