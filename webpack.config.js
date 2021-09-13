const path = require('path');
var HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
	  {
		test: /\.(mp3|ttf|wav)$/,
		loader: 'file-loader'
	}
    ],
  },
  plugins : [
	new HTMLWebpackPlugin({ title: "Title", template: "./src/index.html" })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};