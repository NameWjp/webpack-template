const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const paths = require('./paths');

// 合并用户设置的环境变量
['.env.local', '.env'].forEach((envPath) => {
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../', envPath)));
    Object.entries(envConfig).forEach(([key, value]) => {
      if (!process.env[key] && value) {
        process.env[key] = value;
      }
    });
  }
});

const webpackCommonConfig = {
  entry: [path.resolve(paths.src, './index.js')],
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          // 将 public 文件夹的内容拷贝到 dist 根目录，也可使用相对路径（例如：assets 代表拷贝到 dist/assets 下）
          to: paths.build,
          toType: 'dir',
          // 忽略 index.html，使用 HtmlWebpackPlugin 生成
          globOptions: {
            dot: true,
            ignore: [
              '*.DS_Store',
              '**/public/index.html',
            ],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(paths.public, './index.html'), // template file
      filename: 'index.html',
      templateParameters: {
        BASE_URL: paths.publicPath,
      },
    }),
    new EslintWebpackPlugin({
      formatter: 'codeframe',
      extensions: ['.js', '.json', '.vue'],
      files: ['src'],
    }),
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.js$/,
        // 忽略从 core-js 自动导入的依赖包
        // exclude: /[\\/]core-js.+[\\/]/,
        // 忽略从 node_modules 导入的依赖包
        exclude: /[\\/]node_modules[\\/]/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/img/[name].[contenthash][ext]',
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[name].[contenthash][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      '@': paths.src,
    },
  },
};

if (process.env.PROXY_BASE_URL) {
  if (!webpackCommonConfig.plugins) {
    webpackCommonConfig.plugins = [];
  }
  webpackCommonConfig.plugins.push(
    new webpack.DefinePlugin({
      PROXY_BASE_URL: JSON.stringify(process.env.PROXY_BASE_URL),
    }),
  );
}

module.exports = webpackCommonConfig;
