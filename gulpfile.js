//定义依赖和插件
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    cssnano = require('gulp-cssnano'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    proxyMiddleware = require('http-proxy-middleware');

// js
var jsSrc = 'src/js/*.js';
var jsDist = 'dist/js';


// scss 
var _css_dir_1 = 'src/scss/*.scss';
var cssDist = 'dist/css';

// css 
var _css_dir_2 = 'src/css/*.css';

// html
var htmlSrc = 'src/*.html';
var htmlDist = 'dist/';

// js合并压缩任务
gulp.task('jsTask', function(){
    gulp.src(jsSrc)
        // .pipe(concat('main.js'))
        // .pipe(gulp.dest(jsDist))
        // .pipe(rename({suffix: '.min'}))
        // .pipe(uglify())
        .pipe(gulp.dest(jsDist))
});

// css合并压缩任务
gulp.task('cssTask', function(){
    gulp.src(_css_dir_1)
        .pipe(plumber())
        .pipe(sass())
        .pipe(cssnano())
        .pipe(gulp.dest(cssDist))

    gulp.src(_css_dir_2)
        .pipe(plumber())
        .pipe(cssnano())
        .pipe(gulp.dest(cssDist))
});

// images
gulp.task('imageTask', function () {
    gulp.src('src/images/*.{png,jpg,gif,ico}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});

// html任务
gulp.task('htmlTask', function(){
    gulp.src(htmlSrc)
        .pipe(gulp.dest(htmlDist))
        .pipe(connect.reload())
});

// 代理dist目录
gulp.task('server:dist', ['listen'], function() {
    var middleware = proxyMiddleware(['/alipay/crm/appMemberLogin','/alipay/crm/logout','/alipay/crm/queryRecords','/alipay/crm/getCouponPromotions','/alipay/crm/appGetCouponcode','/alipay/crm/getUserByPhone','/alipay/crm/appMember','/alipay/crm/appMemberDetailEdit','/alipay/crm/queryPointList','/alipay/crm/addCode','/alipay/crm/newCode','/alipay/crm/appMemberChangePayPwd','/alipay/crm/queryMemberLevelRule','/alipay/crm/pointList','/alipay/crm/appMemberLoginTest','/alipay/crm/checkCode','/alipay/crm/appMemberForgetPwd','/alipay/crm/preRecharge','/alipay/crm/preRechargeByThirdPay'], {
        target: 'https://wap.m.zkungfu.com',
        changeOrigin: true
    });
    connect.server({
        root: './dist',
        port: 8089,
        livereload: true,
        middleware: function(connect, opt) {
            return [middleware]
        }

    });
});


gulp.task('listen', function () {
    gulp.watch(['src/*.html'], ['htmlTask']);
    gulp.watch(['src/js/*.js'], ['jsTask']);
    gulp.watch(['src/scss/*.scss'], ['cssTask']);
    gulp.watch(['src/images/*.{png,jpg,gif,ico}'], ['imageTask']);
});

gulp.task('default',['listen','server:dist','htmlTask','jsTask','cssTask','imageTask']);