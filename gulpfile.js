var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename       = require('gulp-rename'),
    browserSync  = require('browser-sync').create(),
    notify       = require('gulp-notify'),
    minifycss    = require('gulp-minify-css'),
    coffee       = require('gulp-coffee'),
    gutil        = require('gulp-util'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    svgmin       = require('gulp-svgmin'),
    ttf2woff     = require('gulp-ttf2woff'),
    ttf2woff2    = require('gulp-ttf2woff2'),
    ttf2eot      = require('gulp-ttf2eot');


//BrowserSync

gulp.task('browser-sync', ['styles'], function() {
  browserSync.init({
    server: {
        baseDir: "./Site"
    },
    notify: false
  });
});


//Compiling sass

gulp.task('styles', function () {
  return gulp.src('dev/sass/*.sass')
  .pipe(sass().on('error', sass.logError))
  .pipe(rename({
    basename: 'style'
  }))
  .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
  .pipe(gulp.dest('Site/css'))
  .pipe(notify('SASS successfully compiled'))
  .pipe(browserSync.stream());
});


//CSS Minimization

gulp.task('optimizationCSS', function() {
  return gulp.src('Site/css/style.css')
  .pipe(minifycss())
  .pipe(rename({
    suffix: '.min'
    }))
  .pipe(gulp.dest('Site/css'))
  .pipe(notify('CSS successfully minifed'))
  });


//CoffeScript Compilation

gulp.task('coffeescript', function() {
  gulp.src('dev/coffescript/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('Site/js'))
    .pipe(notify('CoffeeScript successfully compiled'))
    .pipe(browserSync.stream());
});


//OptimizationJS

gulp.task('optimizationJS', function() {
  return gulp.src('Site/js/script.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('Site/js'))
    .pipe(notify('JS successfully minifed'))
});

//Optimization img(jpg,png)

gulp.task('optimizationIMG', () => {
  return gulp.src('dev/img/forOptimization/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('Site/img/'));
});


//Optimization svg

gulp.task('optimizationSVG', function () {
  return gulp.src('dev/img/svg/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('Site/img/'));
});


//Convert fonts(ttf to woff,woff2,eot)

//ttf to woff

gulp.task('ttf2woff', function(){
  gulp.src(['dev/fonts/*.ttf'])
    .pipe(ttf2woff())
    .pipe(gulp.dest('Site/fonts/'));
});

//ttf to woff2

gulp.task('ttf2woff2', function(){
  gulp.src(['dev/fonts/*.ttf'])
    .pipe(ttf2woff2())
    .pipe(gulp.dest('Site/fonts/'));
});

//ttf to eot

gulp.task('ttf2eot', function(){
  gulp.src(['dev/fonts/*.ttf'])
    .pipe(ttf2eot())
    .pipe(gulp.dest('Site/fonts/'));
});

gulp.task('convertFonts', ['ttf2woff', 'ttf2eot', 'ttf2woff2'], function() {

});

//Gulp watcher

gulp.task('watch', function () {
  gulp.watch('dev/sass/*.sass', ['styles']);
  gulp.watch('dev/coffescript/*.coffee', ['coffeescript']);
  gulp.watch('Site/*.html').on('change', browserSync.reload);
});

//Default Gulp task

gulp.task('default', ['browser-sync', 'watch']);