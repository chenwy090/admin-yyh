(function (window, doc) {
  var docEl = document.documentElement
  var dpr = window.devicePixelRatio || 1
  var scale = 1 / dpr
  var metaEl = document.querySelector('meta[name="viewport"]')
  // var tid
  docEl.setAttribute('data-dpr', dpr)
  metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no')
  function refreshRem () {
    var rem = docEl.clientWidth / 10
    console.log('userAgent' + window.navigator.userAgent)
    if (window.navigator.userAgent.indexOf('Android') > -1) { // 如果不是安卓设备则输出IOS的样式逻辑
      docEl.style.fontSize = rem + 'px'
    } else if (window.navigator.userAgent.indexOf('iPhone') > -1) { //如果不是安卓和IOS的样则默认执行pc的样式逻辑
      docEl.style.fontSize = rem + 'px'
    } else {
      docEl.style.fontSize = (rem > 68.1 ? 68.1 : rem) + 'px'
      window.addEventListener('load', function () {
        document.body.style.maxWidth = '664px'
        document.body.style.position = 'absolute'
        document.body.style.left = '50%'
        document.body.style.marginLeft = '-332px'
        // document.getElementById('html').style.height = document.body.offsetHeight + 'px'
      })
    }
  }
  refreshRem()
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      refreshRem()
    }
  })
  window.addEventListener('resize', refreshRem)
})(window, document)