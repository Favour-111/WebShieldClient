import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Shield } from 'lucide-react';
import ScanForm from '../components/scanner/ScanForm';
import ScanProgress from '../components/scanner/ScanProgress';
import ScanResults from '../components/scanner/ScanResults';
import { useScan } from '../context/ScanContext';
import { scanService } from '../services';
import { staggerContainer, staggerItem } from '../animations';

const Scanner = () => {
  const { activeScan, scanProgress, scanPhase, scanStatus, liveVulnerabilities, joinScanRoom } = useScan();
  const [currentScan, setCurrentScan] = useState(null);

  const handleScanStarted = (scan) => {
    setCurrentScan(scan);
    joinScanRoom(scan._id);
  };

  const scanId = currentScan?._id;
  const progress = scanId ? (scanProgress[scanId] ?? 0) : 0;
  const phase = scanId ? (scanPhase[scanId] ?? '') : '';
  const liveVulns = scanId ? (liveVulnerabilities[scanId] ?? []) : [];

  // Use context scanStatus as the source of truth (overrides stale local status)
  const effectiveStatus = scanId ? (scanStatus[scanId] || currentScan?.status) : null;
  const isCompleted = effectiveStatus === 'completed';
  const isActive = effectiveStatus && !['completed', 'failed', 'stopped'].includes(effectiveStatus);

  // Merge the live status back into currentScan for child components
  const scanWithStatus = currentScan ? { ...currentScan, status: effectiveStatus || currentScan.status } : null;

  // Sync active scan from context
  useEffect(() => {
    if (activeScan && activeScan._id !== currentScan?._id) {
      setCurrentScan(activeScan);
    }
  }, [activeScan]);

  useEffect(() => {
    if (!scanId || effectiveStatus !== 'completed') return;

    const hasFinalData = Boolean(currentScan?.completedAt) || currentScan?.summary?.total > 0;

    if (hasFinalData) return;

    let cancelled = false;

    const hydrateCompletedScan = async () => {
      try {
        const res = await scanService.getScanById(scanId);
        if (!cancelled && res.data?.scan) {
          setCurrentScan(res.data.scan);
        }
      } catch (error) {
        console.error('Failed to load completed scan details', error);
      }
    };

    hydrateCompletedScan();

    return () => {
      cancelled = true;
    };
  }, [scanId, effectiveStatus, currentScan?.summary?.total, currentScan?.riskScore, currentScan?.duration]);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 max-w-5xl mx-auto">
      {/* Page header */}
      <motion.div variants={staggerItem} className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/20 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-[#00ff9d]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Security Scanner</h1>
          <p className="text-xs text-slate-500">Configure and launch web application vulnerability scans</p>
        </div>
      </motion.div>

      {/* Active scan banner on mobile */}
      {scanWithStatus && isActive && (
        <motion.div variants={staggerItem} className="md:hidden glass-card p-4 border-[#00ff9d]/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
            <span className="text-sm font-semibold text-white">Scan Running — {progress}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full scan-progress-bar rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          {phase && (
            <p className="text-[11px] text-slate-500 font-mono mt-1.5 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#00ff9d] inline-block animate-pulse" />
              {phase}...
            </p>
          )}
        </motion.div>
      )}

      <motion.div variants={staggerItem} className="grid md:grid-cols-5 gap-4">
        {/* Left: form (3/5) — pushed below progress panel on mobile when active */}
        <div className={`md:col-span-3 glass-card p-4 md:p-6 ${scanWithStatus ? 'order-2 md:order-1' : ''}`}>
          <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <Play size={14} className="text-[#00ff9d]" />
            New Scan
          </h2>
          <ScanForm onScanStarted={handleScanStarted} />
        </div>

        {/* Right: progress or results (2/5) */}
        <div className={`md:col-span-2 glass-card p-4 md:p-6 ${scanWithStatus ? 'order-1 md:order-2' : ''}`}>
          {!scanWithStatus ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-8">
              <div className="w-14 h-14 rounded-full bg-white/3 border border-white/8 flex items-center justify-center">
                <Shield className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-sm text-slate-500">No active scan</p>
              <p className="text-xs text-slate-600">Configure and start a scan on the left</p>
            </div>
          ) : isCompleted ? (
            <>
              <h2 className="text-sm font-semibold text-white mb-5">Scan Results</h2>
              <ScanResults scan={scanWithStatus} liveVulns={liveVulns} />
            </>
          ) : (
            <>
              <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
                Live Progress
              </h2>
              <ScanProgress
                scan={scanWithStatus}
                progress={progress}
                phase={phase}
                liveVulns={liveVulns}
                onUpdate={setCurrentScan}
              />
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Scanner;
