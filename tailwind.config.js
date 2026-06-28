/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: '#534AB7', light: '#EEEDFE', mid: '#AFA9EC', dark: '#3C3489' },
        teal:     { DEFAULT: '#1D9E75', light: '#E1F5EE', mid: '#5DCAA5' },
        surface:  { 0: '#F1EFE8', 1: '#F8F8F5', 2: '#FFFFFF' },
        ink:      { primary: '#2C2C2A', secondary: '#5F5E5A', muted: '#888780' },
        border:   { DEFAULT: '#E8E6DF', strong: '#C8C6BF' },
        danger:   { DEFAULT: '#E24B4A', light: '#FCEBEB' },
      },
    },
  },
  plugins: [],
};
