/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'myblue': '#011f32',
        'mybg': '#001019',
        'myclr' : '#066a79',
        'myclr2' : '#4cc2cd',
        'myclr3' : '#EBF4F6',
        'myclr4' : '#011826',
      },
    }
  },
  plugins: [require("daisyui")],
}

