import { formatDistanceToNow, format, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM d, yyyy HH:mm');
};

export const timeAgo = (date) => {
  if (!date) return 'N/A';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatDuration = (seconds) => {
  if (!seconds) return '0s';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

export const getSeverityColor = (severity) => {
  const colors = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#f59e0b',
    low: '#38bdf8',
    info: '#94a3b8',
  };
  return colors[severity?.toLowerCase()] || '#94a3b8';
};

export const getSeverityBg = (severity) => {
  const bgs = {
    critical: 'badge-critical',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
    info: 'badge-info',
  };
  return bgs[severity?.toLowerCase()] || 'badge-info';
};

export const getStatusColor = (status) => {
  const colors = {
    completed: 'text-emerald-400',
    running: 'text-[#00ff9d]',
    queued: 'text-[#38bdf8]',
    paused: 'text-amber-400',
    failed: 'text-red-400',
    stopped: 'text-slate-400',
  };
  return colors[status] || 'text-slate-400';
};

export const getStatusDot = (status) => {
  const colors = {
    completed: 'bg-emerald-400',
    running: 'bg-[#00ff9d] animate-pulse',
    queued: 'bg-[#38bdf8]',
    paused: 'bg-amber-400',
    failed: 'bg-red-400',
    stopped: 'bg-slate-500',
  };
  return colors[status] || 'bg-slate-500';
};

export const getRiskLevel = (score) => {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High';
  if (score >= 25) return 'Medium';
  return 'Low';
};

export const truncateUrl = (url, maxLen = 40) => {
  if (!url) return '';
  if (url.length <= maxLen) return url;
  return url.substring(0, maxLen) + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
