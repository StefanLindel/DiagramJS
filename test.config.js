const path = require('path');

let webpackConfig = {
	mode: 'development',
	devtool: 'source-map',
	entry: './TestFramework.ts',
	context: path.resolve(__dirname, "test"),
	output: {
		library: 'DiagramJS',
		filename: 'diagramTest.js',
		path: path.resolve(__dirname, "dist/")
	},
	devtool: 'source-map',//cheap-module-eval-source-map // eval-source-map
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts$/, 
				exclude: /node_modules/,
				use: "ts-loader"
			}
		]
	}
};

module.exports = webpackConfig

// gulp-to-webpack/webpack.config.js
devServer: {
	contentBase: './test'
}