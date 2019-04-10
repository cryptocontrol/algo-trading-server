const path = require('path')
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin
const webpack = require('webpack')


module.exports = {
  entry: {
    app: './src/index.ts'
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].bundle.js'
  },

  context: path.resolve('./src'),

  mode: 'production',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/\/node_modules\//],
        use: ['awesome-typescript-loader']
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    modules: [
      path.join(__dirname, 'app'),
      // path.join(__dirname, 'app/node_modules'),
      'node_modules',
    ],
    plugins: [
      new TsConfigPathsPlugin({ configFileName: "./tsconfig.json" })
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],

  target: 'node'
}
