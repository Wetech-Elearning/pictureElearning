/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 是否是手机号
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 * @returns
 */
export const isMobileNumber = (rule, value, callback) => {
  if (!value) {
    return new Error('请输入电话号码')
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    const isPhone = reg.test(value)
    value = Number(value) // 转换为数字
    if (typeof value === 'number' && !isNaN(value)) { // 判断是否为数字
      value = value.toString() // 转换成字符串
      if (value.length < 0 || value.length > 12 || !isPhone) { // 判断是否为11位手机号
        callback(new Error('手机号码格式如:138xxxx8754'))
      } else {
        callback()
      }
    } else {
      callback(new Error('请输入电话号码'))
    }
  }
}

/**
 * 是否是邮箱
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const isEmail = (rule, value, callback) => {
  if (!value) {
    callback()
  } else {
    const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
    const email = reg.test(value)
    if (!email) {
      callback(new Error('邮箱格式如:admin@163.com'))
    } else {
      callback()
    }
  }
}

/**
 * 是否是身份证号
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 * @returns
 */
export const isCardId = (rule, value, callback) => {
  if (!value) {
    return new Error('请输入身份证号)')
  } else {
    const reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(([0-2][1-9])|10|20|30|31)\d{3}(\d|X|x)$/
    const card = reg.test(value)
    if (!card) {
      // 判断座机为12位
      callback(new Error('身份证格式如:423024xxxx0216xxxx'))
    } else {
      callback()
    }
  }
}

/**
 * 是否是价格
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const isPrice = (rule, value, callback) => {
  if (!value) {
    callback()
  } else {
    var reg = /^-?\d{1,4}(?:\.\d{1,2})?$/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('数字格式:0-9999或小数点后可加1到2位'))// 如:1 或1.8 或1.85
    }
  }
}

/**
 * 确认密码
 * @param {*} rule
 * @param {*} value
 * @param {*} password
 * @param {*} callback
 */
export const confirm2Password = (rule, value, password, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

/**
 * 年龄必须大于0
 * @param {*} rule
 * @param {*} value
 * @param {*} password
 * @param {*} callback
 */
export const ageCheck = (rule, value, callback) => {
  if (value < 0) {
    callback(new Error('年龄必须大于0'))
  } else {
    callback()
  }
}

/**
 * 序号必须大于0
 * @param {*} rule
 * @param {*} value
 * @param {*} password
 * @param {*} callback
 */
export const noCheck = (rule, value, callback) => {
  if (value < 0) {
    callback(new Error('序号必须大于0'))
  } else {
    callback()
  }
}

/**
 * 时长必须大于0
 * @param {*} rule
 * @param {*} value
 * @param {*} password
 * @param {*} callback
 */
export const timeCheck = (rule, value, callback) => {
  if (value < 0) {
    callback(new Error('时长必须大于0'))
  } else {
    callback()
  }
}
