import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './language/zh'
// import en from './language/en'
import ja from './language/ja'
import store from '@/store'

Vue.use(VueI18n)

const DEFAULT_LANG = 'zh'
const LOCALE_KEY = 'locale'
const locales = {
  zh: zh,
  /* en: en, */
  ja: ja
}

const i18n = new VueI18n({
  // 设置默认语言
  locale: window.localStorage.getItem('locale') || 'zh',
  messages: {
    zh,
    // en,
    ja
  },
  silentTranslationWarn: true
})

export const changeLanguage = lang => {
  if (lang === undefined) {
    lang = window.localStorage.getItem(LOCALE_KEY)
    if (locales[lang] === undefined) {
      lang = DEFAULT_LANG
    }
  }
  window.localStorage.setItem(LOCALE_KEY, lang)
  store.commit('common/updateLanguage', lang)
  Object.keys(locales).forEach(lang => {
    document.body.classList.remove(`lang-${lang}`)
  })
  document.body.classList.add(`lang-${lang}`)
  document.body.setAttribute('lang', lang)
  Vue.config.lang = lang
  i18n.locale = lang
}
window.i18n = i18n
export default i18n
