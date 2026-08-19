export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'selector',
  theme: {
    extend: {
      /**
       * Literal values so Tailwind can generate alpha variants (bg-canvas/95).
       * The same values exist as CSS custom properties in index.css for SVG
       * stroke/fill use — keep the two in sync.
       */
      colors: {
        canvas: '#f4f2ed',
        surface: '#eae7e0',
        ink: '#111111',
        graphite: '#555555',
        hairline: '#d8d4cc',
        accent: '#d94f2b',
        signal: '#1f4d46'
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        heading: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace']
      },
      fontSize: {
        /* mono notation only — index, labels, coordinates, status */
        micro: ['0.625rem', { lineHeight: '1.1', letterSpacing: '0.14em' }],
        label: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.12em' }],
        /* reading scale: substantive text must never become fine print at 1920 */
        'read-sm': ['clamp(0.875rem, 0.62vw, 1.02rem)', { lineHeight: '1.55' }],
        read: ['clamp(0.98rem, 0.82vw, 1.2rem)', { lineHeight: '1.62' }],
        'read-lg': ['clamp(1.08rem, 1.02vw, 1.45rem)', { lineHeight: '1.58' }],
        'display-xl': ['clamp(3.4rem, 15vw, 13.5rem)', { lineHeight: '0.82', letterSpacing: '-0.045em' }],
        'display-1': ['clamp(2.6rem, 8vw, 6.5rem)', { lineHeight: '0.88', letterSpacing: '-0.035em' }],
        'display-2': ['clamp(1.9rem, 4.4vw, 3.4rem)', { lineHeight: '0.98', letterSpacing: '-0.025em' }],
        'display-3': ['clamp(1.35rem, 2.4vw, 1.85rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'body-lg': ['clamp(1.02rem, 1.35vw, 1.28rem)', { lineHeight: '1.5' }]
      },
      transitionTimingFunction: {
        atlas: 'cubic-bezier(0.16, 0.84, 0.24, 1)'
      }
    }
  }
}
