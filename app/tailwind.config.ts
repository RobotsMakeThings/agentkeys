import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // AKey Design System V4
        canvas: '#040405',
        panel: '#0b0c0f',
        card: '#121318',
        elevated: '#1a1b21',
        primary: '#ffffff',
        secondary: '#a1a1aa',
        muted: '#71717a',
        accent: '#d4d4d8',
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#38bdf8',
        
        // Borders
        subtle: 'rgba(255,255,255,0.06)',
        medium: 'rgba(255,255,255,0.12)',
        
        // Original colors
        'primary-old': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'neural-pulse': 'neuralPulse 3s ease-in-out infinite',
        'data-stream': 'dataStream 2s linear infinite',
      },
      keyframes: {
        neuralPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        dataStream: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
