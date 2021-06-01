const webpack = require('webpack');
const { merge } = require('webpack-merge');

const paths = require('./paths');
const webpackCommonConfig = require('./webpack.common');

const port = process.env.DEV_PORT || 8080;

const webpackDevConfig = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  /**
   * 在有 .browserslistrc 文件时，必须要指定 target，不然 webpack-dev-server 无法识别环境（真尼玛坑爹）
   * 详见：https://github.com/webpack/webpack-dev-server/issues/2758
  */
  target: 'web',
  output: {
    path: paths.build,
    publicPath: '/',
    filename: '[name].js',
  },
  devServer: {
    historyApiFallback: true,
    contentBase: paths.build,
    open: true,
    compress: true,
    hot: true,
    port,
    overlay: {
      warnings: false,
      errors: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
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
          'style-loader',
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
    new webpack.HotModuleReplacementPlugin(),
  ],
};

if (process.env.PROXY_BASE_URL && process.env.API_PROXY) {
  webpackDevConfig.devServer.proxy = {
    [process.env.PROXY_BASE_URL]: {
      target: process.env.API_PROXY,
      changeOrigin: true,
    },
  };
}

module.exports = merge(webpackCommonConfig, webpackDevConfig);
