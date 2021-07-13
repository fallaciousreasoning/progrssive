const colors = require('tailwindcss/colors');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary-color)',
          hover: 'var(--secondary-hover-color)' // TODO: Change opacity instead.
        },
        secondary: {
          DEFAULT: 'var(--secondary-color)',
          hover: 'var(--secondary-hover-color)' // TODO: Change background opacity
        },
        background: {
          DEFAULT: 'var(--background-color)',
          hover: colors.gray['300']
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
