// craco.config.js
const cracoAlias = require('craco-alias');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  style: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
    {
      plugin: cracoAlias,
      options: {
        source: 'tsconfig',
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: '.',
        /* tsConfigPath should point to the file where "baseUrl" and "paths" 
          are specified */
        tsConfigPath: './tsconfig.path.json',
      },
    },
  ],
};
