/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

const lightbg = '#fff';
const darkbg = '#000';
const brand = colors.blue[500];

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...fontFamily.sans],
        head: ['Inter var', ...fontFamily.sans],
      },
      colors: { brand, lightbg, darkbg },
      fontSize: {
        '2xs': '0.65rem',
      },
    },
  },
};

module.exports = config;
