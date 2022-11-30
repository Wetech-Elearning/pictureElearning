<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text"></h2>
          <p class="brand-info__intro"></p>
        </div>
        <div class="login-main">
          <h3 class="login-title">{{$t('login.login')}}</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" status-icon>
            <el-form-item prop="account">
              <el-input v-model="dataForm.account" :placeholder="$t('login.account')"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" :placeholder="$t('login.password')"></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" :placeholder="$t('login.verificationCode')">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="lang">
              <el-select v-model="dataForm.lang" @change="updateI18nHandle">
                <el-option :label="$t('platform.chinese')" value="zh"></el-option>
                <el-option :label="$t('platform.japanese')" value="ja"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-row>
                <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">{{$t('login.login')}}</el-button>
                <a @click="forgetPassword">{{$t('platform.forget_password')}}</a>
<!--                <el-button class="login-btn-submit" type="success" @click="register()">{{$t('login.register')}}</el-button>-->
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog v-if="visible" :visible.sync="visible">
      <el-form v-model="sendMailForm" ref="sendMailForm">
        <el-form-item prop="account" :label="$t('login.account')">
          <el-input v-model="sendMailForm.account" :placeholder="$t('login.account')"></el-input>
        </el-form-item>
        <el-form-item prop="mail" :label="$t('login.mail')">
          <el-input v-model="sendMailForm.mail" :placeholder="$t('login.mail')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class='register-btn' type="primary" @click="sendResetPassword('sendMailForm')">发送邮件</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { getUUID } from '@/utils'
  import { changeLanguage } from '@/i18n/index.js'
  export default {
    data () {
      return {
        visible: false,
        sendMailForm:{
          account: '',
          mail: ''
        },
        dataForm: {
          company: '',
          account: '',
          userName: '',
          password: '',
          uuid: '',
          captcha: '',
          lang: 'zh'
        },
        dataRule: {
          account: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        captchaPath: '',
        companyOptions: []
      }
    },
    created () {
      this.getCaptcha()
    },
    methods: {
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/login'),
              method: 'post',
              data: this.$http.adornData({
                'account': this.dataForm.account,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$cookie.set('token', data.token)
                this.$cookie.set('tenantId', data.tenantId)
                this.$cookie.set('roles', data.roles)
                this.$cookie.set('userId', data.userId)
                this.$router.replace({ name: 'shouye' })
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      },
      // 注册
      register () {
        this.$router.push('/register')
      },
      // 忘记密码
      forgetPassword(){
        this.visible = true
      },

      // 发送重置密码邮件
      sendResetPassword() {
        if(this.sendMailForm.account == ''){
          this.$message.error('账号不能为空')
          return
        }
        if(this.sendMailForm.mail == ''){
          this.$message.error('邮箱不能为空')
          return
        }
        this.$http({
          url: this.$http.adornUrl('/sys/sendResetPassword'),
          method: 'post',
          data: this.$http.adornData({
            'account': this.sendMailForm.account,
            'mail': this.sendMailForm.mail
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('发送成功,密码已重置')
            this.sendMailForm = {}
            this.visible = false
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 切换语言
      updateI18nHandle (type) {
        alert(type)
        changeLanguage(type)
        window.localStorage.setItem('locale', type)
      },
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/login_bg.jpg);
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      position: absolute;
      top: 0;
      right: 0;
      padding: 150px 60px 180px;
      width: 470px;
      min-height: 100%;
      background-color: #fff;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
  }
</style>
