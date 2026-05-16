import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const ScanContext = createContext(null);

const getSocketUrl = () => {
  const rawApiUrl = import.meta.env.VITE_API_URL?.trim();

  if (!rawApiUrl) {
    return window.location.origin;
  }

  const normalizedApiUrl = rawApiUrl.replace(/\/+$/, '').replace(/\/api$/, '');

  if (normalizedApiUrl.startsWith('/')) {
    return window.location.origin;
  }

  try {
    return new URL(normalizedApiUrl).origin;
  } catch {
    return window.location.origin;
  }
};

export const ScanProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [activeScan, setActiveScan] = useState(null);
  const [scanProgress, setScanProgress] = useState({});
  const [scanPhase, setScanPhase] = useState({});
  const [scanStatus, setScanStatus] = useState({});
  const [liveVulnerabilities, setLiveVulnerabilities] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const token = localStorage.getItem('webshield_token');
    if (!token) return;

    const socket = io(getSocketUrl(), {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('[WebShield] Socket connected');
    });

    socket.on('scan:started', ({ scanId, targetUrl }) => {
      setActiveScan({ _id: scanId, targetUrl, status: 'running' });
      setScanProgress((prev) => ({ ...prev, [scanId]: 0 }));
      setScanStatus((prev) => ({ ...prev, [scanId]: 'running' }));
      setLiveVulnerabilities((prev) => ({ ...prev, [scanId]: [] }));
      toast('Scan started', { icon: '🔍' });
    });

    socket.on('scan:progress', ({ scanId, progress, phase }) => {
      setScanProgress((prev) => ({ ...prev, [scanId]: progress }));
      setScanPhase((prev) => ({ ...prev, [scanId]: phase }));
      setScanStatus((prev) => ({ ...prev, [scanId]: 'running' }));
    });

    socket.on('scan:vulnerability', ({ scanId, vulnerability }) => {
      setLiveVulnerabilities((prev) => ({
        ...prev,
        [scanId]: [vulnerability, ...(prev[scanId] || [])],
      }));
      const severityEmoji = { critical: '🔴', high: '🟠', medium: '🟡', low: '🔵', info: '⚪' };
      toast(`${severityEmoji[vulnerability.severity] || '⚠️'} ${vulnerability.title}`, {
        duration: 5000,
      });
    });

    socket.on('scan:completed', ({ scanId, summary, riskScore }) => {
      setActiveScan(null);
      setScanProgress((prev) => ({ ...prev, [scanId]: 100 }));
      setScanStatus((prev) => ({ ...prev, [scanId]: 'completed' }));
      toast.success(`Scan complete! Found ${summary?.total ?? 0} vulnerabilities`);
    });

    socket.on('scan:error', ({ scanId, error }) => {
      setActiveScan(null);
      setScanStatus((prev) => ({ ...prev, [scanId]: 'failed' }));
      toast.error(`Scan failed: ${error}`);
    });

    socket.on('disconnect', () => {
      console.log('[WebShield] Socket disconnected');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated]);

  const joinScanRoom = useCallback((scanId) => {
    socketRef.current?.emit('scan:join', scanId);
  }, []);

  const leaveScanRoom = useCallback((scanId) => {
    socketRef.current?.emit('scan:leave', scanId);
  }, []);

  return (
    <ScanContext.Provider
      value={{
        activeScan,
        scanProgress,
        scanPhase,
        scanStatus,
        liveVulnerabilities,
        joinScanRoom,
        leaveScanRoom,
        socket: socketRef.current,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => {
  const context = useContext(ScanContext);
  if (!context) throw new Error('useScan must be used within ScanProvider');
  return context;
};
