import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { fadeSlideUp } from '../animations';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      const message = serverErrors?.[0]?.msg
        || err.response?.data?.message
        || 'Login failed. Check your credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={fadeSlideUp} initial="hidden" animate="visible" className="w-full">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#00ff9d]/10 border border-[#00ff9d]/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#00ff9d]" />
          </div>
          <span className="font-bold text-white">WebShield<span className="text-[#00ff9d]">.</span></span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1.5">Welcome back</h1>
        <p className="text-slate-500 text-sm">Sign in to your security dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="cyber-input pl-10"
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="cyber-input pl-10 pr-10"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-t-[#020617] border-transparent rounded-full animate-spin" />
          ) : (
            <><LogIn size={16} /> Sign In</>
          )}
        </button>
      </form>

      {/* Demo credentials hint */}
      <div className="mt-4 p-3 rounded-xl bg-[#38bdf8]/5 border border-[#38bdf8]/15">
        <p className="text-[11px] text-slate-500 font-mono">
          Demo: <span className="text-[#38bdf8]">john@example.com</span> / <span className="text-[#38bdf8]">User@1234</span>
        </p>
      </div>

      <p className="text-center text-sm text-slate-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#00ff9d] hover:underline font-medium">Create one</Link>
      </p>
    </motion.div>
  );
};

export default Login;
