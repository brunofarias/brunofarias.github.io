var gulp        = require('gulp');
    uglify      = require('gulp-uglify');
    less        = require('gulp-less');
    concat      = require('gulp-concat');
    minifyCSS   = require('gulp-minify-css');
    svgstore    = require('gulp-svgstore');
    svgmin      = require('gulp-svgmin');
    path        = require('path');
    htmlmin     = require('gulp-htmlmin');
    fileinclude = require('gulp-file-include');
    myip        = require('quick-local-ip');
    connect     = require('gulp-connect');
    clean       = require('gulp-clean');

function swallowError (error) {

    //If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}

// GERAR SVG
// limpando svg
gulp.task('clean-svg', function () {
  return gulp.src('assets/images/svg/svg.svg', {read: false})
    .pipe(clean());
});

// gerando svg
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
    .pipe(gulp.dest('assets/images/svg'))
});

//File Include
gulp.task('fileinclude', function() {
    gulp.src(['_matriz/html/**/index.html'])
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@root'
    }))
    .pipe(gulp.dest('_matriz/build/'))
    .pipe(connect.reload());
});
gulp.task('htmlreload',function(){
    gulp.src('_matriz/html/**/*.html')
    .pipe(connect.reload());
});

// MINIFICAR HTML
gulp.task('html', function() {
    return gulp.src('assets/html/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true,minifyJS: true}))
    .pipe(gulp.dest('assets/html/'))
    .pipe(connect.reload());
});

// OTIMIZAR OS SCRIPTS
var global = [
    'assets/js/plugins/jquery.js',
    'assets/js/plugins/modernizr.js',
    'assets/js/plugins/maskedinput.js',
    'assets/js/plugins/placeholder.js',
    'assets/js/plugins/svg4everybody.js'
];

gulp.task('scripts', function() {
    gulp.src(global)
    .pipe(concat("plugins.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js/plugins/'));
});

gulp.task('connect', function() {
    connect.server({
        host: myip.getLocalIP4(),
        livereload: true
    });
});

gulp.task('less', function() {
    gulp.src('assets/less/main.less')
    .pipe(less())
    .on('error', swallowError)
    .pipe(minifyCSS())
    .pipe(gulp.dest('./assets/css'))
    .pipe(connect.reload());
});

// WATCH LESS, SCRIPTS E LIVERELOAD
gulp.task('watch', function() {
    gulp.watch(['_matriz/html/**/*.html', '!_matriz/html/**/*min.html'], ['htmlreload', 'fileinclude']);
    gulp.watch(['assets/html/**/*.html', '!assets/html/**/*min.html'], ['html']);
    gulp.watch('assets/less/**/*.less', ['less']);
});

gulp.task('default', ['less', 'fileinclude', 'scripts', 'svg', 'connect', 'watch']);