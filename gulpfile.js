var gulp          = require('gulp'),
    runSequence   = require('run-sequence'),
    include       = require('gulp-include'),
    sass          = require('gulp-sass'),
    postcss       = require('gulp-postcss'),
    autoprefixer  = require('autoprefixer'),
    uglify        = require('gulp-uglify'),
    cssMqpacker   = require('css-mqpacker'),
    postcssFlex   = require('postcss-flexbugs-fixes'),
    postcssSvg    = require('postcss-svg'),
    postcssAssets = require('postcss-assets')
    rename        = require('gulp-rename'),
    browserSync   = require('browser-sync').create(),
    jade          = require('gulp-jade'),
    notify        = require('gulp-notify'),
    imagemin      = require('gulp-imagemin'),
    pngquant      = require('imagemin-pngquant'),
    svgmin        = require('gulp-svgmin'),
    ttf2woff      = require('gulp-ttf2woff'),
    ttf2woff2     = require('gulp-ttf2woff2'),
    ttf2eot       = require('gulp-ttf2eot');

//BrowserSync

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
        baseDir: "./dist"
    },
    notify: true,
    open: false
  });
});

//Styles task

gulp.task('styles', function () {
  var processors = [
    autoprefixer({browsers: ['> 1%', 'last 4 version', 'IE 9', 'IE 10', 'IE 11', 'Opera 12', 'Firefox ESR']}),
    cssMqpacker(),
    postcssSvg({paths: ['dist/img']}),
    postcssAssets({loadPaths: ['dist/img/']}),
    postcssFlex(),
  ];
  return gulp.src('src/assets/stylesheets/style.sass')
  .pipe(sass().on('error', notify.onError()))
  .pipe(postcss(processors))
  .pipe(gulp.dest('dist/css/'))
  .pipe(browserSync.stream());
});

//Jade task

gulp.task('jade', function() {
  return gulp.src('src/views/pages/**/*.jade')
  .pipe(jade({pretty: true}).on('error', notify.onError(function (error) {
    return 'Message to the notifier: ' + error.message;
  })))
  .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
  gulp.src('src/assets/js/scripts.js')
    .pipe(include())
    .pipe(uglify().on('error', notify.onError(function (error) {
      return 'Message to the notifier: ' + error.message;
    })))
    .pipe(gulp.dest('dist/js/'));
});

//optimization img(jpg,png)

gulp.task('optimizationIMG', () => {
  return gulp.src(['src/assets/img/**/*.png', 'src/assets/img/**/*.jpg'])
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/img/'));
});

//optimization svg

gulp.task('optimizationSVG', function () {
  return gulp.src('src/assets/img/**/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('dist/img/'));
});

//Convert fonts(ttf to woff,woff2,eot):

//ttf to woff

gulp.task('ttf2woff', function(){
  gulp.src(['src/assets/fonts/*.ttf'])
    .pipe(ttf2woff())
    .pipe(gulp.dest('src/assets/fonts/'));
});

//ttf to woff2

gulp.task('ttf2woff2', function(){
  gulp.src(['src/assets/fonts/*.ttf'])
    .pipe(ttf2woff2())
    .pipe(gulp.dest('src/assets/fonts/'));
});

//ttf to eot

gulp.task('ttf2eot', function(){
  gulp.src(['src/assets/fonts/*.ttf'])
    .pipe(ttf2eot())
    .pipe(gulp.dest('src/assets/fonts/'));
});

gulp.task('convertFonts', ['ttf2woff', 'ttf2eot', 'ttf2woff2'], function() {

});

//Task moving fonts to dist folder

gulp.task('fonts', function(){
  gulp.src(['src/assets/fonts/**/*'])
    .pipe(gulp.dest('dist/fonts/'));
});

//Gulp watcher

gulp.task('watch', function () {
  gulp.watch('src/assets/stylesheets/**/*.sass', ['styles']);
  gulp.watch('src/views/**/*.jade', ['jade']);
  gulp.watch('dist/**/*.html').on('change', browserSync.reload);
  gulp.watch('src/assets/js/**/*.js', ['js']);
  gulp.watch('dist/js/scripts.js').on('change', browserSync.reload);
});

//Default Gulp task

gulp.task('default', function(callback) {
  runSequence(['fonts', 'optimizationIMG', 'optimizationSVG'], ['styles', 'jade', 'js'], 'watch', 'browser-sync', callback);
});