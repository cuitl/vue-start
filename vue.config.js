// const path = require('path');
const express = require('express')
const proxyServer = require('./server/proxyServer')

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
  },
  // 代理设置
  devServer: {
    // open: 'Google Chrome',
    port: process.env.port || 80,
    https: false,
    hotOnly: false,
    setup: function (app) {
      // for parsing application/json
      app.use(express.json())
      // for parsing application/x-www-form-urlencoded
      app.use(express.urlencoded({ extended: true }))
      // 特别的接口的代理
      app.get('/api/:type', proxyServer)
      // 接口代理
      app.use(proxyServer)

      // static 资源映射 when reset public to other folder
      // let staticPath = path.posix.join(publicPath, assetsDir)
      // app.use(staticPath, express.static(path.resolve(__dirname, './static')))
    },
    disableHostCheck: true
  }
}
