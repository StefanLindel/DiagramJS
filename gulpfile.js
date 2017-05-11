"use strict";

const bump = require('gulp-bump');
const del = require('del');
const DevServer = require('webpack-dev-server');
const exec = require('child_process').exec;
const fs = require('fs');
const git = require('gulp-git');
const gulp = require('gulp');
const gutil = require('gulp-Util');
const semver = require('semver');
const webpack = require('webpack');
const path = require('path');

let webpackConfig = {
    context: path.resolve(__dirname, "src"), //fix windows: https://webpack.github.io/docs/troubleshooting.html#windows-paths
    entry: './main.ts',
    output: {
        library: 'DiagramJS',
        filename: 'diagram.js',
        path: path.resolve(__dirname, "dist"),//`${__dirname}/dist`,
    },
    devtool: 'inline-source-map',//cheap-module-eval-source-map // eval-source-map
    resolve: {
        extensions: ['', '.webpack.js', '.web.js',  '.json', '.ts'] //'.js',
    },
    module: {
        rules: [
            {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'}
        ],
        preLoaders: [
            {test: /\.ts$/, loader: 'tslint', exclude: /node_modules/}
        ],
        loaders: [
            {test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/}
        ]
    },
    tslint: {
        emitErrors: false,
        failOnHint: false,
    }
};

const errorOptions = {
    colors: true, hash: false, version: false, timings: false, assets: false, chunks: false,
    chunkModules: false, modules: false, children: false, cached: false, reasons: false,
    source: false, errorDetails: true, chunkOrigins: false
};

gulp.task('test', (callback) => {
    exec('npm test', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        del(['tmp']);
        callback(err);
    });
});

gulp.task('build:dev', (callback) => {

    webpackConfig.devtool = 'source-map';
    webpackConfig.debug = true;
    // webpackConfig.preLoaders = [ { test: /\.js$/, loader: 'source-map-loader' } ];

    webpack(webpackConfig, (err, stats) => {
        console.log(stats.toString(errorOptions));
        if (err) {
            console.log(err);
        }
        callback();
    });
});

gulp.task('build:prod', (callback) => {

    del(['dist/**/*']);

    webpackConfig.plugins = [new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})];

    webpack(webpackConfig, (err, stats) => {
        console.log(stats.toString(errorOptions));
        if (err) {
            console.log(err);
        }
        callback();
    });
});

gulp.task('build:dev-server', function (callback) {

    webpackConfig.devtool = 'eval';

    new DevServer(webpack(webpackConfig), {
        publicPath: `${__dirname}`,
        contentBase: './',
        port: 8080,
        hot: true,
        open: true,
        stats: errorOptions
    })
        .listen(8080, '127.0.0.1', function (err) {
            if (err) throw new gutil.PluginError('webpack-dev-server', err);
            gutil.log('[webpack-dev-server]', 'http://127.0.0.1:8080/webpack-dev-server/demo/');
        });
});

gulp.task('build:watch', (callback) => {

    webpackConfig.devtool = 'eval';
    webpackConfig.debug = true;

    webpack(webpackConfig, (err, stats) => {
        if (err) {
            console.log(err);
        }
        callback();
    });
});

const stylesInput = './*.css';
const stylesOutput = './dist';

let getPackageJson = () => {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

gulp.task('watch', ['build:dev'], function () {
    const tsFolders = [
        './src/**/*'
    ];
    gulp.watch(tsFolders, ['build:watch']);
});

gulp.task('default', ['build:dev']);
gulp.task('dev', ['build:dev-server']);
gulp.task('prod', ['build:prod']);
