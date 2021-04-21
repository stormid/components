const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('../package.json')

module.exports = {
	entry: './example/src/js/index.js',
  	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, './build')
  	},
  	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new CleanWebpackPlugin(['./build']),
		new HtmlWebpackPlugin({
			title: pkg.name,
			template: './example/src/index.html',
			filename: 'index.html'
		}),
		new HtmlWebpackPlugin({
			title: pkg.name,
			template: './example/src/page-2.html',
			filename: 'page-2.html'
		}),
		new HtmlWebpackPlugin({
			title: pkg.name,
			template: './example/src/page-3.html',
			filename: 'page-3.html'
		}),
		new HtmlWebpackPlugin({
			title: pkg.name,
			template: './example/src/ecommerce/index.html',
			filename: 'ecommerce/index.html'
		}),
		new HtmlWebpackPlugin({
			title: pkg.name,
			template: './example/src/ecommerce/basket.html',
			filename: 'ecommerce/basket.html'
		}),
		new HtmlWebpackPlugin({
			title: pkg.name,
			template: './example/src/ecommerce/confirmation.html',
			filename: 'ecommerce/confirmation.html'
		}),
		new HtmlWebpackPlugin({
			title: pkg.name,
			template: './example/src/ecommerce/details.html',
			filename: 'ecommerce/details.html'
		}),
		new HtmlWebpackPlugin({
			title: pkg.name,
			template: './example/src/ecommerce/delivery.html',
			filename: 'ecommerce/delivery.html'
		}),
		new HtmlWebpackPlugin({
			title: pkg.name,
			template: './example/src/ecommerce/payment.html',
			filename: 'ecommerce/payment.html'
		})
	],
  	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					rootMode: "upward",
				}
			}
	  	},
		  {
			test: /\.(ico)$/,
			use: {
		  		loader: 'file-loader'
			}
		}]
	}
}
