import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { fadeSlideUp } from '../animations';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      // Server returns either { message } or { errors: [{msg}] }
      const serverErrors = err.response?.data?.errors;
      const message = serverErrors?.[0]?.msg
        || err.response?.data?.message
        || 'Registration failed. Please try again.';
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
        <h1 className="text-2xl font-bold text-white mb-1.5">Create your account</h1>
        <p className="text-slate-500 text-sm">Start securing your web applications today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="cyber-input pl-10"
              required
              autoComplete="name"
            />
          </div>
        </div>

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
              placeholder="Min 8 characters"
              className="cyber-input pl-10 pr-10"
              required
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <p className="text-[11px] text-slate-600 mt-1.5">Must contain uppercase, lowercase &amp; a number</p>
        </div>

        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type={showPass ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              className="cyber-input pl-10"
              required
              autoComplete="new-password"
            />
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
            <><UserPlus size={16} /> Create Account</>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[#00ff9d] hover:underline font-medium">Sign in</Link>
      </p>
    </motion.div>
  );
};

export default Register;
