<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;">{{$t('platform.name')}}</a>
        <a class="site-navbar__brand-mini" href="javascript:;"></a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--center"
        mode="horizontal">
        <textscroll style="margin-left: 50px;line-height: 10px;" :textArr="textArr"></textscroll>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item index="1" @click="$router.push({ name: 'shouye' })">
          <icon-svg name="shouye" class="el-icon-shouye"></icon-svg>{{$t('platform.firstpage')}}
        </el-menu-item>
        <!--<el-menu-item index="2" @click="$router.push({ name: 'course' })">
          <icon-svg name="course" class="el-icon-course"></icon-svg>{{$t('platform.course_center')}}
        </el-menu-item>-->
       <!-- <el-menu-item index="3">
          <el-input v-model="search" placeholder="请输入搜索内容"></el-input>
          <icon-svg name="sousuo" class="el-icon-sousuo"></icon-svg>
        </el-menu-item>-->
        <el-menu-item index="4" @click="$router.push({ name: 'theme' })">
          <template slot="title">
            <el-badge value="new">
              <icon-svg name="shezhi" class="el-icon-setting"></icon-svg>
            </el-badge>
          </template>
        </el-menu-item>
        <el-menu-item index="5" v-if="isAdmin === false">
          <el-dropdown :show-timeout="0" placement="bottom">
            <el-badge class="el-dropdown-link" :value="200" :max="siteInfoCount + questionnaireInfoCount">
              <i class="el-icon-bell"></i>
            </el-badge>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="toSiteInfo()">
                {{$t('siteinfo.message')}}
                <font style="color: red;">{{siteInfoCount + questionnaireInfoCount}}</font>
                {{$t('siteinfo.unit')}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
        <el-submenu index="6">
          <template slot="title">{{$t('platform.language')}}</template>
          <el-menu-item index="6-1" @click.native="updateI18nHandle('zh')">中文</el-menu-item>
          <!--<el-menu-item index="6-2" @click.native="updateI18nHandle('en')">英文</el-menu-item>-->
          <el-menu-item index="6-2" @click.native="updateI18nHandle('ja')">日本語</el-menu-item>
        </el-submenu>
        <el-menu-item class="site-navbar__avatar" index="7">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <div v-html="avatar" class="avtart-block"></div>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="userInfoHandle()">{{$t('platform.user_info')}}</el-dropdown-item>
              <el-dropdown-item @click.native="updatePasswordHandle()">{{$t('platform.update_password')}}</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">{{$t('platform.logout')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          {{userName}}
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 个人信息 -->
    <userInfo v-if="userInfoVisible" ref="userInfo" @refreshDataList="init"></userInfo>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
    <!-- 站内信 -->
    <allSiteInfo v-if="siteInfoIsible" ref="allSiteInfo" @refreshDataList="init"></allSiteInfo>
  </nav>
</template>

<script>
  import { changeLanguage } from '@/i18n/index.js'
  import UpdatePassword from './main-navbar-update-password'
  import userInfo from './main-navbar-user-info'
  import allSiteInfo from './common/siteinfo'
  import textscroll from '@/components/textscroll'
  import { clearLoginInfo } from '@/utils'
  import multiavatar from '@multiavatar/multiavatar'
  export default {
    data () {
      return {
        siteInfoIsible: false,
        updatePassowrdVisible: false,
        userInfoVisible: false,
        search: '',
        siteInfoCount: 0,
        questionnaireInfoCount: 0,
        textArr: [],
        avatar: ''
      }
    },
    components: {
      UpdatePassword,
      allSiteInfo,
      textscroll,
      userInfo
    },
    computed: {
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      userName: {
        get () { return this.$store.state.user.name }
      },
      userId: {
        get () {
          console.log('this.$store.state.user.id', this.$store.state.user.id )
          return this.$store.state.user.id
        }
      },
      isAdmin: {
        get () {
          const roles = this.$cookie.get('roles')
          if (roles.indexOf('2') > -1) {
            return true
          }
          return false
        }
      }
    },
    created () {
      this.initSiteInfo()
      this.initQuestionnaireInfo()
      this.getCompanyInfo()
      this.initAvatar()
    },
    methods: {
      init(){
        this.initSiteInfo()
        this.initQuestionnaireInfo()
        this.initAvatar()
      },
      // 初始化站内信信息
      initSiteInfo () {
        if(this.isAdmin){
          this.siteInfoCount = 0
          return
        }
        const userId = this.$cookie.get('userId');
        this.$http({
            url: this.$http.adornUrl('/generator/siteinfo/count'),
            method: 'get',
            params: this.$http.adornParams({
              'userId': userId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.siteInfoCount = data.data
            }
          })
      },
      //跳转站内信列表
      toSiteInfo(){
        this.siteInfoIsible = true
        this.$nextTick(() => {
          this.$refs.allSiteInfo.init(this.siteInfoCount,this.questionnaireInfoCount)
        })
      },
      // 初始化调查问卷信息
      initQuestionnaireInfo () {
        const userId = this.$cookie.get('userId');
        this.$http({
          url: this.$http.adornUrl('/generator/questionnairerelation/count'),
          method: 'get',
          params: this.$http.adornParams({
            'userId': userId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.questionnaireInfoCount = data.data
          }
        })
      },
      // 初始化头像信息
      initAvatar () {
        const userId = this.$cookie.get('userId');
        this.$http({
          url: this.$http.adornUrl(`/sys/user/info/` + userId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.avatar = multiavatar(data.user.avatar)
          }
        })
      },
      // 切换语言
      updateI18nHandle (type) {
        changeLanguage(type)
        window.localStorage.setItem('locale', type)
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 个人信息
      userInfoHandle () {
        this.userInfoVisible = true
        this.$nextTick(() => {
          this.$refs.userInfo.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(this.$t('message.logout_tip'), this.$t('message.tip'), {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancle'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              clearLoginInfo()
              this.$router.push({ name: 'login' })
            }
          })
        }).catch(() => {})
      },
      // 查询租户信息
      getCompanyInfo() {
        this.$http({
          url: this.$http.adornUrl('/generator/company/getCompanyInfo/'+this.$cookie.get('tenantId')),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            // this.textArr.push(this.$t('platform.company_mail') + ':' + data.company.companyEmail)
            // this.textArr.push(this.$t('platform.company_mobile') + ':' + data.company.companyMobile)
            this.textArr.push(data.company.companyEmail)
            this.textArr.push(data.company.companyMobile)
          }
        })
      }
    }
  }
</script>
<style scoped>
.avtart-block {
  width: 30px;
  height: auto;
  border-radius: 100%;
  vertical-align: middle;
}
</style>
