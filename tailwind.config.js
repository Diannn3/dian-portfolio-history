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
        /* FROZEN — the hero composition depends on these exact values */
        micro: ['0.625rem', { lineHeight: '1.1', letterSpacing: '0.14em' }],
        label: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.12em' }],
        'display-xl': ['clamp(3.4rem, 15vw, 13.5rem)', { lineHeight: '0.82', letterSpacing: '-0.045em' }],
        'display-1': ['clamp(2.6rem, 8vw, 6.5rem)', { lineHeight: '0.88', letterSpacing: '-0.035em' }],

        /* Reading scale — fluid with real lower bounds so nothing goes microscopic
           on 1920 and nothing overflows at 390. */
        note: ['clamp(0.84rem, 0.2vw + 0.8rem, 0.94rem)', { lineHeight: '1.6' }],
        body: ['clamp(0.95rem, 0.32vw + 0.88rem, 1.08rem)', { lineHeight: '1.62' }],
        'body-lg': ['clamp(1.08rem, 0.68vw + 0.95rem, 1.36rem)', { lineHeight: '1.5' }],
        'display-3': ['clamp(1.4rem, 1.5vw + 0.95rem, 2.05rem)', { lineHeight: '1.12', letterSpacing: '-0.015em' }],
        'display-2': ['clamp(2rem, 3.4vw + 0.7rem, 3.6rem)', { lineHeight: '0.98', letterSpacing: '-0.025em' }]
      },
      transitionTimingFunction: {
        atlas: 'cubic-bezier(0.16, 0.84, 0.24, 1)'
      }
    }
  }
}
