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
        background: '#0c0a18',
        foreground: '#f5f2ef',
        'accent-violet': '#9333ea',
        'accent-pink': '#ec4899',
        'accent-amber': '#f59e0b',
      },
      fontFamily: {
        sans: ['Satoshi', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
      },
      maxWidth: {
        site: '1180px',
      },
      borderRadius: {
        panel: '30px',
        card: '18px',
        button: '14px',
      },
      animation: {
        'bgDrift': 'bgDrift 22s ease-in-out infinite',
        'heroFloat': 'heroFloat 12s ease-in-out infinite',
        'heroSheen': 'heroSheen 15s ease-in-out infinite',
        'fadePageIn': 'fadePageIn .35s ease both',
        'signalPulse': 'signalPulse 2.4s ease-in-out infinite',
        'dotPulse': 'dotPulse 2.8s ease-in-out infinite',
        'ringPulse': 'ringPulse 4.8s ease-in-out infinite',
        'vaultFloat': 'vaultFloat 9.4s ease-in-out infinite',
        'templateFloat': 'templateFloat 8s ease-in-out infinite',
        'foundryAura': 'foundryAura 8s ease-in-out infinite',
        'fanBob': 'fanBob 6s ease-in-out infinite',
        'boxFloat': 'boxFloat 9.6s ease-in-out infinite',
        'packFloat': 'packFloat 8.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
