/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wa: {
          green: '#00a884',
          darkgreen: '#008069',
          header: '#1f2c34',
          headerLight: '#008069',
          bgDark: '#0b141a',
          bgLight: '#efeae2',
          bubbleOutDark: '#005c4b',
          bubbleOutLight: '#d9fdd3',
          bubbleInDark: '#202c33',
          bubbleInLight: '#ffffff',
          blueTick: '#53bdeb',
          grayTick: '#8696a0',
          subtextDark: '#8696a0',
          subtextLight: '#667781',
          inputDark: '#2a3942',
          inputLight: '#ffffff',
        },
        ig: {
          dark: '#000000',
          cardDark: '#121212',
          borderDark: '#262626',
          bubbleOut: '#3797f0',
          bubbleOutGradFrom: '#7000ff',
          bubbleOutGradTo: '#0099ff',
          bubbleInDark: '#262626',
          bubbleInLight: '#efefef',
          textMuted: '#a8a8a8',
          heartRed: '#ff3040',
        },
        tw: {
          dark: '#000000',
          cardDark: '#16181c',
          borderDark: '#2f3336',
          borderLight: '#eff3f4',
          blue: '#1d9bf0',
          gray: '#71767b',
          grayLight: '#536471',
          retweet: '#00ba7c',
          like: '#f91880',
        },
        threads: {
          dark: '#101010',
          cardDark: '#181818',
          borderDark: '#282828',
          line: '#333333',
          textMuted: '#777777',
        }
      },
      aspectRatio: {
        '3/4': '3 / 4',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        sf: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', 'sans-serif'],
      },
      boxShadow: {
        'wa-bubble': '0 1px 0.5px rgba(11,20,26,0.13)',
        'float-panel': '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
