
// const path = require('path');
var path = require("path");
module.exports  = {
	mode: "development",
	entry: "./main.ts",
	context: path.resolve(__dirname, "src"),
	output: {
		library: "DiagramJS",
		filename: "diagram.js",
		path: path.resolve(__dirname, "dist"),
	},
	devtool: "source-map",//cheap-module-eval-source-map // eval-source-map
	resolve: {
		extensions: [".ts", ".js"]
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
// gulp-to-webpack/webpack.config.js
devServer: {
	contentBase: "./src"
}