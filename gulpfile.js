/*Gulpfile for NBN-Setup
PARKER 2015 @ BNM - MIT License
Default task compiles SASS/JADE and moves to public
Serves to localhost:3000 from `/public`
use `gulp deploy` to push master to gh-pages for staging
*/

var gulp 		= require('gulp');
var sass 		= require('gulp-sass');
var notify 		= require('gulp-notify');
var jade		= require('gulp-jade');
var ghPages		= require('gulp-gh-pages');
var browserSync = require('browser-sync');
var reload 		= browserSync.reload;


gulp.task('move', function(){
	return gulp.src('./build/img/**/*')
	.pipe(gulp.dest('./public/assets/'))
})

//compile jade, catch errors before compile. 
gulp.task('jade',['move'], function () {
	var j = jade({
		pretty: true
	});
	j.on('error', function(err){
		console.log(err);
		notify().write("jade error");
		j.end();
		gulp.watch();
	})
	return gulp.src('./build/jade/*.jade')
	.pipe(j)
	.pipe(gulp.dest('./public'))
	browserSync.reload;
});

//compile scss to css
gulp.task('build', ['jade'], function(){
	return gulp.src('./build/scss/*.scss')
		.pipe(sass({
			style: 'compressed',
			errLogToConsole: false,
			onError: function(err){
				return notify().write(err);
			}
		}))
		.pipe(gulp.dest('./public/src/css'))
		.pipe(browserSync.stream());
});

//compile on change
gulp.task('watch', function(){
	gulp.watch(['./build/scss/*.scss', './build/jade/*.jade'], ['build']);
});

//serve to the browser
gulp.task('serve', function(){
	browserSync.init(['./public/index.html'],{
		server: {
			baseDir: "./public"
		}
	})
});

//the dafault task
gulp.task('default', ['watch', 'serve', 'build']);



//deploy to github-pages
gulp.task('deploy', function(){
	return gulp.src('./public/**/*')
	.pipe(ghPages());
});