const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();
const env = process.env.NODE_ENV || 'development';
const isProduction = () => env === 'production';

gulp.task('clean', del.bind(null, ['./dist/*']));


gulp.task('compile:js', () => {
    return gulp.src(['src/**/*.js', '!src/configureStore.*.js', '!src/libs/redux-logger.js'])
        .pipe(plugins.babel())
        .pipe(plugins.if(isProduction, plugins.uglify()))
        .pipe(gulp.dest('dist'))
});
gulp.task('compile:json', () => {
    return gulp.src(['src/**/*.json'])
    // .pipe(plugins.jsonminify())
        .pipe(gulp.dest('dist'))
});

gulp.task('compile:img', () => {
    return gulp.src(['img/**/*.{jpg,jpeg,png,gif}'])
    // .pipe(plugins.imagemin())
        .pipe(gulp.dest('dist/images'))
});

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
});

gulp.task('compile:css', () => {
    return gulp.src(['src/**/*.css'])
        .pipe(plugins.rename({extname: '.wxss'}))
        .pipe(gulp.dest('dist'))
});

// Compile sass source to distribution directory
gulp.task('compile:sass', () => {
    return gulp.src(['src/**/*.scss', '!src/components/**', '!src/base.scss'])
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.if(isProduction, plugins.cssnano({compatibility: '*'})))
        .pipe(plugins.rename({extname: '.wxss'}))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
});

gulp.task('compile', ['clean'], next => {
    runSequence([
        'compile:json',
        'compile:js',
        'compile:xml',
        'compile:img',
        // 'compile:css',
        'compile:sass'
    ], next)
});

gulp.task('dev:configureStore', () => {
    return gulp.src(['src/configureStore.dev.js'])
        .pipe(plugins.babel())
        .pipe(plugins.rename({basename: 'configureStore'}))
        .pipe(gulp.dest('dist'))
});
gulp.task('dev:libs', () => {
    return gulp.src(['src/libs/redux-logger.js'])
        .pipe(plugins.babel())
        .pipe(gulp.dest('dist/libs'))
});
gulp.task('development', () => {
    runSequence([
            'dev:configureStore',
            'dev:libs'
        ]
    )
});
gulp.task('configure-pro', () => {
    return gulp.src(['src/configureStore.pro.js'])
        .pipe(plugins.babel())
        .pipe(plugins.uglify())
        .pipe(plugins.rename({basename: 'configureStore'}))
        .pipe(gulp.dest('dist'))
});
gulp.task('default', ['compile', 'development']);

gulp.task('deploy', ['compile', 'configure-pro']);