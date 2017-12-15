const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = [{
	entry: path.join(__dirname, 'src/index.js'),
	output: {
		path: path.join(__dirname, 'public/'),
		filename: 'index.js'
	},
	module: {
		rules: [{
			test: /\.tag$/,
			enforce: 'pre',
			exclude: /node_modules/,
			loader: 'tag-pug-loader'
		}, {
			test: /\.js|\.tag$/,
			enforce: 'post',
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				query: {
					presets: ['es2015-riot']
				}
			}
		}, {
			test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
			use: {
				loader: 'url-loader',
				query: {
					limit: 10000,
					mimetype: 'application/font-woff'
				}
			}
		}, {
			test: /\.(ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
			loader: 'file-loader'
		}]
	},
	resolve: {
		extensions: ['.js', '.tag', '.woff', 'woff2', '.ttf', '.eot', '.svg']
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	},
		// 	mangle: true
		// })
	]
}, {
	entry: __dirname + '/src/server.js',
	output: {
		path: __dirname + '/dist/',
		filename: 'server.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['node6']
			}
		}]
	},
	target: 'node',
	externals: [
		nodeExternals()
	]
}]