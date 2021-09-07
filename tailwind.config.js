const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './styles/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fill: {
        background: 'var(--background-color)'
      },
      colors: {
        primary: {
          DEFAULT: 'var(--primary-color)',
        },
        paper: {
          DEFAULT: 'var(--paper-color)'
        },
        secondary: {
          DEFAULT: 'var(--secondary-color)',
        },
        background: {
          DEFAULT: 'var(--background-color)',
        },
        foreground: {
          DEFAULT: 'var(--foreground-color)'
        },
        input: {
          DEFAULT: 'var(--input-color)'
        }
      },
      minHeight: {
        '1': '1px'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
