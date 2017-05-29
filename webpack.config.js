var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function(env) {
  env = {
    production: process.env.NODE_ENV.toLowerCase() === 'production'
  }

  var plugins = [
    new CopyWebpackPlugin([
      {from: 'index.html', to: 'dist/index.html'},
      {from: 'settings.json', to: 'dist/settings.json'}
    ])
  ];

  if (env.production) {
    plugins.push(new UglifyJSPlugin({
      comments: false
    }))
  }

  return {
    entry: './src/main.js',
    output: {
      filename: env && env.production ? 'dist/js/bundle.js' : 'js/bundle.js',
      libraryTarget: 'var'
    },
    devtool: env && env.production ? '' : 'cheap-eval-source-map',
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
      ]
    },
    plugins: plugins
  }
}
