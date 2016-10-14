'use strict';

var gulp = require('gulp'),
  gutil = require('gulp-util'),
  clean = require('gulp-clean'),
  gulpSequence = require('gulp-sequence'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  version = 'v' + require('./package.json').version;

gulp.task('clean', function () {
  return gulp.src(['dist/*'])
    .pipe(clean({force: true}));
});

gulp.task('jshint', function () {
  return gulp.src([
      'lib/**/*.js'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter());
});

gulp.task('js', function () {
  return gulp.src([
      'node_modules/pomelo-cocos2d-js/dist/pomelo-cocos2d-js.js',
      'lib/**/*.js',
      '!lib/index.js'
  ])
      .pipe(concat('dist/js/jm-sdk-gameclient.js'))
.pipe(gulp.dest(''))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(''));
});

gulp.task('default', gulpSequence('clean', 'jshint', ['js']));

