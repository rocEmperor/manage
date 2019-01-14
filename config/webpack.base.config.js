const path = require('path');
// const webpack = require('webpack');
// const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const packageParse = require('../package.json');
const version = packageParse.version?packageParse.version:"1.0.0";
const timeStamp = new Date().getTime();
module.exports = {
  // devtool: 'source-map',
  entry:'./src/index.js',
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: 'js/'+version+'['+timeStamp+']/[hash].async.js',
    // publicPath: '/dist/'
    // library: "antd",
    // libraryTarget: "antd",
  },
  plugins: [
    new ExtractTextPlugin('css/index.[hash].css'),
    // new CleanWebpackPlugin(['dist']),
    // new webpack.optimize.UglifyJsPlugin(),
    // new webpack.optimization.minimize(),
    new HtmlWebpackPlugin({template: './src/index.ejs', inject: true}),
    // new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname,'../static'),
        to: './'
      }
    ]),
    // new LessPluginAutoPrefix({
    //   browsers: ['last 3 version']
    // })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    // modules: ['./', 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: ['babel-loader'],
        include: path.join(process.cwd(), 'src')
      },
      { test: /\.(css|less)$/,
        use:[
          {loader:'style-loader'},
          {loader:'css-loader'},
          // {loader:'css-loader?modules',
          //   options: {
          //     modules: true,
          //     importLoaders: 1,
          //     sourceMap: true,
          //     localIdentName: '[local]___[hash:base64:5]'
          //   }
          // },
          // {loader: 'postcss'},
          {loader:'less-loader', options: { 
            modifyVars:{"@font-size-base":"12px"},
            javascriptEnabled: true}
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        }
      }
    ]
  },
};
