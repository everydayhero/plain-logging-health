var gulp = require('gulp');
var del = require('del');
var install = require('gulp-install');
var zip = require('gulp-zip');
var runSequence = require('run-sequence');
var exec = require('child_process').exec;
var path = require('path');

var currentEnvironment = process.env.RELEASE_ENVIRONMENT || 'development';

gulp.task('clean', function() {
  return del([
    'dist.zip',
    './dist'
  ]);
});

gulp.task('copy', function() {
  return gulp.src([
    './handlers.js',
    './.env.requirements',
    './lib/**/*',
  ], {
    base: './'
  }).pipe(gulp.dest('dist/'))
});

gulp.task('dotenv', function (cb) {
  exec('./bin/env-subset ' + currentEnvironment + ' > ./dist/.env', function (err, stdout, stderr) {
    cb(err);
  });
})

gulp.task('npm', function() {
  return gulp.src('./package.json')
    .pipe(gulp.dest('./dist/'))
    .pipe(install({ production: true }));
});

gulp.task('zip', function() {
  return gulp.src(
    [
      './dist/**/*',
      '!./dist/package.json',
      './dist/.*',
      './dist/.*/**/*'
    ])
    .pipe(zip(currentEnvironment+'.zip'))
    .pipe(gulp.dest('./artifacts'));
});

gulp.task('default', function(cb) {
  return runSequence(
    ['clean'],
    ['build:templates'],
    ['copy', 'npm'],
    ['dotenv'],
    ['zip'],
    cb
  );
});
