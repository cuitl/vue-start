// const path = require('path');
const publicPath = '/start'

module.exports = {
  publicPath,

  // 开启 css modules 替代 css scope
  css: {
    // modules: true,
    requireModuleExtension: true,
    loaderOptions: {
      css: {
        modules: {
          localIdentName: '[name]-[local]-[hash:base64:6]'
        },
        localsConvention: 'camelCaseOnly'
      },
      sass: {
        // @/ 是 src/ 的别名
        // data: '@import "~@/common/sass/variables.scss";'
      }
    }
  }
}
