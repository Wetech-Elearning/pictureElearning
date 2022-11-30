export default {
  /*
   * 获取图片路径 包含下发图片(cdn 或者取别人图片)和本地图片(本项目图片服务器端给的如‘/resource/1.png’)
   */
  getImgPath (path, sub) {
    if (path == null || path === '') {
      return ''
    }
    if (sub) {
      let substr = path.substr(path.lastIndexOf('.', path.length))
      path = `${path.substr(0, path.length - 4)}-${sub}${substr}`
    }
    return path && path.substr(0, 4) === 'http' ? path : `${window.SITE_CONFIG.imageBaseurl}/${path}`
  }
}
