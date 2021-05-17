/**
 * 工具函数集合
 */

// 从左到右执行函数，最左侧的函数可以传递多个参数，后续函数接收一个参数
export const pipe =
  (...fns) =>
  (...args) =>
    fns.reduce((f, fn) => fn(f(...args)))

// 从右到做执行函数，最右侧函数可以传递多个参数 其结果作为 左侧函数的入参
export const compose =
  (...fns) =>
  (...args) =>
    fns.reduceRight((f, fn) => fn(f(...args)))

/**
 * 函数防抖
 * @param {Function} fn 要处理的函数
 * @param {Number} timeout 时间 ms
 * @param {Boolean} immediate 是否连续触发 开始时执行函数, false 则连续触发结束后执行
 * @returns {Function} 防抖函数
 */
export const debounce = (fn, timeout = 50, immediate) => {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    } else if (immediate) {
      fn(...args)
    }
    timer = setTimeout(() => {
      if (immediate) {
        timer = null
      } else {
        fn(...args)
      }
    }, timeout)
  }
}

/**
 * 函数节流
 * 连续触发状态下 - 每过一段时间 执行函数
 * @param {Function} fn 要节流的函数
 * @param {Number} time 执行时间段 ms
 * @param {Boolean} immediate 首次立即执行
 * @param {Boolean} defer 延迟执行（连续触发结束后）
 * @returns {Function} fn
 */
export const throttle = (fn, time = 50, immediate = true, defer) => {
  let lastTime = Date.now()
  let timer

  return function (...args) {
    if (immediate) {
      // 首次声明并立即执行会因为未到时间无法立即执行
      // set false 连续触发节后后，隔一段时间在执行，由于 lastTime过早会立即执行
      immediate = false
      fn(...args)
      return
    }

    const currentTime = Date.now()
    // 每过 time 时间就执行函数
    if (currentTime >= lastTime + time) {
      lastTime = currentTime
      fn(...args)
      return
    }

    // 连续触发函数停止, 执行最后一次
    if (defer) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn(...args)
      }, time)
    }
  }
}

/**
 * 函数柯里化
 * @param {Function} fn 要处理的函数
 * @param  {...any} args 预置的参数
 * @returns {Function} 柯里化后的函数
 */
export const curry = (fn, ...args) => (fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args))

// export const curry = (fn, ...args) => {
//   const len = fn.length
//   return args.length >= len ?
//   fn(...args) :
//   curry.bind(null, fn, ...args)
// }

// 函数反柯里化，用于扩大函数的适用性
export const unCurry = fn => fn.call.bind(fn)

// 获取随机串
export const getUUID = (len = 32) => {
  const hexDigits = '0123456789abcdef'
  return [...new Array(len).keys()].reduce(acc => {
    acc += hexDigits.substr(Math.floor(Math.random() * 16), 1)
    return acc
  }, '')
}

// 根据图片 url地址 下载图片
export const downloadIamge = function (imgsrc = '', name) {
  const image = new Image()
  const lastIndex = imgsrc.lastIndexOf('.')
  const fileType = lastIndex > -1 ? imgsrc.substr(lastIndex + 1).toLowerCase() : 'png'
  name = name || 'photo'

  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous')
  image.onload = function () {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    let context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    // 得到图片的base64编码数据
    let url = canvas.toDataURL(`image/${fileType}`)
    let a = document.createElement('a')
    let event = new MouseEvent('click')
    a.download = `${name}.${fileType}`
    a.href = url
    // 触发a的单击事件
    a.dispatchEvent(event)
  }
  image.onerror = function (e) {
    console.warn('下载图片失败', e)
  }
  image.src = imgsrc
}

/**
 * 根据文件路径下载文件
 * @param {String} filePath 文件路径
 * @param {String} name 文件名称 - 带后缀 如：1.mp4
 */
export const downloadFile = (filePath, name) => {
  const triggerElementA = (url, name) => {
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style.display = 'none'
    a.href = url
    // 指定下载的文件名
    a.download = name
    if (typeof MouseEvent === 'function') {
      let event = new MouseEvent('click')
      a.dispatchEvent(event)
    } else {
      a.click()
    }
    document.body.removeChild(a)
  }

  window
    .fetch(filePath)
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob)

      triggerElementA(url, name)

      // 移除blob对象的url
      window.URL.revokeObjectURL(url)
    })
    .catch(e => {
      console.warn('download file by fetch blob failed!', e)
      triggerElementA(filePath, name)
    })
}

/**
 * 数据合并 用于当数据结构固定时，合并目标数据，并保持原结构不变
 * 如：表单数据 1 {a: {id: 1, name: '', home: {id: 1, 2}}}
 * 详情数据 2 { a: {id: 1, name: '', home: null} }
 * 2 合并到 1中，home 结构不会被破坏
 * @param {Object} data 要合入的数据
 * @param {Object} target 要合并的数据
 * @return {Object} 返回 data数据
 */
export const mergeData = (data, target) => {
  // 不是对象直接返回
  if (typeof data !== 'object' || data === null) {
    return data
  }
  // 数组时 判断使用目标数组
  if (Array.isArray(data)) {
    return Array.isArray(target) ? target : data
  }

  target = target || {}

  const keys = Object.keys(data)

  if (keys.length === 0) {
    // 原来的对象是空对象时， 返回 target对象
    return Object.assign({}, target)
  }

  // 对象时，循环对象 进行逐个字段的赋值
  keys.forEach(key => {
    if (typeof data[key] === 'object') {
      data[key] = mergeData(data[key], target[key])
    } else if (target[key] === 0) {
      data[key] = 0
    } else if (target[key] === false) {
      data[key] = false
    } else {
      data[key] = target[key] || data[key]
    }
  })
  return data
}

