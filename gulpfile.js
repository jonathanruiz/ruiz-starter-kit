/*eslint-env node */

var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var eslint = require("gulp-eslint");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var babel = require("gulp-babel");
var sourcemaps = require("gulp-sourcemaps");
var imagemin = require("gulp-imagemin");
var pngquant = require("imagemin-pngquant");

gulp.task(
  "default",
  ["copy-html", "copy-images", "styles", "lint"],
  function() {
    gulp.watch("sass/**/*.scss", ["styles"]);
    gulp.watch("src/js/**/*.js", ["lint"]);
    gulp.watch("src/index.html", ["copy-html"]);
  }
);

// Creates a distribution/production ready file of the project
gulp.task("dist", [
  "copy-html",
  "copy-images",
  "styles",
  "lint",
  "scripts-dist"
]);

gulp.task("scripts", function() {
  gulp
    .src("src/js/**/*.js")
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(gulp.dest("dist/js"));
});

// Creates minified version of .js files
gulp.task("scripts-dist", function() {
  gulp
    .src("src/js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/js"));
});

// Convert the SASS files into CSS files
gulp.task("styles", function() {
  gulp
    .src("sass/**/*.scss")
    .pipe(
      sass({
        outputStyle: "compressed"
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"]
      })
    )
    .pipe(gulp.dest("dist/css"));
});

// Lint the files
gulp.task("lint", function() {
  return (
    gulp
      .src(["src/js/**/*.js"])
      // eslint() attaches the lint output to the eslint property
      // of the file object so it can be used by other modules.
      .pipe(eslint())
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format())
      // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failOnError last.
      .pipe(eslint.failOnError())
  );
});

// Copy index.html file
gulp.task("copy-html", function() {
  gulp.src("./src/index.html").pipe(gulp.dest("./dist"));
});

// Optimize and copy images
gulp.task("copy-images", function() {
  return gulp
    .src("src/img/*")
    .pipe(
      imagemin({
        progressive: true,
        use: [pngquant()]
      })
    )
    .pipe(gulp.dest("dist/img"));
});
