import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services';
import { staggerContainer, staggerItem } from '../animations';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handlePassChange = (e) => setPassForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userService.updateProfile({ name: form.name });
      updateUser(res.data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSavingPass(true);
    try {
      await userService.changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      toast.success('Password changed successfully');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5 max-w-2xl mx-auto">
      <motion.div variants={staggerItem}>
        <h1 className="text-lg font-bold text-white">Profile Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your account information</p>
      </motion.div>

      {/* Avatar/info card */}
      <motion.div variants={staggerItem} className="glass-card p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00ff9d]/20 to-[#38bdf8]/20 border border-[#00ff9d]/20 flex items-center justify-center text-xl font-bold text-[#00ff9d]">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <div className="font-semibold text-white">{user?.name}</div>
          <div className="text-sm text-slate-500">{user?.email}</div>
          <div className="text-xs text-slate-600 mt-0.5 capitalize">{user?.role} · {user?.scanCount || 0} scans</div>
        </div>
      </motion.div>

      {/* Profile form */}
      <motion.div variants={staggerItem} className="glass-card p-6">
        <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
          <User size={14} className="text-[#00ff9d]" />
          Personal Information
        </h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="cyber-input" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Email</label>
            <input type="email" name="email" value={form.email} className="cyber-input opacity-50 cursor-not-allowed" disabled />
            <p className="text-[11px] text-slate-600 mt-1">Email cannot be changed</p>
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 text-sm px-4 py-2 disabled:opacity-50">
            <Save size={14} />{saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>

      {/* Password form */}
      <motion.div variants={staggerItem} className="glass-card p-6">
        <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
          <Key size={14} className="text-[#38bdf8]" />
          Change Password
        </h2>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          {[
            { name: 'currentPassword', label: 'Current Password' },
            { name: 'newPassword', label: 'New Password' },
            { name: 'confirmPassword', label: 'Confirm New Password' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">{field.label}</label>
              <input
                type="password"
                name={field.name}
                value={passForm[field.name]}
                onChange={handlePassChange}
                className="cyber-input"
                required
              />
            </div>
          ))}
          <button type="submit" disabled={savingPass} className="btn-secondary flex items-center gap-2 text-sm px-4 py-2 disabled:opacity-50">
            <Key size={14} />{savingPass ? 'Saving...' : 'Update Password'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
