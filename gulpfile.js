/*Gulpfile for FAA
PARKER 2015 @  - MIT License
Default task compiles SASS/JADE and moves to public
Serves to localhost:3000 from `/public`
use `gulp deploy` to push master to gh-pages for staging
*/

var gulp 		= require('gulp');
var bower = require ('gulp-bower');
var sass 		= require('gulp-sass');
var notify 		= require('gulp-notify');
var jade		= require('gulp-jade');
var streamqueue = require('streamqueue');
var templateCache = require ('gulp-angular-templatecache');
var inject = require('gulp-inject');
var ghPages		= require('gulp-gh-pages');
var browserSync = require('browser-sync');
var reload 		= browserSync.reload;



gulp.task('move', function(){
	return gulp.src('./build/assets/**/*')
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
	.pipe(gulp.dest('./build/jade/temp'));
});


//create a template cache of the views
gulp.task('views', ['jade'], function(){
 return streamqueue({ objectMode: true },
    gulp.src('./build/jade/temp/*.html')
    )
        .pipe(templateCache('./temp/templateCache.js', { module: 'templatescache', standalone: true }))
        .pipe(gulp.dest('./build/js/'));
});


//move both the templatecache service and angular app to public/js
gulp.task('scripts', ['views'], function(){
	return streamqueue({ objectMode: true },
		gulp.src('./build/js/app.js'),
		gulp.src('./build/js/temp/templateCache.js')
		)
		.pipe(gulp.dest('./public/src/js/'));
		//.pipe(del('./build/js/temp')) //DANGEROUS can delete whole app if not used correctly
});

gulp.task('index',['scripts'], function(){
	return gulp.src('./build/jade/temp/index.html')
	.pipe(gulp.dest('./public'))
})


//compile scss to css
gulp.task('build', ['index'], function(){
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

gulp.task('indexer', ['build'], function () {
  // var target = gulp.src('./public/index.html');
  // // It's not necessary to read the files (will speed up things), we're only after their paths: 
  // var sources = gulp.src(['./public/**/*.js', './public/**/*.css'], {read: false});
 
  // return target.pipe(inject(sources))
  //   .pipe(gulp.dest('./public'));
});

//compile on change
gulp.task('watch', function(){
	gulp.watch(['./build/scss/*.scss', './build/jade/*.jade', 'build/js/*.js'], ['indexer']);
});

//serve to the browser
gulp.task('serve', function(){
	browserSync.init(['./public/index.html'],{
		server: {
			baseDir: "./public"
		},
		open: false
	})
});


//move bower components to the library folder
gulp.task('bower', function(){
	return bower()
		.pipe(gulp.dest('./public/src/js/lib/'));
});


//the dafault task
gulp.task('default', ['watch', 'serve', 'bower', 'indexer']);




//deploy to github-pages
gulp.task('deploy', function(){
	return gulp.src('./public/**/*')
	.pipe(ghPages());
});