/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'theme-bg-main': 'var(--bg-main)',
        'theme-bg-card': 'var(--bg-card)',
        'theme-bg-card-hover': 'var(--bg-card-hover)',
        'theme-fg-main': 'var(--fg-main)',
        'theme-fg-dim': 'var(--fg-dim)',
        'theme-fg-bright': 'var(--fg-bright)',
        'theme-accent': 'var(--accent)',
        'theme-accent-secondary': 'var(--accent-secondary)',
        'theme-border': 'var(--border-color)',
        'theme-border-active': 'var(--border-active)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Share Tech Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px var(--glow-color)',
        'glow-lg': '0 0 40px var(--glow-color)',
      },
    },
  },
  plugins: [],
}
