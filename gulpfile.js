/* eslint-disable */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');

require('dotenv').config();

gulp.task('sass', function() {
  return gulp.src('./styles/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename('theme.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./assets/'))
});

gulp.task('js', function() {
  return gulp.src('./scripts/app.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(rename('theme.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/'))
  });

gulp.task('serve', function() {
  browserSync.init({
        // proxy: "https://kiwi-bikes.myshopify.com?preview_theme_id=80627531798",
        proxy: process.env['THEME_PREVIEW_URL'],
        files: '/var/tmp/theme_ready',
        // Disable pop-over notification in browser for updates.
        notify: false,
        // By default browser-sync injects its script after the opening <body> tag.
        // This appears to conflict with scripts from Shopify. To solve this, the
        // browser-sync script is now being injected before the closing </body> tag:
        snippetOptions: {
          rule: {
            match: /<\/body>/i,
            fn: (snippet, match) => {
              return snippet + match;
            }
          }
        },
        // The reloadDelay value was determined experimentally, ensuring that the code
        // changes were processed and deployed by Shopify by the time browser-sync
        // refreshes the browser.
        // https://github.com/Shopify/themekit/issues/688
        reloadDelay: 2000
  });
  
  // After initializing browser-sync, watch for sass changes
  gulp.watch('./styles/**/*.scss', gulp.series('sass'))
})

// Run serve task as default gulp task
gulp.task('default', gulp.series('serve', 'js'));