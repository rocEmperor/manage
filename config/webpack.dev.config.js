const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
  mode: "development",
  devtool: "source-map",
  // devServer: {
  //   publicPath: 'http://localhost:8080/as/',
  //   // contentBase: './dist',
  //   // compress: true,
  //   open: true,
  //   // openPage: 'index.html',
  //   hot: true,
  //   inline: true,
  //   port: 8080
  // },
  module: {
    rules: [        
      
    ]
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
    // new HtmlWebpackPlugin({template: './src/index.ejs', inject: true}),
  ]
});