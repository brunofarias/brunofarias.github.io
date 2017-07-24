var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    less        = require('gulp-less'),
    concat      = require('gulp-concat'),
    minifyCSS   = require('gulp-minify-css'),
    svgstore    = require('gulp-svgstore'),
    svgmin      = require('gulp-svgmin'),
    htmlmin     = require('gulp-htmlmin'),
    rename      = require('gulp-rename'),
    fileinclude = require('gulp-file-include'),
    myip        = require('quick-local-ip'),
    connect     = require('gulp-connect'),
    imagemin    = require('gulp-imagemin'),
    clean       = require('gulp-clean'),
    path        = require('path');

function swallowError (error) {

    //If you want details of the error in the console
    console.log(error.toString());
    this.emit('end');
}

//  IMAGES
gulp.task('images', function() {
  return gulp.src([
    'source/images/**/*.gif',
    'source/images/**/*.jpg',
    'source/images/**/*.png',
    'source/images/**/*.svg',
  ])
  .pipe(imagemin({interlaced: true, optimizationLevel: 5, progressive: true, plugins: [{removeViewBox: true}]}))
  .pipe(gulp.dest('source/images/'))
  .pipe(connect.reload());
});

// GERAR SVG

// limpando svg
// gulp.task('clean-svg', function () {
//   return gulp.src('source/images/svg/svg.svg', {read: false})
//   .pipe(clean());
// });

// gerando svg
gulp.task('svg', function () {
  return gulp.src('source/images/svg/**/*.svg')
  .pipe(svgmin(function (file) {
    var prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [{
        cleanupIDs: {
          prefix: prefix + '-',
          minify: true
        }
      }]
    }
  }))
  .pipe(svgstore())
  .pipe(gulp.dest('source/images/svg'))
});


//File Include
gulp.task('fileinclude', function() {
  gulp.src(['source/html/pages/**/index.html'])
  .pipe(fileinclude({
    prefix: '@@',
    basepath: '@root'
  }))
  .pipe(gulp.dest('source/html/build/'))
  .pipe(connect.reload());
});

gulp.task('htmlreload',function(){
  gulp.src('source/html/pages/**/*.html')
  .pipe(connect.reload());
});

// MINIFICAR HTML
gulp.task('html', function() {
  return gulp.src(['source/html/build/**/*.html', '!source/html/build/**/*min.html'])
  .pipe(htmlmin({collapseWhitespace: true,minifyJS: true}))
  .pipe(rename(function (path) {
    path.basename += ".min";
    path.extname = ".html"
  }))
  .pipe(gulp.dest('source/html/build/'))
  .pipe(connect.reload());
});

// OTIMIZAR OS SCRIPTS
var global = [
  'source/js/plugins/jquery.js',
  'source/js/plugins/modernizr.js',
  'source/js/plugins/maskedinput.js',
  'source/js/plugins/placeholder.js',
  'source/js/plugins/svg4everybody.js'
];

gulp.task('scripts', function() {
  gulp.src(global)
  .pipe(concat("plugins.js"))
  .pipe(uglify())
  .pipe(gulp.dest('build/js/'));
});

gulp.task('connect', function() {
  connect.server({
    host: myip.getLocalIP4(),
    livereload: true
  });
});

gulp.task('less', function() {
  gulp.src('source/less/main.less')
  .pipe(less())
  .on('error', swallowError)
  .pipe(minifyCSS())
  .pipe(gulp.dest('source/css'))
  .pipe(connect.reload());
});

// WATCH
gulp.task('watch', function() {
  gulp.watch('source/html/pages/**/*.html', ['htmlreload', 'fileinclude']);
  gulp.watch('source/less/**/*.less', ['less']);
});

gulp.task('default', ['html', 'less', 'fileinclude', 'images', 'scripts', 'svg', 'connect', 'watch']);