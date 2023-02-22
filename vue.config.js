const { defineConfig } = require("@vue/cli-service");
// const path = require('path');
const express = require('express')
const proxyServer = require('./server/proxyServer')

const publicPath = '/start'

module.exports = defineConfig({
  transpileDependencies: true,

  publicPath,

  css: {
    // https://next.cli.vuejs.org/guide/css.html#css-modules
    loaderOptions: {
      css: {
        modules: {
          // to drop the [ .module ]
          // auto: () => true,

          // need module -> <style module> | demo.module.scss
          auto: () => false,

          localIdentName: '[name]-[hash]',
          exportLocalsConvention: 'camelCaseOnly'
        }
      },

      // scss: {
      //   additionalData: `@import "~@/variables.scss";`
      // },
    }
  },

  devServer: {
    // proxy: {
    // },
    port: process.env.port || 80,
    // https://webpack.docschina.org/configuration/dev-server/#devserversetupmiddlewares
    setupMiddlewares(middlewares, devServer) {
      // console.log(devServer, 'setupMiddlewares...')
      const {app} = devServer
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

      // middlewares.unshift({
      //   name: 'test',
      //   // `path` 是可选的
      //   // path: '/api2/user',
      //   middleware: (req, res, next) => {
      //     // console.log(req, res, next);
      //     if (req.originalUrl.indexOf('/api2') > -1) {
      //       res.send('api2 proxy');
      //       return
      //     }
      //     next()
      //   },
      // });

      return middlewares
    }
  }

  // 代理设置
  // devServer: {
  //   // open: 'Google Chrome',
  //   port: process.env.port || 80,
  //   https: false,
  //   hotOnly: false,
  //   setup: function (app) {
  //     // for parsing application/json
  //     app.use(express.json())
  //     // for parsing application/x-www-form-urlencoded
  //     app.use(express.urlencoded({ extended: true }))
  //     // 特别的接口的代理
  //     app.get('/api/:type', proxyServer)
  //     // 接口代理
  //     app.use(proxyServer)

  //     // static 资源映射 when reset public to other folder
  //     // let staticPath = path.posix.join(publicPath, assetsDir)
  //     // app.use(staticPath, express.static(path.resolve(__dirname, './static')))
  //   },
  //   // disableHostCheck: true
  // }

});
