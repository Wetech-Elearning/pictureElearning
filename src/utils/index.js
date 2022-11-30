import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

Vue.prototype.$isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Vue.cookie.delete('token')
  store.commit('resetStore')
  router.options.isAddDynamicMenuRoutes = false
}

/**
 * 获取当前日期时间
 */
export function getNowTime () {
  const now = new Date()
  // 得到年份
  const year = now.getFullYear()
  // 得到月份
  let month = now.getMonth()
  // 得到日期
  let date = now.getDate()
  // 时
  let hour = now.getHours()
  // 分
  let minutes = now.getMinutes()
  // 秒
  let second = now.getSeconds()
  month = month + 1
  month = month.toString().padStart(2, '0')
  date = date.toString().padStart(2, '0')
  return `${year}-${month}-${date} ${hour}:${minutes}:${second}`
}

/**
 * 数组去重
 */
export function uniqueArr (arr) {
  arr = arr.sort()
  var arr1 = [arr[0]]
  for (var i = 1, len = arr.length; i < len; i++) {
    if (arr[i] !== arr[i - 1]) {
      arr1.push(arr[i])
    }
  }
  return arr1
}

// html转pdf
export function getPdf (title, id) {
  html2Canvas(document.querySelector(`#${id}`), {
    allowTaint: true
  }).then(function (canvas) {
    var contentWidth = canvas.width
    var contentHeight = canvas.height
    var pageHeight = contentWidth / 592.28 * 841.89
    var leftHeight = contentHeight
    var position = 0
    var imgWidth = 595.28
    var imgHeight = 592.28 / contentWidth * contentHeight
    var pageData = canvas.toDataURL('image/jpeg', 1.0)
    var PDF = new JsPDF('', 'pt', 'a4')
    if (leftHeight < pageHeight) {
      PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
    } else {
      while (leftHeight > 0) {
        PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
        leftHeight -= pageHeight
        position -= 841.89
        if (leftHeight > 0) {
          PDF.addPage()
        }
      }
    }
    PDF.save(title + '.pdf')
  })
}
