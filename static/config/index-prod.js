/**
 * 生产环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://www.good-elearning.com/train-admin';
  // window.SITE_CONFIG['imageBaseurl'] = window.SITE_CONFIG['baseUrl']+"/sys/oss/images?path=";
  // window.SITE_CONFIG['preViewsurl'] = "http://52.195.17.165:8012/onlinePreview?url=";
  // window.SITE_CONFIG['register'] = "http://www.good-elearning.com/train";

  window.SITE_CONFIG['baseUrl'] = 'http://52.195.17.165:8081/train-admin'
  window.SITE_CONFIG['imageBaseurl'] = window.SITE_CONFIG['baseUrl'] + '/sys/oss/images?path='
  window.SITE_CONFIG['preViewsurl'] = 'http://52.195.17.165:8012/onlinePreview?url='
  window.SITE_CONFIG['register'] = 'http://www.good-elearning.com'

  // window.SITE_CONFIG['baseUrl'] = 'http://39.106.17.85:8081/train-admin';
  // window.SITE_CONFIG['imageBaseurl'] = window.SITE_CONFIG['baseUrl']+"/sys/oss/images?path=";
  // window.SITE_CONFIG['preViewsurl'] = "http://39.106.17.85:8012/onlinePreview?url=";
  // window.SITE_CONFIG['register'] = "http://39.106.17.85:8080/train";

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
