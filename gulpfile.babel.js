import gulp from 'gulp'
import del from 'del'
import zip from 'gulp-zip'
import runSequence from 'run-sequence'
import { exec } from 'child_process'

const currentEnvironment = process.env.RELEASE_ENVIRONMENT || 'development'

gulp.task('clean', () => {
  return del([
    'dist.zip',
    './dist'
  ])
})

gulp.task('copy', () => {
  return gulp.src([
    './handlers.js',
    './environment.js',
    './.env.requirements',
    './lib/**/*'
  ], {
    base: './'
  }).pipe(gulp.dest('dist/'))
})

gulp.task('dotenv', (cb) => {
  const commands = [
    './bin/env-subset ' + currentEnvironment + ' > ./dist/.env',
    'echo "RELEASE_ENVIRONMENT=' + currentEnvironment + '" >> ./dist/.env'
  ]
  exec(commands.join(' && '), function (err, stdout, stderr) {
    cb(err)
  })
})

gulp.task('babel:transpile', (cb) => {
  exec('node_modules/.bin/babel -d dist/ dist/', (err, stdout, stderr) => cb(err))
})

gulp.task('npm:copy-modules', () => {
  return gulp.src(['./node_modules/**/*', './package.json'], { base: './' })
    .pipe(gulp.dest('./dist/'))
})

gulp.task('npm:install-prune', (cb) => {
  exec('cd dist && npm install --production && npm prune --production', function (err, stdout, stderr) {
    cb(err)
  })
})

gulp.task('zip', () => {
  return gulp.src(
    [
      './dist/**/*',
      '!./dist/package.json',
      './dist/.*',
      './dist/.*/**/*'
    ])
    .pipe(zip(currentEnvironment + '.zip'))
    .pipe(gulp.dest('./artifacts'))
})

gulp.task('default', (cb) => {
  return runSequence(
    ['clean'],
    ['copy'],
    ['babel:transpile'],
    ['npm:copy-modules'],
    ['npm:install-prune'],
    ['dotenv'],
    ['zip'],
    cb
  )
})
