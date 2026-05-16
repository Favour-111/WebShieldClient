import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-[#020617] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Animated background */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-[#00ff9d]/10 to-transparent"
              style={{
                left: `${(i / 20) * 100}%`,
                height: '100%',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00ff9d]/20 to-[#38bdf8]/20 border border-[#00ff9d]/30 flex items-center justify-center neon-primary">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L6 9v7c0 5.5 4.3 10.7 10 12 5.7-1.3 10-6.5 10-12V9L16 4z" fill="none" stroke="#00ff9d" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M12 16l3 3 6-6" stroke="#00ff9d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-white">WebShield</div>
              <div className="text-xs text-[#00ff9d] font-mono uppercase tracking-widest">Scanner</div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Enterprise Security<br />
            <span className="text-neon">Intelligence</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Detect, analyze, and remediate security vulnerabilities with real-time threat intelligence.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '10K+', label: 'Scans Run' },
              { value: '99.7%', label: 'Accuracy' },
              { value: '< 5min', label: 'Avg Scan' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div className="text-xl font-bold text-neon">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L6 9v7c0 5.5 4.3 10.7 10 12 5.7-1.3 10-6.5 10-12V9L16 4z" fill="none" stroke="#00ff9d" strokeWidth="2"/>
              </svg>
            </div>
            <span className="font-bold text-white">WebShield Scanner</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
