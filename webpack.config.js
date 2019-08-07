const path = require('path')
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin
const webpack = require('webpack')


module.exports = {
  entry: {
    app: path.resolve('./src/index.ts')
  },

  output: {
    path: path.resolve('./dist'),
    filename: '[name].bundle.js'
  },

  // context: path.resolve('./src'),

  target: 'node',
  mode: 'production',

  module: {
    rules: [
      {
        // enforce: 'pre',
        test: /\.js$/,
        use: 'babel-loader'
    },
    // {
    //   test: /node_modules\/ccxt\/(.+)\.js$/,
    //           loader: "babel-loader",
    //           options: {
    //             babelrc: false,
    //             cacheDirectory: false,
    //             presets: ["es2015"],
    //             plugins: ["syntax-async-functions", "transform-regenerator"]
    //           }
    // },
    // {
    //     enforce: 'pre',
    //     test: /\.ts$/,
    //     exclude: /node_modules/,
    //     use: 'tslint-loader'
    // },
      {
        test: /\.tsx?$/,
        exclude: [ /node_modules/ ],
        use: ['babel-loader', 'awesome-typescript-loader'],
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    modules: [
      path.join(__dirname, 'src'),
      // path.join(__dirname, 'app/node_modules'),
      'node_modules',
    ],
    plugins: [
      new TsConfigPathsPlugin({ configFileName: path.resolve('./tsconfig.json') })
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    })
  ],
}
