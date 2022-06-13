const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'react-app.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      { test: /\.s[ac]ss$/i, use: ["style-loader", "css-loader", "sass-loader", ], },
      { test: /\.css$/, use: ["style-loader", "css-loader"], },
      { test: /\.tsx?$/, exclude: /node_modules/, use: ['babel-loader', 'ts-loader'] },
      // { test: /\.pug$/, use: ['pug-loader'] },
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin({ uglifyOptions: { output: { comments: false } } })],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.pug']
  }
};