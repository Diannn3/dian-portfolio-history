import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        canvas: '#F4F2ED',
        ink: '#111111',
        graphite: '#555555',
        hairline: '#D8D4CC',
        accent: '#D94F2B',
        'accent-soft': '#F0E4DD',
        'ink-soft': '#2A2A2A',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(4.5rem, 12vw, 10rem)', { lineHeight: '0.9', letterSpacing: '-0.04em', fontWeight: '600' }],
        'display': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '600' }],
        'h1': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '500' }],
        'h2': ['clamp(1.75rem, 3.5vw, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.01em', fontWeight: '500' }],
        'h3': ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'micro': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '500' }],
        'mono-label': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.06em', fontWeight: '500' }],
      },
      spacing: {
        'gutter': 'clamp(1.5rem, 4vw, 4rem)',
        'section': 'clamp(6rem, 12vw, 12rem)',
      },
      maxWidth: {
        'editorial': '1440px',
      },
      borderColor: {
        DEFAULT: '#D8D4CC',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '1rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'line-grow': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'line-grow': 'line-grow 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
      },
    },
  },
  plugins: [animate],
};