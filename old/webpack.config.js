module.exports = {
  context: path.resolve(__dirname, "src"), //fix windows: https://webpack.github.io/docs/troubleshooting.html#windows-paths
    entry: './main.ts',
    output: {
        library: 'DiagramJS',
        filename: 'diagram.js',
        path: path.resolve(__dirname, "dist"),//`${__dirname}/dist`,
	},
    devtool: 'inline-source-map',//cheap-module-eval-source-map // eval-source-map
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.json', '.ts'] //'.js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/, exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'}
        ]
    },
}