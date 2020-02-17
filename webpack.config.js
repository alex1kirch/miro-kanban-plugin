const path = require('path');

module.exports = {
	mode: 'none', // Tip! compile in 'production' mode before publish
  context: path.join(__dirname, './'),
	entry: {
		index: './src/index.ts',
	},
  output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'public')
	},
  resolve: {
		modules: [
			path.resolve('./src'),
			path.resolve('./node_modules')
		],
		extensions: ['.tsx', '.ts', '.js', '.less', '.css']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: 'ts-loader',
					options: {
						transpileOnly: true
					}
				},
				exclude: /node_modules/
			},
			{
				test: /\.less$/,
				use: [{
					loader: "style-loader"
				}, {
					loader: "css-loader"
				}, {
					loader: "less-loader"
				}],
				exclude: /node_modules/
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader'
			}
		]
	}
}