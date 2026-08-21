/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#E0F2FE', // subtle sky-blue accents
          DEFAULT: '#0284C7', // vibrant laundry blue
          dark: '#0070F3', // deep active blue
        },
        laundry: {
          blue: '#0284C7',
          deepBlue: '#0070F3',
          sky: '#E0F2FE',
          darkBg: '#0F172A',
          mutedText: '#64748B',
          bgLight: '#F8FAFC',
          success: '#10B981',
          pending: '#64748B',
          warning: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'clay-sm': '0 2px 4px 0 rgba(0,0,0,0.06), inset 0 2px 4px 0 rgba(255,255,255,0.8)',
        'clay-md': '0 8px 16px -2px rgba(2, 132, 199, 0.1), inset 0 2px 4px 0 rgba(255,255,255,0.8), inset 0 -4px 8px 0 rgba(0,0,0,0.05)',
        'clay-lg': '0 20px 25px -5px rgba(2, 132, 199, 0.15), inset 0 4px 8px 0 rgba(255,255,255,0.9), inset 0 -8px 16px 0 rgba(0,0,0,0.08)',
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'soft-lg': '0 10px 30px -5px rgba(15, 23, 42, 0.08)',
        'phone': '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
      },
      zIndex: {
        55: '55',
        60: '60',
        70: '70',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.8', transform: 'scale(1.03)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
