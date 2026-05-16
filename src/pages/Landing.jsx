import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Lock, BarChart2, ChevronRight, Terminal, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fadeSlideUp, staggerContainer, staggerItem } from '../animations';

const STATS = [
  { label: 'Scans Completed', value: '50,000+' },
  { label: 'Vulnerabilities Found', value: '2.4M+' },
  { label: 'Organizations Protected', value: '10,000+' },
  { label: 'Uptime', value: '99.99%' },
];

const FEATURES = [
  {
    icon: <Terminal className="w-5 h-5" />,
    title: 'OWASP Top 10 Coverage',
    desc: 'Comprehensive checks covering all OWASP Top 10 vulnerability categories including SQL Injection, XSS, CSRF, and more.',
  },
  {
    icon: <Activity className="w-5 h-5" />,
    title: 'Real-Time Monitoring',
    desc: 'Live WebSocket-powered scan progress with instant vulnerability discovery notifications.',
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    title: 'Executive Reports',
    desc: 'Generate detailed PDF security reports with risk scoring, CVSS analysis, and remediation guidance.',
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'Risk Scoring',
    desc: 'CVSS-based vulnerability scoring with detailed exploit risk assessment and compliance mapping.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Multiple Scan Modes',
    desc: 'Quick (2 min), Standard (5 min), and Deep (15 min) scan modes for any security requirement.',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Compliance Mapping',
    desc: 'Automated OWASP, PCI-DSS, and GDPR compliance status mapping for every finding.',
  },
];

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#00ff9d]" />
            </div>
            <span className="font-bold text-lg text-white">WebShield<span className="text-[#00ff9d]">.</span></span>
          </Link>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="btn-primary px-4 py-2 text-sm">
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/register" className="btn-primary px-4 py-2 text-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-24 px-6">
        {/* Grid bg */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(0,255,157,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        {/* Glow orb */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#00ff9d]/5 blur-3xl pointer-events-none" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative max-w-4xl mx-auto text-center"
        >
          <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/20 text-[#00ff9d] text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
            Enterprise Security Platform
          </motion.div>
          <motion.h1 variants={staggerItem} className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Scan. Detect.{' '}
            <span className="bg-gradient-to-r from-[#00ff9d] to-[#38bdf8] bg-clip-text text-transparent">
              Secure.
            </span>
          </motion.h1>
          <motion.p variants={staggerItem} className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            WebShield Scanner provides enterprise-grade web application vulnerability scanning with real-time insights, OWASP Top 10 coverage, and actionable remediation guidance.
          </motion.p>
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn-primary flex items-center gap-2 px-8 py-3 text-base">
              Start Free Scan <ChevronRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3 text-base">
              View Dashboard
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative mt-20 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {STATS.map((s) => (
            <motion.div key={s.label} variants={staggerItem} className="glass-card p-4 text-center">
              <div className="text-2xl font-extrabold text-[#00ff9d] font-mono">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white/1">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Enterprise-Grade Security</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Everything your security team needs to identify and remediate web application vulnerabilities.</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={staggerItem} className="glass-card p-5 hover:border-[#00ff9d]/20 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-[#00ff9d]/10 border border-[#00ff9d]/20 flex items-center justify-center text-[#00ff9d] mb-4 group-hover:bg-[#00ff9d]/15 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card-accent p-10"
          >
            <Shield className="w-10 h-10 text-[#00ff9d] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Ready to secure your applications?</h2>
            <p className="text-slate-500 mb-6 text-sm">Create a free account and run your first scan in under 60 seconds.</p>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
              Get Started — It's Free <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#00ff9d]" />
          <span className="font-semibold text-white text-sm">WebShield Scanner</span>
        </div>
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} WebShield. Enterprise Web Security Platform.</p>
      </footer>
    </div>
  );
};

export default Landing;
