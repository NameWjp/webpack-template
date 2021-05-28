const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');

const paths = require('./paths');
const webpackCommonConfig = require('./webpack.common');

const webpackProdConfig = {
  mode: 'production',
  // 可设置 nosources-source-map 会暴露反编译后的文件名，但不会暴露原始代码，利于调试。
  devtool: false,
  output: {
    path: paths.build,
    publicPath: paths.publicPath,
    filename: 'static/js/[name].[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
  ],
  optimization: {
    moduleIds: 'deterministic',
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        elementUI: {
          name: 'chunk-elementUI',
          priority: 30,
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
        },
        vue: {
          name: 'chunk-vue',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?vue(.*)/,
        },
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial',
        },
        commons: {
          name: 'chunk-commons',
          test: path.join(__dirname, '../src/components'),
          minChunks: 3,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};

module.exports = merge(webpackCommonConfig, webpackProdConfig);
