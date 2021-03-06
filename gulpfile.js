// less
var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var uncss = require('gulp-uncss');

// js
var gulpConcat = require('gulp-concat');
var uglify = require('gulp-uglify');

// watch folders
var lessWatchFolder = './css/less/**/*.less';
var htmlWatchFolder = './*.html';
var jsWatchFolder = './js/source/*.js';

// less vars
var lessFile = './css/less/etherwallet-master.less';
var lessOutputFolder = './css';
var lessOutputFile = 'etherwallet-master.css';
var lessOutputFileMin = 'etherwallet-master.min.css';

//js vars
var jsFiles = "./js/source/*.js";
var jsOutputFolder = './js';
var jsOutputFile = 'etherwallet-master.min.js';

gulp.task('less', function (cb) {
  return gulp
    .src(lessFile)
      .pipe(less({ compress: false })).on('error', notify.onError(function (error) {
        return "ERROR! Problem file : " + error.message;
      }))
      .pipe(autoprefixer('last 2 version', 'ie 9', 'ios 6', 'android 4'))
      .pipe(rename(lessOutputFile))
      .pipe(gulp.dest(lessOutputFolder))
      .pipe(minifyCSS({keepBreaks: false}))
      .pipe(rename(lessOutputFileMin))
      .pipe(gulp.dest(lessOutputFolder))
      .pipe(notify('Less Compiled and Minified'));
});

gulp.task('less-uncss', ['less'], function () {
  return gulp
    .src('./css/' + lessOutputFile)
      .pipe(uncss({
        html: [
          './index.html'
        ]
      }))
      .pipe(minifyCSS({keepBreaks: false}))
      .pipe(rename(lessOutputFileMin))
      .pipe(gulp.dest(lessOutputFolder))
    .pipe(notify('Less UnCSS and Minified'));
});

gulp.task('minJS', function () {
  return gulp
    .src(jsFiles)
      .pipe(gulpConcat(jsOutputFile))
      .pipe(uglify())
      .pipe(gulp.dest(jsOutputFolder))
    .pipe(notify('JS Concat and Uglified'));
});

gulp.task('watchJS', function() {
    gulp.watch(jsWatchFolder, ['minJS']);
});
gulp.task('watchLess', function() {
    gulp.watch(lessWatchFolder, ['less' , 'less-uncss']);
});
gulp.task('watchHTML', function() {
    gulp.watch(htmlWatchFolder, ['less-uncss']);
});

gulp.task('default', ['minJS' , 'less', 'less-uncss', 'watchJS' , 'watchLess', 'watchHTML' ]);
