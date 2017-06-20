var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = function (env) {
  env = {
    production: process.env.NODE_ENV.toLowerCase() === 'production'
  };

  var plugins = [
    new CopyWebpackPlugin([
      {from: 'index.html', to: 'dist/index.html'},
      {from: 'settings.json', to: 'dist/settings.json'}
    ])
  ];

  var devServer = {
    overlay: {
      warning: false,
      error: true
    }
  };

  if (env.production) {
    plugins.push(new UglifyJSPlugin({
      comments: false,
      compress: {
        drop_console: true
      }
    }));
  }

  if (!env.production) {
    plugins.push(new FriendlyErrorsPlugin())
  }

  return {
    entry: './src/main.js',
    output: {
      filename: env && env.production ? 'dist/js/bundle.js' : 'js/bundle.js',
      libraryTarget: 'var',
    },
    devtool: env && env.production ? '' : 'cheap-eval-source-map',
    devServer: devServer,
    resolve: {
      extensions: ['.js']
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            quiet: !env.production,
            formatter: require('eslint-friendly-formatter')
          }
        },
        {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
      ]
    },
    plugins: plugins
  }
};
