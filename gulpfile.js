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
    './environment.js',
    './.env.requirements',
    './lib/**/*'
  ], {
    base: './'
  }).pipe(gulp.dest('dist/'))
});

gulp.task('dotenv', function (cb) {
  const commands = [
    './bin/env-subset ' + currentEnvironment + ' > ./dist/.env',
    'echo "RELEASE_ENVIRONMENT=' + currentEnvironment + '" >> ./dist/.env'
  ]
  exec(commands.join(' && '), function (err, stdout, stderr) {
    cb(err)
  })
})

gulp.task('npm:copy-modules', function () {
  return gulp.src(['./node_modules/**/*', './package.json'], { base: './' })
    .pipe(gulp.dest('./dist/'))
})

gulp.task('npm:install-prune', function (cb) {
  exec('cd dist && npm install --production && npm prune --production', function (err, stdout, stderr) {
    cb(err)
  })
})

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
    ['copy', 'npm:copy-modules'],
    ['npm:install-prune'],
    ['dotenv'],
    ['zip'],
    cb
  );
});
