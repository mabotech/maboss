
var gulp = require('gulp');

gulp.task('one',  function() {
    // task 'one' is done now
    console.log("task one");
});



gulp.watch('public/**/*.js', function(event) {
  console.log('File '+event.path+' was '+event.type+', running tasks...');
    
    gulp.task('default', ['one']);
    
    
});

