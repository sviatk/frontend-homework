/**
 * @file
 * Provides Gulp configurations and tasks for WordPress theme.
 */
'use strict'
var gulp = require('gulp'),
    sass = require('gulp-dart-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    log = require('gulplog'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream')

var paths = {
    styles: {
        src: './app-src/scss/**/*.scss',
        dest: 'app/css'
    },
    scripts: {
        src: './app-src/js/app.js',
        src_folder: './app-src/js/**/*.js',
        dest: 'app/js'
    },
}

var liveEnv = process.argv.indexOf('--live') !== -1

function handleError(err) {
    console.log(err.toString())
    this.emit('end')
}

function style() {
    return gulp
        .src(paths.styles.src)
        .pipe(sourcemaps.init('./'))
        .pipe(sass.sync().on('error', sass.logError))
        // .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest(paths.styles.dest))
}

function script() {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: [
            './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
            paths.scripts.src
        ],
        debug: true,
    })
        .transform(babelify.configure({
            presets: ['@babel/preset-env']
        }))

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', handleError)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.scripts.dest))
}

function watch() {
    gulp.watch(paths.styles.src, style)
    gulp.watch(paths.scripts.src_folder, script)
}

exports.watch = watch
exports.style = style
exports.script = script

/*
* Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
*/
var build = gulp.parallel(style, script, watch)

/*
* Define default task that can be called by just running `gulp` from cli
*/
gulp.task('default', build)
