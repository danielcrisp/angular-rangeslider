var del = require('del');
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var compass = require('gulp-compass');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

var SRC_DIRECTORY = './';
var BUILD_DIRECTORY = 'dist/';

// Clean output directory
gulp.task('clean', del.bind(
  null, [BUILD_DIRECTORY + '*'], {
    dot: true
  }
));

gulp.task('scss', function() {
  return gulp.src(SRC_DIRECTORY + 'scss/angular.rangeSlider.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: './',
      sass: 'scss'
      }))
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(rename('angular.rangeSlider.min.css'))
    .pipe(gulp.dest(BUILD_DIRECTORY));
});


gulp.task('js', function() {
  return gulp.src(SRC_DIRECTORY + 'angular.rangeSlider.js')
    .pipe(uglify({ mangle: true }))
    .pipe(rename('angular.rangeSlider.min.js'))
    .pipe(gulp.dest(BUILD_DIRECTORY));
});

gulp.task('default', ['clean', 'scss', 'js']);
