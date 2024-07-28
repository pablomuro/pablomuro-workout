module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  darkMode: 'media',
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      ringWidth: ['active'],
      ringColor: ['active'],
      ringOpacity: ['active'],
      ringOffsetWidth: ['active'],
      ringOffsetColor: ['active'],
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
