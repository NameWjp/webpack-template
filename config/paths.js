const path = require('path');

module.exports = {
  // 输入路径
  src: path.resolve(__dirname, '../src'),

  // 输出路径
  build: path.resolve(__dirname, '../dist'),

  // 静态资源路径
  public: path.resolve(__dirname, '../public'),

  // publicPath 静态资源前缀
  publicPath: '/',
};
