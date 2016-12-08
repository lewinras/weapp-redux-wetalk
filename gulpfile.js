const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();
const env = process.env.NODE_ENV || 'development';
const isProduction = () => env === 'production';
const I18n = require('gulp-i18n-localize');
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

gulp.task('compile:xml:translation', () => {
    return gulp.src(['src/**/*.xml'])
        .pipe(I18n({
                localeDir: './locales/zh'
            }
        ))
        .pipe(gulp.dest('./dist'))
});
gulp.task('compile:xml:del', ['compile:xml:move'], del.bind(null, ['./dist/translation/']))
gulp.task('compile:xml:move', ['compile:xml:translation'], () => {
        return gulp.src(['dist/translation/**/*.xml'])
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
            .pipe(gulp.dest('./dist'))
    }
);
gulp.task('compile:xml', ['compile:xml:del'])
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

gulp.task('dev:configureStore', ['compile'], () => {
    return gulp.src(['src/configureStore.dev.js'])
        .pipe(plugins.babel())
        .pipe(plugins.rename({basename: 'configureStore'}))
        .pipe(gulp.dest('dist'))
});
gulp.task('dev:libs', ['dev:configureStore'], () => {
    return gulp.src(['src/libs/redux-logger.js'])
        .pipe(plugins.babel())
        .pipe(gulp.dest('dist/libs/'))
});
gulp.task('development', ['dev:libs']);
gulp.task('pro:configureStore', ['compile'], () => {
    return gulp.src(['src/configureStore.pro.js'])
        .pipe(plugins.babel())
        .pipe(plugins.uglify())
        .pipe(plugins.rename({basename: 'configureStore'}))
        .pipe(gulp.dest('dist'))
});
gulp.task('production', ['pro:configureStore']);


gulp.task('default', ['development']);
gulp.task('deploy', ['production']);