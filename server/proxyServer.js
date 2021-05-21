const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer()
const mockServer = require('./mockServer')

const target = {
  // 线上
  online: 'http://online.com',
  // 开发
  dev: 'http://dev.com',
  // 测试
  test: 'http://test.com'
}

module.exports = function proxyServer(req, res, next) {
  // 匹配 /api 开头的请求
  if (/^\/api\//.test(req.url)) {
    // console.log(req.params.type, '=====', req.body)

    if (process.env.MOCK === 'true') {
      Object.keys(req.params || {}).forEach(key => {
        req.url = req.url.replace(`/${req.params[key]}`, '/0')
      })

      console.log('mock -> ' + req.url)
      mockServer.call(this, req, res, next)
      return false
    }

    console.log('proxy -> ' + target.dev + req.url)
    return proxy.web(
      req,
      res,
      {
        target: target.dev,
        changeOrigin: false
      },
      err => {
        console.log('proxy failed', err)
      }
    )
  }
  return next()
}
