var gulp          = require('gulp'),
    postcss       = require('gulp-postcss'),
    autoprefixer  = require('autoprefixer'),
    sugarss       = require('sugarss'),
    postcssImport = require('postcss-import'),
    cssMqpacker   = require('css-mqpacker'),
    postcssNested = require('postcss-nested'),
    precss        = require('precss'),
    postcssCenter = require('postcss-center'),
    postcssFlex   = require('postcss-flexbugs-fixes'),
    postcssSvg    = require('postcss-svg'),
    postcssAssets = require('postcss-assets')
    rucksack      = require('gulp-rucksack'),
    rename        = require('gulp-rename'),
    browserSync   = require('browser-sync').create(),
    notify        = require('gulp-notify'),
    imagemin      = require('gulp-imagemin'),
    pngquant      = require('imagemin-pngquant'),
    svgmin        = require('gulp-svgmin'),
    ttf2woff      = require('gulp-ttf2woff'),
    ttf2woff2     = require('gulp-ttf2woff2'),
    ttf2eot       = require('gulp-ttf2eot');


//BrowserSync

gulp.task('browser-sync', ['styles'], function() {
  browserSync.init({
    server: {
        baseDir: "./dist"
    },
    notify: false,
    open: false
  });
});


//Styles task

gulp.task('styles', function () {
  var processors = [
    postcssImport(),
    autoprefixer({browsers: ['> 1%', 'last 4 version', 'IE 9', 'IE 10', 'IE 11', 'Opera 12', 'Firefox ESR']}),
    postcssNested(),
    precss(),
    cssMqpacker(),
    postcssSvg({paths: ['src/assets/img']}),
    postcssAssets({loadPaths: ['src/assets/img/']}),
    postcssCenter(),
    postcssFlex(),
  ];
  return gulp.src('src/assets/stylesheets/style.css')
  .pipe(postcss(processors, { parser: sugarss }))
  .pipe(rucksack({
    shorthandPosition: false,
    quantityQueries: false,
    alias: false,
    fontPath: false
  }))
  .pipe(gulp.dest('dist/css/'))
  .pipe(notify('Successfully!'))
  .pipe(browserSync.stream());
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
  gulp.src(['src/assets/fonts/*.ttf'])
    .pipe(ttf2woff())
    .pipe(gulp.dest('dist/fonts/'));
});

//ttf to woff2

gulp.task('ttf2woff2', function(){
  gulp.src(['src/assets/fonts/*.ttf'])
    .pipe(ttf2woff2())
    .pipe(gulp.dest('dist/fonts/'));
});

//ttf to eot

gulp.task('ttf2eot', function(){
  gulp.src(['src/assets/fonts/*.ttf'])
    .pipe(ttf2eot())
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('convertFonts', ['ttf2woff', 'ttf2eot', 'ttf2woff2'], function() {

});

//Gulp watcher

gulp.task('watch', function () {
  gulp.watch('src/assets/stylesheets/**/*.css', ['styles']);
  gulp.watch('dist/**/*.html').on('change', browserSync.reload);
});

//Default Gulp task

gulp.task('default', ['browser-sync', 'watch']);