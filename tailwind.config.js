const colors = require('tailwindcss/colors');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary-color)',
        },
        secondary: {
          DEFAULT: 'var(--secondary-color)',
        },
        background: {
          DEFAULT: 'var(--background-color)',
        },
        foreground: 'var(--foreground-color)'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
