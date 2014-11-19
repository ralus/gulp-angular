var gulp = require('gulp'),
    gulpif   = require('gulp-if'),
    
    stylus   = require('gulp-stylus'),
    nib   = require('nib'),
    autoprefixer = require('autoprefixer-stylus'),
    minifycss = require('gulp-minify-css'),

    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),

    watchify = require('watchify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    ngannotate = require('gulp-ng-annotate'),
    nghtmljs = require('gulp-ng-html2js'),

    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    stripDebug = require('gulp-strip-debug'),
    livereload = require('gulp-livereload'),

    del = require('del'),
    join = require('path').join,

    PRODUCTION = process.env.ENV === 'production',
    SVR_PORT = 3333,
    LR_PORT = 35729;

var livereloadServer;
var config = require('./build.config.js');

gulp.task('browserify', ['templates'], function(cb) {
  return createBundles(config.appFiles.js);
});

gulp.task('templates', function(cb) {
  return gulp.src(config.appFiles.templates)
    .pipe(nghtmljs({
      moduleName: 'templates',
    }))
    .pipe(concat('templates.js'))
    .pipe(gulpif(PRODUCTION, uglify()))
    .pipe(gulp.dest(config.globs.app));
});

gulp.task('stylus', function(cb) {
  return gulp.src(config.appFiles.styl.file)
    .pipe(stylus({ 
      use:[
        autoprefixer({browsers:['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}),
        nib()
      ],
      errors:true, 
      import: config.appFiles.styl.import,
      sourcemap: {inline: true} 
    }))
    .on('error', errorHandler)
    .pipe(gulpif(PRODUCTION, minifycss()))
    .pipe(gulp.dest(join(config.globs.compile, 'css/')))
    // .pipe(notify({ message: 'Styles task complete' }))
});

gulp.task('images', function(cb) {
  return gulp.src(config.appFiles.images)
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(changed(join(config.globs.compile, 'images')))
    .pipe(imagemin())
    .pipe(gulp.dest(join(config.globs.compile, 'images')))
    // .pipe(notify({ message: 'Images task complete' }))
});

gulp.task('htdocs', function(cb) {
  return gulp.src(config.appFiles.htdocs)
    .pipe(gulp.dest(config.globs.compile))
    //.pipe(notify({ message: 'Htdocs task complete' }))
});

gulp.task('clean', function(cb) {
  del([config.globs.compile], cb);
});

gulp.task('setWatch', function(cb) {
  global.isWatching = true;
  cb();
});

gulp.task('watch', ['setWatch'], function(cb) {
  livereloadServer = livereload();

  gulp.start('build');
  // gulp.watch(paths.watch_styles, ['stylus']);
  // gulp.watch(paths.watch_images, ['images']);
  // gulp.watch(paths.watch_vendor, ['vendor']);
  // gulp.watch(config.appFiles.htdocs, ['htdocs']);
  // gulp.watch(config.globs.watch, livereloadServer.changed);
});

gulp.task('server', function(cb) {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({
    port: LR_PORT
  }));
  app.use(express.static(config.globs.compile));
  app.listen(SVR_PORT);

  console.log('Server running at: http://localhost:' + SVR_PORT + '/');

  cb();
});

gulp.task('build', ['htdocs', 'stylus', 'browserify', 'images']);
gulp.task('default', ['watch', 'server']);

// Helpers functions

function createBundle(options) {

  bundler = browserify({
    entries: options.input,
    extensions: options.extensions || [],
    debug: !PRODUCTION
  });

  rebundle = function () {
    var startTime = new Date().getTime();
    bundler.bundle()
    .on('error', errorHandler)
    .pipe(gulpif(PRODUCTION, stripDebug()))
    .pipe(source(options.output))
    .pipe(gulp.dest(join(config.globs.compile, 'js/')))
    .on('end', function(){
      var time = (new Date().getTime() - startTime) / 1000;
      console.log(options.output, 'was browserified:', (time + 's'));
      if (!!livereloadServer) {
        livereloadServer.changed({path:options.output});
      }
    })
    // .pipe(notify({message: 'Browserify completed' }))
  }
 
  if (global.isWatching) {
    bundler = watchify(bundler);
    bundler.on('update', rebundle);
  }
 
  rebundle();
}
 
function createBundles(bundles) {
  bundles.forEach(function (bundle) {
    createBundle({
      input : bundle.input,
      output : bundle.output,
      extensions : bundle.extensions || [],
      destination : bundle.destination
    });
  });
}

function errorHandler(error) {
  // notify.onError({
  //   title: 'Compile Error',
  //   message: '<%= error.message %>'
  // }).apply(this, arguments);
  console.log('Compile Error', error.message);

  // prevent gulp from hanging
  this.emit('end');
}