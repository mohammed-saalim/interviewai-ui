/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif']
      },
      colors: {
        'blue': '#3369FF',
        'gray': '#757575',
        'white': '#ffffff',
        'green': '#3ABF38'
      }
    },
    plugins: [],
  }