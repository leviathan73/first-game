const path = require('path');
var HTMLWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin");

module.exports = [{
	mode: 'production',
	entry: {
		client: './src/client/start.js',
	},
	module: {
		rules: [{
				test: /\.(tsx|ts)?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(mp3|ttf|wav)$/,
				loader: 'file-loader'
			}
		],
	},
	plugins: [
		new HTMLWebpackPlugin({
			title: "Asteroids",
			template: "./src/client/index.html"
		}),
		new NodePolyfillPlugin(),
		new CopyPlugin({
			patterns: [
			  { from: "./src/server/index.js", to: "../index.js" },
			],
		  }),
	],
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		fallback: {
			"fs": false,
			"tls": false,
			"net": false,
			"path": false,
			"zlib": false,
			"http": false,
			"https": false,
			"stream": false,
			"crypto": false,
			"util": false,
			"buffer": require.resolve("buffer/"),
			"crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
		}
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'public'),
	},

}]