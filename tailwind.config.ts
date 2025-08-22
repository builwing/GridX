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
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        sudoku: {
          cell: '#ffffff',
          border: '#d1d5db',
          'border-thick': '#374151',
          selected: '#dbeafe',
          prefilled: '#f9fafb',
          error: '#fef2f2',
          'error-text': '#dc2626',
          correct: '#f0fdf4',
        }
      },
      animation: {
        'bounce-subtle': 'bounce 0.3s ease-in-out',
        'pulse-success': 'pulse 0.5s ease-in-out',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
export default config