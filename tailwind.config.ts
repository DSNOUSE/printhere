import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-albert-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#FAF7E9',
        teal: {
          DEFAULT: '#164E54',
          light: '#1A6269',
          dark: '#0F3A3F',
        },
        magenta: {
          DEFAULT: '#8B1A5C',
          light: '#9D2A6C',
          dark: '#6B1248',
        },
        border: '#E5E0CC',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}
export default config
