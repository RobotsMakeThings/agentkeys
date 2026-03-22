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
        background: '#04030a',
        foreground: '#f5f2ef',
        'accent-violet': '#9333ea',
        'accent-pink': '#ec4899',
        'accent-amber': '#f59e0b',
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
      },
      borderRadius: {
        panel: '30px',
        card: '18px',
        button: '14px',
      },
      animation: {
        'slide-up': 'slideUp 0.6s cubic-bezier(.22,1,.36,1) both',
        'fade-in': 'fadeIn 0.5s cubic-bezier(.22,1,.36,1) both',
      },
    },
  },
  plugins: [],
}
export default config
