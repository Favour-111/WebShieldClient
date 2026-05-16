import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Palette, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services';
import { staggerContainer, staggerItem } from '../animations';

const Toggle = ({ checked, onChange, label, desc }) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="text-sm text-slate-200 font-medium">{label}</div>
      {desc && <div className="text-xs text-slate-500 mt-0.5">{desc}</div>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-[#00ff9d]' : 'bg-slate-700'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  </div>
);

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: user?.settings?.emailNotifications ?? true,
    theme: user?.settings?.theme || 'dark',
    timezone: user?.settings?.timezone || 'UTC',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userService.updateProfile({ settings });
      updateUser(res.data.user);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = (key) => (val) => setSettings((s) => ({ ...s, [key]: val }));

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5 max-w-2xl mx-auto">
      <motion.div variants={staggerItem}>
        <h1 className="text-lg font-bold text-white">Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Customize your WebShield experience</p>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={staggerItem} className="glass-card p-6">
        <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
          <Bell size={14} className="text-[#00ff9d]" />
          Notifications
        </h2>
        <div className="space-y-4">
          <Toggle
            checked={settings.emailNotifications}
            onChange={toggleSetting('emailNotifications')}
            label="Email Notifications"
            desc="Receive email alerts when scans complete or critical vulnerabilities are found"
          />
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={staggerItem} className="glass-card p-6">
        <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
          <Palette size={14} className="text-[#38bdf8]" />
          Appearance
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Theme</label>
            <div className="flex gap-2">
              {['dark', 'darker'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSettings((s) => ({ ...s, theme: t }))}
                  className={`px-4 py-2 rounded-xl text-sm capitalize border transition-all ${
                    settings.theme === t
                      ? 'border-[#00ff9d]/40 bg-[#00ff9d]/10 text-[#00ff9d]'
                      : 'border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings((s) => ({ ...s, timezone: e.target.value }))}
              className="cyber-input"
            >
              {['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Singapore'].map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div variants={staggerItem}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2 text-sm px-6 py-2.5 disabled:opacity-50"
        >
          <Save size={14} />{saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
