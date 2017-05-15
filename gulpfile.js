//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    autoprefixer = require('gulp-autoprefixer'),
    //cleancss = require('gulp-clean-css'),
    
    changed = require('gulp-changed');
    //debug = require('gulp-debug'),
    //tiny = require('gulp-tinypng-nokey'),
    
    
    
    //rename = require('gulp-rename');

//testCleanCss 把css给min化
// gulp.task('testCleanCss', function () {
//     gulp.src('styles/klxt2016/*.css') //该任务针对的文件
//         //该任务调用的模块
//         .pipe(changed('styles/klxt2016/min',{extension:'.css'}))
//         .pipe(debug({title: '编译:'}))
//         .pipe(cleancss())
//         .pipe(gulp.dest('styles/klxt2016/min')); //将会在src/css下生成index.css
// });

//tinyImg 把图片Tiny压缩 保存到 images/min 然后在覆盖回去
// gulp.task('tinyImg', function () {
//     gulp.src('images/klxt2016/*/*') //该任务针对的文件
//        .pipe(changed('images/min'))
//        .pipe(tiny())
//        .pipe(debug({title: '编译:'}))
//        .pipe(gulp.dest('images/min')); //将会在src/css下生成index.css
// });

//css 兼容前缀自动添加
gulp.task('cssHack', function () {
    gulp.src('public/css/reset.css') //该任务针对的文件
       //.pipe(changed('css/sstactivity2017/min',{extension:'.css'}))
       .pipe(autoprefixer())
       //.pipe(debug({title: '编译:'}))
       .pipe(gulp.dest('public/css/hack')); 
});


// 默认任务
gulp.task('default', function(){
    //gulp.run('testCleanCss');
    gulp.run('cssHack');
    // 监听文件变化
    //gulp.watch('styles/klxt2016/*.css', ['testCleanCss']);
    //gulp.watch('images/klxt2016/*/*', ['tinyImg']);
});

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组) 
//gulp.dest(path[, options]) 处理完后文件生成路径pt Document













