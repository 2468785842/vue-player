const path = require('path');

const resolve = relativePath => path.join(__dirname, relativePath);

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@services', resolve('src/api/services'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@common', resolve('src/common'))
      .set('@model', resolve('src/model'))
      .set('@store', resolve('src/store'))
      .set('@utils', resolve('src/utils'));
  }
};