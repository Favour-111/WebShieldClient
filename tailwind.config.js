/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00ff9d',
          50: '#edfff6',
          100: '#d5ffec',
          200: '#aeffda',
          300: '#70ffc0',
          400: '#2bffa0',
          500: '#00ff9d',
          600: '#00cc7a',
          700: '#00a362',
          800: '#007d4d',
          900: '#006640',
        },
        secondary: {
          DEFAULT: '#0f172a',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          DEFAULT: '#38bdf8',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#38bdf8',
        success: '#00ff9d',
        background: '#020617',
        surface: 'rgba(15,23,42,0.8)',
        border: 'rgba(0,255,157,0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cyber':
          'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)',
        'glow-primary':
          'radial-gradient(circle, rgba(0,255,157,0.15) 0%, transparent 70%)',
        'glow-accent':
          'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon-primary': '0 0 20px rgba(0,255,157,0.3), 0 0 40px rgba(0,255,157,0.1)',
        'neon-accent': '0 0 20px rgba(56,189,248,0.3), 0 0 40px rgba(56,189,248,0.1)',
        'neon-danger': '0 0 20px rgba(239,68,68,0.3), 0 0 40px rgba(239,68,68,0.1)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
        glass: '0 8px 32px rgba(0,0,0,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'scan-line': 'scanLine 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,255,157,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0,255,157,0.6), 0 0 60px rgba(0,255,157,0.3)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
