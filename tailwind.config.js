export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        graphite: 'var(--graphite)',
        hairline: 'var(--hairline)',
        accent: 'var(--accent)',
        signal: 'var(--signal)'
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        heading: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace']
      },
      fontSize: {
        micro: ['0.625rem', { lineHeight: '1.1', letterSpacing: '0.14em' }],
        label: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.12em' }],
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
