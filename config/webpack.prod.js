const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
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
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          'postcss-loader',
          'sass-loader',
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
      new TerserPlugin({
        extractComments: false, // 不提取注释
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        corejs: {
          name: 'chunk-corejs',
          priority: 40,
          test: /[\\/]core-js.+[\\/]/,
        },
        vue: {
          name: 'chunk-vue',
          priority: 30,
          test: /[\\/]node_modules[\\/]@?vue(.*)/,
        },
        elementPlus: {
          name: 'chunk-element-plus',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?element-plus(.*)/,
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

if (process.env.BUILD_ANALY === 'true') {
  if (!webpackProdConfig.plugins) {
    webpackProdConfig.plugins = [];
  }
  webpackProdConfig.plugins.push(
    new BundleAnalyzerPlugin(
      {
        analyzerPort: 8888,
      },
    ),
  );
}

module.exports = merge(webpackCommonConfig, webpackProdConfig);
