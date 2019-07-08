var gulp          = require('gulp');
var $             = require('gulp-load-plugins')();
var browserSync   = require('browser-sync').create();
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

var paths = {
  "htmlSrc" : "./*.html",
  "scssSrc" : "./src/scss/**/*.scss",
  "jsSrc"   : "./src/js/*.js",
  "jsLib"   : "./src/js/lib/*.js",
  "imgSrc"  : "./src/images/**",
  "rootDir" : "./dist/",
  "imgDir"  : "./dist/images/",
  "jsDir"  : "./dist/js/"
}

gulp.task('bs',  function(done) {

  browserSync.init({
   server: {
      baseDir: "./"
   }     
  });
  done();
  console.log('Server was launched');
});

gulp.task('scss', function() {
  return gulp.src(paths.scssSrc)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe($.sourcemaps.init())
    .pipe($.sass()).on('error', $.sass.logError)
    .pipe(postcss([
      autoprefixer({})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.rootDir + 'css'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.csso())
    .pipe(gulp.dest(paths.rootDir + 'css'))
    /*
    .pipe(browserSync.reload({
      stream: true,
      once  : true
    }));
    */
});

gulp.task('bs-reload', function() {
   browserSync.reload();
   console.log('Browser reload completed');
});

/*
gulp.task('image', function() {
  return gulp.src(paths.imgSrc)
    .pipe($.changed(paths.imgDir))
    .pipe($.imagemin({
      optimizationLevel: 3
    }))
    .pipe(gulp.dest(paths.imgDir));
});
*/

gulp.task('js', function() {
  return gulp.src([paths.jsLib, paths.jsSrc])
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe($.uglify({output:{
      comments: /^!/
    }}))
    .pipe($.concat('main.min.js', {newLine: '\n'})
    )
    .pipe(gulp.dest(paths.jsDir));
});

gulp.task('watch-files',function(){
  $.watch(paths.htmlSrc, gulp.task('bs-reload'));
  $.watch(paths.scssSrc, gulp.task('bs-reload'));
  $.watch(paths.jsSrc, gulp.task('bs-reload'));  
  
  $.watch(paths.scssSrc, gulp.task('scss'));
  $.watch(paths.jsSrc, gulp.task('js'));
  console.log(('gulp watch started'));
});

gulp.task('default', gulp.series('js','scss', 'bs', 'watch-files', function(){
  console.log('Default all task done!');
}));


/*
gulp.task('default', gulp.series( gulp.parallel('js','scss'), function(){  
  $.watch(paths.scssSrc, gulp.task('scss'));
  $.watch(paths.imgSrc, gulp.task('image'));
  $.watch(paths.jsSrc, gulp.task('js'));
}));
*/