/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'eco-green': {
          50: '#e6fff3',
          100: '#ccffe7',
          200: '#99ffce',
          300: '#66ffb6',
          400: '#33ff9d',
          500: '#00ff88', // 生命绿
          600: '#00cc6d',
          700: '#009952',
          800: '#006636',
          900: '#00331b',
        },
        'smart-blue': {
          50: '#e6fbff',
          100: '#ccf7ff',
          200: '#99efff',
          300: '#66e7ff',
          400: '#33dfff',
          500: '#00d4ff', // 科技蓝
          600: '#00aacd',
          700: '#007f99',
          800: '#005566',
          900: '#002a33',
        },
        'earth-gold': {
          50: '#fff9e6',
          100: '#fff2cc',
          200: '#ffe699',
          300: '#ffd966',
          400: '#ffcd33',
          500: '#ffcc33', // 大地金
          600: '#cca329',
          700: '#997a1f',
          800: '#665214',
          900: '#33290a',
        },
        'dark-bg': {
          100: '#141d26',
          200: '#0a1118', // 核心底色
          300: '#05080c',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow': 'flow 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        flow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        }
      }
    },
  },
  plugins: [],
}
