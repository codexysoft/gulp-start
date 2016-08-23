var gulp          = require('gulp'),
    rigger        = require('gulp-rigger'),
    include       = require('gulp-include'),
    postcss       = require('gulp-postcss'),
    autoprefixer  = require('autoprefixer'),
    uglify        = require('gulp-uglify'),
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
    jade          = require('gulp-jade'),
    notify        = require('gulp-notify'),
    imagemin      = require('gulp-imagemin'),
    pngquant      = require('imagemin-pngquant'),
    svgmin        = require('gulp-svgmin'),
    ttf2woff      = require('gulp-ttf2woff'),
    ttf2woff2     = require('gulp-ttf2woff2'),
    ttf2eot       = require('gulp-ttf2eot');

//BrowserSync

gulp.task('browser-sync', ['vendorStyles', 'styles', 'jade', 'js'], function() {
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
    postcssSvg({paths: ['dist/img']}),
    postcssAssets({loadPaths: ['dist/img/']}),
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
  .pipe(notify('STYLES: Successfully!'))
  .pipe(browserSync.stream());
});

//Vendor files task

gulp.task('vendorStyles', function() {
  return gulp.src('src/assets/vendor/vendor.css')
  .pipe(include())
    .on('error', console.log)
  .pipe(gulp.dest('dist/css/'))
  .pipe(notify('VENDOR: Successfully!'));
});

//Jade task

gulp.task('jade', function() {
  return gulp.src('src/views/pages/**/*.jade')
  .pipe(jade({pretty: true}))
  .pipe(gulp.dest('dist'))
  .pipe(notify('JADE: Successfully!'));
});

gulp.task('js', function () {
  gulp.src('src/assets/js/scripts.js')
    .pipe(rigger())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'))
    .pipe(notify('JS: Successfully!'));
});

//Moving all img-assets to dist folder:

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
  gulp.watch('src/assets/vendor/**/*.css', ['vendorStyles']);
  gulp.watch('src/views/**/*.jade', ['jade']);
  gulp.watch('dist/**/*.html').on('change', browserSync.reload);
  gulp.watch('src/assets/js/**/*.js', ['js']);
  gulp.watch('dist/js/scripts.js').on('change', browserSync.reload);
});

//Default Gulp task

gulp.task('default', ['browser-sync', 'watch']);

//Build assets task. Run first.

gulp.task('build', ['convertFonts', 'optimizationIMG', 'optimizationSVG'], function() {

});