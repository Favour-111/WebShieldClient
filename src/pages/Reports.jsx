import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Eye, Trash2, Calendar, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { reportService } from '../services';
import { formatDateTime, getRiskLevel } from '../utils/helpers';
import Pagination from '../components/common/Pagination';
import { staggerContainer, staggerItem } from '../animations';

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await reportService.getReports({ page, limit: 10 });
      setReports(res.data.reports || []);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch { toast.error('Failed to load reports'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, [page]);

  const handleDelete = async (reportId) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await reportService.deleteReport(reportId);
      setReports((r) => r.filter((x) => x._id !== reportId));
      toast.success('Report deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Security Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">Generated reports from completed scans</p>
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="glass-card">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center p-3">
                {[40, 20, 15, 15].map((w, j) => (
                  <div key={j} className="skeleton h-4 rounded" style={{ width: `${w}%` }} />
                ))}
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No reports yet</p>
            <p className="text-slate-600 text-xs mt-1">Generate a report from a completed scan</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {reports.map((report, idx) => {
              const scan = report.scan;
              const rs = scan?.riskScore;
              return (
                <motion.div
                  key={report._id}
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 p-4 hover:bg-white/2 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-[#00ff9d]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-200 truncate">
                      {scan?.scanName || scan?.targetUrl || 'Security Report'}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Globe size={9} />{scan?.targetUrl}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Calendar size={9} />{formatDateTime(report.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <span className={`text-xs font-bold font-mono ${rs >= 75 ? 'text-red-400' : rs >= 50 ? 'text-orange-400' : rs >= 25 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {rs ?? '—'}
                    </span>
                    <span className="text-[10px] text-slate-600">{getRiskLevel(rs)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => navigate(`/scans/${scan?._id || scan}/report`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#38bdf8] hover:bg-[#38bdf8]/10 transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex justify-center">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Reports;
