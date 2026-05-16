import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Calendar, Clock, FileText, Trash2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { scanService, vulnerabilityService, reportService } from '../services';
import { VulnerabilityTable } from '../components/common/VulnerabilityTable';
import ScanProgress from '../components/scanner/ScanProgress';
import { SeverityDonutChart } from '../components/dashboard/VulnerabilityChart';
import Pagination from '../components/common/Pagination';
import { getStatusColor, getStatusDot, formatDateTime, formatDuration } from '../utils/helpers';
import { staggerContainer, staggerItem } from '../animations';
import { useScan } from '../context/ScanContext';

const ScanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { scanProgress, scanPhase, liveVulnerabilities, joinScanRoom, leaveScanRoom } = useScan();

  const [scan, setScan] = useState(null);
  const [vulns, setVulns] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [vulnLoading, setVulnLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);

  const isActive = scan && ['running', 'paused', 'queued'].includes(scan.status);

  useEffect(() => {
    const fetchScan = async () => {
      try {
        const res = await scanService.getScanById(id);
        setScan(res.data.scan);
        if (['running', 'paused', 'queued'].includes(res.data.scan.status)) {
          joinScanRoom(id);
        }
      } catch {
        toast.error('Scan not found');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchScan();
    return () => leaveScanRoom(id);
  }, [id]);

  useEffect(() => {
    const fetchVulns = async () => {
      setVulnLoading(true);
      try {
        const res = await vulnerabilityService.getVulnerabilities({ scanId: id, page, limit: 10 });
        setVulns(res.data.vulnerabilities || []);
        setTotalPages(res.data.pagination?.pages || 1);
      } catch {}
      finally { setVulnLoading(false); }
    };
    fetchVulns();
  }, [id, page]);

  const handleStatusChange = async (vulnId, status) => {
    try {
      await vulnerabilityService.updateStatus(vulnId, status);
      setVulns((v) => v.map((x) => (x._id === vulnId ? { ...x, status } : x)));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      await reportService.generateReport(id);
      toast.success('Report generated!');
      navigate(`/scans/${id}/report`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this scan permanently?')) return;
    try {
      await scanService.deleteScan(id);
      toast.success('Scan deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete scan');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-t-[#00ff9d] border-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const progress = scanProgress[id] ?? scan?.progress ?? 0;
  const phase = scanPhase[id] ?? '';
  const liveVulns = liveVulnerabilities[id] ?? [];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5">
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">{scan?.scanName || scan?.targetUrl}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(scan?.status)}`} />
              <span className={`text-xs font-medium capitalize ${getStatusColor(scan?.status)}`}>{scan?.status}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {scan?.status === 'completed' && (
            <button
              onClick={handleGenerateReport}
              disabled={generatingReport}
              className="btn-primary flex items-center gap-1.5 text-sm px-3 py-2"
            >
              <FileText size={14} />
              {generatingReport ? 'Generating...' : 'Report'}
            </button>
          )}
          <button onClick={handleDelete} className="btn-secondary flex items-center gap-1.5 text-sm px-3 py-2 hover:border-red-500/40 hover:text-red-400">
            <Trash2 size={14} />
          </button>
        </div>
      </motion.div>

      {/* Meta info row */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Globe size={13} />, label: 'Target', value: scan?.targetUrl },
          { icon: <Calendar size={13} />, label: 'Started', value: formatDateTime(scan?.startedAt || scan?.createdAt) },
          { icon: <Clock size={13} />, label: 'Duration', value: scan?.duration ? formatDuration(scan.duration) : '—' },
          { icon: <AlertTriangle size={13} />, label: 'Risk Score', value: scan?.riskScore !== undefined ? scan.riskScore : '—' },
        ].map((item) => (
          <div key={item.label} className="glass-card p-3">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider mb-1">
              {item.icon}{item.label}
            </div>
            <div className="text-xs text-slate-200 font-medium truncate">{item.value}</div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={staggerItem} className="grid md:grid-cols-3 gap-4">
        {/* Severity chart */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Findings</h3>
          <SeverityDonutChart data={scan?.summary || {}} />
        </div>

        {/* Progress (if active) or summary */}
        {isActive && (
          <div className="md:col-span-2 glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
              Live Progress
            </h3>
            <ScanProgress
              scan={scan}
              progress={progress}
              phase={phase}
              liveVulns={liveVulns}
              onUpdate={setScan}
            />
          </div>
        )}

        {/* Vulnerability check flags */}
        {!isActive && scan?.scanChecks && (
          <div className="md:col-span-2 glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Scan Coverage</h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {Object.entries(scan.scanChecks).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-[#00ff9d]' : 'bg-slate-700'}`} />
                  <span className="text-xs text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Vulnerabilities list */}
      <motion.div variants={staggerItem} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Vulnerabilities</h3>
        <VulnerabilityTable
          vulnerabilities={vulns}
          onStatusChange={handleStatusChange}
          loading={vulnLoading}
        />
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ScanDetails;
