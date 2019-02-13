var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    less        = require('gulp-less'),
    concat      = require('gulp-concat'),
    cleanCSS    = require('gulp-clean-css'),
    svgstore    = require('gulp-svgstore'),
    svgmin      = require('gulp-svgmin'),
    path        = require('path'),
    imagemin    = require('gulp-imagemin'),
    htmlmin     = require('gulp-htmlmin'),
    myip        = require('quick-local-ip'),
    clean       = require('gulp-clean'),
    browserSync = require("browser-sync").create();

function swallowError (error) {
  //If you want details of the error in the console
  console.log(error.toString());
  this.emit('end');
}

// LIMPANDO SVG
gulp.task("clean-svg", function() {
  return gulp.src("assets/images/svg/svg.svg", { read: false }).pipe(clean());
});
  
// GERANDO SVG
gulp.task('svg', ['clean-svg'], function () {
  return gulp.src('assets/images/svg/**/*.svg')
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
  .pipe(gulp.dest('dist/images/svg'))
});

// OTIMIZANDO IMAGENS
gulp.task("images", function() {
  gulp.src("assets/images/**")
  .pipe(imagemin())
  .pipe(gulp.dest("dist/images"));
});

// MINIFICAR HTML
gulp.task('html', function() {
  return gulp.src('assets/html/**/*.html')
  .pipe(htmlmin({collapseWhitespace: true,minifyJS: true}))
  .pipe(gulp.dest(''))
  .pipe(browserSync.stream());
});

// OTIMIZAR OS SCRIPTS
var global = [
    'assets/js/plugins/jquery.js',
    'assets/js/plugins/modernizr.js',
    'assets/js/plugins/svg4everybody.js',
    'assets/js/plugins/masonry.js',
    'assets/js/plugins/imagesloaded.js',
    'assets/js/plugins/classie.js',
    'assets/js/plugins/AnimOnScroll.js',
    'assets/js/plugins/waypoints.js',
    'assets/js/modules/home.js',

];

gulp.task("scripts", function() {
  gulp
    .src(global)
    .pipe(concat("scripts.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"));
});

// MINIFICAR CSS
gulp.task("less", function() {
  gulp.src("assets/less/main.less")
  .pipe(less())
  .on("error", swallowError)
  .pipe(cleanCSS())
  .pipe(gulp.dest("dist/css"))
  .pipe(browserSync.stream());
});

// SINCRONIZANDO O BROWSER
gulp.task('serve', ['less'], function() {
  browserSync.init({
    proxy: myip.getLocalIP4()
  });
});

// WATCH LESS, SCRIPTS E BROWSERSYNC
gulp.task("watch", function() {
  gulp.watch("assets/html/**/*.html", ["html"]);
  gulp.watch("assets/less/**/*.less", ["less"]);
});

gulp.task("default", ["html", "less", "scripts", "images", "svg", "serve", "watch"]);