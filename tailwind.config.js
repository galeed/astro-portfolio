/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'theme': {
          'bg-main': 'var(--bg-main)',
          'bg-card': 'var(--bg-card)',
          'bg-card-hover': 'var(--bg-card-hover)',
          'bg-status': 'var(--status-bar-bg)',
          'fg-main': 'var(--fg-main)',
          'fg-dim': 'var(--fg-dim)',
          'fg-bright': 'var(--fg-bright)',
          'accent': 'var(--accent)',
          'accent-secondary': 'var(--accent-secondary)',
          'border': 'var(--border-color)',
          'border-active': 'var(--border-active)',
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Share Tech Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px var(--glow-color)',
        'glow-lg': '0 0 40px var(--glow-color)',
        'glow-xl': '0 0 60px var(--glow-color)',
      },
      animation: {
        'crt-flicker': 'crtFlicker 0.15s infinite',
      },
    },
  },
  plugins: [],
}