const isAvailable = val => {
  return typeof val === 'object' ? !!Object.keys(val || []).length : !!val
}

// 接口获取的安全返回方法 及数据缓存
export const getFetchSafty = (fn, useCache = false) => {
  // promise 及 数据 缓存
  const cachePromises = {}

  async function fetch(...args) {
    let key = JSON.stringify(args)

    let result
    try {
      if (!cachePromises[key]) {
        cachePromises[key] = fn(...args)
      }
      result = await cachePromises[key]
    } catch (error) {
      result = null
    }

    const ifCache = () => {
      if (typeof useCache === 'function' && useCache(result)) {
        return true
      }
      if (useCache && isAvailable(result)) {
        return true
      }
      return false
    }
    // 未达到缓存要求
    if (!ifCache()) {
      delete cachePromises[key]
    }

    return result
  }

  // 清空缓存
  fetch.clear = function () {
    Object.keys(cachePromises).forEach(key => {
      delete cachePromises[key]
    })
  }

  return fetch
}

// 检测 webp图片可用性
export const canUseWebp = (function () {
  var elem = document.createElement('canvas')
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }
  return false
})()

/**
 * 获取图片的宽高
 * @param {String} url 图片的路径
 * @return {Object} Promise
 */
export function getImageReact(url) {
  return new Promise((resolve, reject) => {
    var img = new Image()
    img.src = url
    let set = null
    // 图片以缓存直接获取宽高
    if (img.complete) {
      resolve({ width: img.width, height: img.height, type: 'cache' })
      return
    }
    // 定时获取宽高（首次加载效率高）
    let check = () => {
      if (!img) {
        return
      }
      if (img.width > 0 || img.height > 0) {
        resolve({ width: img.width, height: img.height, type: 'interval' })
        clearInterval(set)
      }
    }
    set = setInterval(check, 40)
    img.onload = function () {
      resolve({ width: this.width, height: this.height, type: 'onload' })
    }
    img.onerror = error => {
      clearInterval(set)
      reject(error)
    }
  })
}

/**
 * 获取字符串上对应的数值，字符串格式为  a=1&b=2
 * @param {String} str 传入字符串
 * @param {String} name 要获取的key值
 */
export function getQuery(str, name) {
  var reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  var r = str.match(reg)
  var result = ''
  if (r !== null) {
    result = decodeURI(r[2])
  }
  return result
}

/**
 * 获取浏览器 url 上的参数
 * @param {String} name
 */
export function getQueryString(name) {
  return getQuery(window.location.search.substr(1), name)
}

/**
 * 删除url上的参数
 * @param {String} url url地址
 * @param {String} name 要删除的字段名
 */
export function deleteQuery(url, name) {
  let [base, params] = url.split('?')
  if (params.indexOf(name) === -1) {
    return url
  }
  let paramsArr = params.split('&')
  return base + '?' + paramsArr.filter(param => param.split('=')[0] !== name).join('&')
}

/**
 * 获取cookie 数据
 * @param {String} cookieName cookie key 值
 * @return {String} cookie 数据
 */
export function getCookie(cookieName) {
  if (document.cookie.length === 0) {
    return ''
  }
  let start = document.cookie.indexOf(`${cookieName}=`)
  if (start === -1) {
    return ''
  }
  start += cookieName.length + 1
  let end = document.cookie.indexOf(';', start)
  if (end == -1) {
    end = document.cookie.length
  }
  return unescape(document.cookie.substring(start, end))
}

/**
 * 设置cookie值
 * @param {String} name key
 * @param {String} value value
 * @param {Number} days 天数
 */
export function setCookie(name, value, days) {
  let str = `${name}=${escape(value)}`
  if (days > 0) {
    var date = new Date()
    var ms = days * 24 * 3600 * 1000
    date.setTime(date.getTime() + ms)
    str += `; expires=${date.toGMTString()}`
  }
  if (days === Infinity) {
    str += '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
  }
  str += '; path=/'
  document.cookie = str
}

const loaderManager = {
  js: [],
  css: []
}

/* 动态加载样式表 */
export function loadStyle(href) {
  if (loaderManager.css.includes(href)) {
    return
  }
  var style = document.createElement('link')
  style.rel = 'stylesheet'
  style.type = 'text/css'
  style.href = href
  document.getElementsByTagName('head')[0].appendChild(style)
  loaderManager.css.push(href)
}

/* 动态加载JS */
export function loadScript(url, callback, async, onerror) {
  callback = typeof callback === 'function' ? callback : function () {}
  // 已经加载成功，不再进行加载
  if (loaderManager.js.includes(url)) {
    callback()
    return
  }
  let script = document.createElement('script')
  script.onload = script.onreadystatechange = function () {
    let { readyState } = script
    if (!readyState || readyState === 'loaded' || readyState === 'complete') {
      loaderManager.js.push(url)
      try {
        callback()
      } finally {
        script.onload = script.onreadystatechange = null
        // script.parentNode.removeChild(script);
        script = null
      }
    }
  }
  // 监听加载失败
  if (typeof onerror === 'function') {
    script.onerror = onerror
  }
  script.type = 'text/javascript'
  script.charset = 'utf-8'
  script.async = !!async
  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script)
}

// 动态加载 js promise 化
export function scriptLoader(url, async) {
  return new Promise((resolve, reject) => {
    loadScript(url, resolve, async, reject)
  })
}
