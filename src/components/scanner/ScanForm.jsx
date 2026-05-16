import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Shield, Globe, Play, ChevronDown } from 'lucide-react';
import { scanService } from '../../services';
import { fadeSlideUp } from '../../animations';

const SCAN_TYPES = [
  { value: 'quick', label: 'Quick Scan', desc: '~2 min · Basic checks', color: '#38bdf8' },
  { value: 'standard', label: 'Standard Scan', desc: '~5 min · Full OWASP Top 10', color: '#00ff9d', recommended: true },
  { value: 'deep', label: 'Deep Scan', desc: '~15 min · Comprehensive analysis', color: '#f59e0b' },
];

const ScanForm = ({ onScanStarted }) => {
  const [targetUrl, setTargetUrl] = useState('');
  const [scanName, setScanName] = useState('');
  const [scanType, setScanType] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [advanced, setAdvanced] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) {
      toast.error('Please enter a target URL');
      return;
    }

    setLoading(true);
    try {
      const { data } = await scanService.createScan({ targetUrl, scanName, scanType });
      toast.success('Scan initiated successfully');
      onScanStarted?.(data.scan);
      setTargetUrl('');
      setScanName('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start scan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={fadeSlideUp} initial="hidden" animate="visible">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Target URL */}
        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
            Target URL <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com"
              className="cyber-input pl-10"
              required
              disabled={loading}
            />
          </div>
          <p className="text-[11px] text-slate-600 mt-1.5">Enter the full URL including protocol (http:// or https://)</p>
        </div>

        {/* Scan Name */}
        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
            Scan Name <span className="text-slate-600">(optional)</span>
          </label>
          <input
            type="text"
            value={scanName}
            onChange={(e) => setScanName(e.target.value)}
            placeholder="My Security Assessment"
            className="cyber-input"
            disabled={loading}
          />
        </div>

        {/* Scan Type */}
        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
            Scan Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SCAN_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setScanType(type.value)}
                className={`relative p-3 rounded-xl border text-left transition-all ${
                  scanType === type.value
                    ? 'border-[#00ff9d]/40 bg-[#00ff9d]/5'
                    : 'border-white/8 hover:border-white/15 bg-white/2'
                }`}
              >
                {type.recommended && (
                  <span className="absolute -top-1.5 left-2 px-1.5 py-0.5 bg-[#00ff9d] text-[#020617] text-[9px] font-bold rounded uppercase tracking-wider">
                    Recommended
                  </span>
                )}
                <div className="text-xs font-semibold text-slate-200 mt-1">{type.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setAdvanced((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ChevronDown size={14} className={`transition-transform ${advanced ? 'rotate-180' : ''}`} />
            Advanced Options
          </button>

          {advanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-4 rounded-xl bg-white/3 border border-white/5 space-y-2"
            >
              <p className="text-xs text-slate-500 mb-3">Select vulnerability checks to include:</p>
              {[
                'SQL Injection', 'XSS', 'CSRF', 'Open Ports', 'Security Headers',
                'Weak Auth', 'Directory Traversal', 'Clickjacking', 'Insecure Cookies', 'Sensitive Data',
              ].map((check) => (
                <label key={check} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-3.5 h-3.5 rounded border-white/20 bg-transparent checked:bg-[#00ff9d] checked:border-[#00ff9d] accent-[#00ff9d]"
                  />
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{check}</span>
                </label>
              ))}
            </motion.div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !targetUrl.trim()}
          className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-t-[#020617] border-transparent rounded-full animate-spin" />
              Initializing Scan...
            </>
          ) : (
            <>
              <Play size={16} />
              Start Security Scan
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ScanForm;
