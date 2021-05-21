const mocker = require('mockjs')

/*
 * warp response
 */
const resWrapData = {
  returnCode: 0,
  returnMsg: 'OK',
  result: []
}

/*
 * 使用mockjs 处理模板数据
 *
 * @param {Object} data mockjs模板
 * @returns {Object} mockjs生成的数据
 */
function warpMockData(data) {
  let body = mocker.mock(data)
  return Object.assign({}, resWrapData, body)
}

module.exports = function mockServer(req, res, next) {
  let mockFile = req.path.replace(/\/\d+/g, '/0')
  try {
    const mockFn = require(`../mock${mockFile}`)
    setTimeout(() => {
      res.json(warpMockData(mockFn(req, res)))
    }, 300)
  } catch (e) {
    console.error(mockFile, '未配置mock数据')
    res.json(resWrapData)
  }
}
