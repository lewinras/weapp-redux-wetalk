const gulp = require('gulp')
const del = require('del')
const runSequence = require('run-sequence')
const gulpLoadPlugins = require('gulp-load-plugins')
const plugins = gulpLoadPlugins()
const gulpIgnore = require('gulp-ignore')
const env = process.env.NODE_ENV || 'development'
const isProduction = () => env === 'production'

//Clean distribution directory
gulp.task('clean', del.bind(null, ['./dist/*']))


// Compile js source to distribution directory
gulp.task('compile:js', () => {
    return gulp.src(['src/**/*.js'])
        .pipe(plugins.babel())
        .pipe(plugins.if(isProduction, plugins.uglify()))
        .pipe(gulp.dest('dist'))
})
// Compile json source to distribution directory
gulp.task('compile:json', () => {
    return gulp.src(['src/**/*.json'])
    // .pipe(plugins.jsonminify())
        .pipe(gulp.dest('dist'))
})

// Compile img source to distribution directory
gulp.task('compile:img', () => {
    return gulp.src(['img/**/*.{jpg,jpeg,png,gif}'])
    // .pipe(plugins.imagemin())
        .pipe(gulp.dest('dist/images'))
})

// Compile xml source to distribution directory
gulp.task('compile:xml', () => {
    return gulp.src(['src/**/*.xml'])
        .pipe(plugins.if(isProduction, plugins.htmlmin({
            collapseWhitespace: true,
            // collapseBooleanAttributes: true,
            // removeAttributeQuotes: true,
            keepClosingSlash: true, // xml
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        })))
        .pipe(plugins.rename({extname: '.wxml'}))
        .pipe(gulp.dest('dist'))
})

// Compile css source to distribution directory
gulp.task('compile:css', () => {
    return gulp.src(['src/**/*.css'])
        .pipe(plugins.rename({extname: '.wxss'}))
        .pipe(gulp.dest('dist'))
})

// Compile sass source to distribution directory
gulp.task('compile:sass', () => {
    return gulp.src(['src/**/*.scss', '!src/components/**', '!src/base.scss'])
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.if(isProduction, plugins.cssnano({compatibility: '*'})))
        .pipe(plugins.rename({extname: '.wxss'}))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
})

//Compile all
gulp.task('compile', ['clean'], next => {
    runSequence([
        'compile:json',
        'compile:js',
        'compile:xml',
        'compile:img',
        // 'compile:css',
        'compile:sass'
    ], next)
})


//default tasks
gulp.task('default', ['compile'])