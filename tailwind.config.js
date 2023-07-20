
module.exports = {
  purge: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
   theme: {
     extend: {
      colors: {
        white: '#FFFFFF',    // Blanc
        black: '#000000',    // Noir pur
        gray_black: '#222425',    // Noir grisâtre
        gray_white: '#DFDFDF',    // Blanc grisâtre
        purple: '#451BDE',    // Violet
        success: '#1B9C85', //Vert
        warning: '#F4D160', // Jaune
        danger: '#E74646' //Rouge
      },
      fontFamily: {
        sans: ['Gilroy'],
        medium: ['Gilroy-Medium.ttf'],
        bold: ['Gilroy-Bold.ttf'],
        semibold: ['Gilroy-SemiBold.ttf'],
      },
     },
   },
   variants: {
     extend: {},
   },
   plugins: [require("daisyui")],
   
   daisyui: {
    themes: [],
  },
 }
