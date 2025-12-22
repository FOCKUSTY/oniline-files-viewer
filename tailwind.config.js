module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#ededed',
        component: '#272727',
        card: '#27272790',
        'smooth-background': '#111111',
        'mini-text': '#ededed40',
      },
      typography: {
        invert: {
          css: {
            '--tw-prose-body': '#ededed',
            '--tw-prose-headings': '#ffffff',
            '--tw-prose-lead': '#d4d4d4',
            '--tw-prose-links': '#60a5fa',
            '--tw-prose-bold': '#ffffff',
            '--tw-prose-counters': '#a3a3a3',
            '--tw-prose-bullets': '#525252',
            '--tw-prose-hr': '#374151',
            '--tw-prose-quotes': '#f3f4f6',
            '--tw-prose-quote-borders': '#374151',
            '--tw-prose-captions': '#9ca3af',
            '--tw-prose-code': '#ffffff',
            '--tw-prose-pre-code': '#d1d5db',
            '--tw-prose-pre-bg': '#1f2937',
            '--tw-prose-th-borders': '#374151',
            '--tw-prose-td-borders': '#374151',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}