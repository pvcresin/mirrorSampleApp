const webpack = require('webpack')
const path = require('path')

module.exports = {
	entry: {
		app: path.join(__dirname, 'src/js/app.js')
	},
	output: {
		path: path.join(__dirname, 'dist/js/'),
		filename: '[name].js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015']
			}
		}]
	},
	resolve: {
		extensions: ['.js']
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			mangle: true
		})
	]
}