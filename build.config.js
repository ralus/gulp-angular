/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {

  globs: {
    build: './.build/',
    compile: './public/',
    assets: './source/assets/',
    app: './source/app/',
    watch: [
      './source/**/*.styl',
      './source/assets/images/**/*',
      './source/**/*.js',
      './source/vendor/**/*.js',
      './source/htdocs/**'
    ]
  },

  appFiles: {
    js: [ 
      {
        input: './source/app/app.js',
        output: 'app.js',
      }
    ],
    
    templates: [ 
      './source/app/**/*.tpl.html',
      './source/common/**/*.tpl.html'
    ],

    images: [ './source/assets/images/**' ],
    html: [ './source/htdocs/index.html' ],
    htdocs: [ './source/htdocs/**' ],
    styl: {
      file:'./source/assets/styles/app.styl',
      import:'./source/app/**/*.styl'
    }
  },

  vendorFiles: {
    js: [
      './vendor/jquery-1.11.1.js',
      './vendor/angular/angular.js',
      './vendor/angular-animate.js',
      './vendor/angular-touch.js',
      './vendor/angular-ui-router.js'
    ],
    css: [],
    assets: []
  },
};
