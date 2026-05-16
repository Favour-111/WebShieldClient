import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { fadeSlideUp } from '../animations';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6">
      <motion.div
        variants={fadeSlideUp}
        initial="hidden"
        animate="visible"
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#00ff9d]/10 border border-[#00ff9d]/20 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-[#00ff9d]" />
        </div>
        <div className="text-6xl font-extrabold text-[#00ff9d]/20 font-mono mb-3">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-slate-500 text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-secondary flex items-center gap-2 text-sm px-4 py-2">
            <ArrowLeft size={14} /> Go Back
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
            <Home size={14} /> Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
