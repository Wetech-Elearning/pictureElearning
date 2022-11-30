<template>
  <div class="mod-register">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item prop="company" :label="$t('register.company')">
        <el-select v-model="ruleForm.companyName" disabled :placeholder="$t('register.company')" style="width:100%;">
          <el-option
            v-for="item in companyOptions"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="surname" :label="$t('register.surname')">
        <el-input v-model="ruleForm.surname" :placeholder="$t('register.surname')"></el-input>
      </el-form-item>
      <el-form-item prop="username" :label="$t('register.username')">
        <el-input v-model="ruleForm.username" :placeholder="$t('register.username')"></el-input>
      </el-form-item>
      <el-form-item prop="account" :label="$t('register.account')">
        <el-input v-model="ruleForm.account" :placeholder="$t('register.account')"></el-input>
      </el-form-item>
      <el-form-item prop="password" :label="$t('register.password')">
        <el-input v-model="ruleForm.password" type="password" :placeholder="$t('register.password')"></el-input>
      </el-form-item>
      <el-form-item prop="comfirmPassword" :label="$t('register.confirm_password')">
        <el-input v-model="ruleForm.comfirmPassword" type="password" :placeholder="$t('register.confirm_password')"></el-input>
      </el-form-item>
      <el-form-item prop="email" :label="$t('register.mail')">
        <el-input v-model="ruleForm.email" :placeholder="$t('register.mail')"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" :label="$t('register.mobile')">
        <el-input v-model="ruleForm.mobile" :placeholder="$t('register.mobile')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('student.student_sex')" prop="sex">
        <el-select v-model="ruleForm.sex" :placeholder="$t('student.student_sex')" style="width:100%;">
          <el-option :label="$t('common.man')" value="0"></el-option>
          <el-option :label="$t('common.woman')" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="captcha" :label="$t('register.verificationCode')">
        <el-row :gutter="20">
            <el-col :span="10">
                <el-input v-model="ruleForm.captcha" :placeholder="$t('register.verificationCode')">
                </el-input>
            </el-col>
            <el-col :span="10" class="login-captcha">
                <img :src="captchaPath" @click="getCaptcha()" alt="">
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button class='register-btn' type="primary" @click="submitForm('ruleForm')">{{$t('register.register')}}</el-button>
        <el-button class='register-btn' @click="resetForm('ruleForm')">{{$t('register.reset')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getUUID } from '@/utils'
  import { isMobileNumber, isEmail } from '@/utils/validate'
  export default {
    data () {
      const confirm2Password = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          surname: '',
          username: '',
          account: '',
          password: '',
          comfirmPassword: '',
          company: '',
          companyName: '',
          email: '',
          mobile: '',
          uuid: '',
          sex: '0',
          captcha: '',
          department: '',
          office: ''
        },
        rules: {
          surname: [
            { required: true, message: '姓氏不能为空', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          account: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          comfirmPassword: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: confirm2Password, trigger: 'blur'}
          ],
          companyName: [
            { required: true, message: '所属公司不能为空', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: isEmail, trigger: 'blur'}
          ],
          captcha: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        captchaPath: '',
        companyOptions: []
      };
    },
    created () {
      this.ruleForm.company = this.$route.query.uuid
      this.ruleForm.companyName = this.$route.query.company
      this.ruleForm.department = this.$route.query.department
      this.ruleForm.office = this.$route.query.office
      this.getCaptcha()
      this.initCompanyOptions()
    },
    methods: {
      // 初始化所属企业
      initCompanyOptions () {
        this.$http({
          url: this.$http.adornUrl('/generator/company/initCompanyOptions'),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.companyOptions = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/register'),
              method: 'post',
              data: this.$http.adornData({
                'surname': this.ruleForm.surname,
                'username': this.ruleForm.username,
                'account': this.ruleForm.account,
                'password': this.ruleForm.password,
                'uuid': this.ruleForm.uuid,
                'captcha': this.ruleForm.captcha,
                'company': this.ruleForm.companyName,
                'tenantId': this.ruleForm.company,
                'mobile': this.ruleForm.mobile,
                'email': this.ruleForm.email,
                'department': this.ruleForm.department,
                'office': this.ruleForm.office,
                'sex': this.ruleForm.sex
              })


            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message.info('请登录邮箱，点击邮件里的链接进行激活')
                setTimeout(this.$router.replace({ name: 'login' }),3000)
                this.$router.replace({ name: 'login' })
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          } else {
            return false;
          }
        });
      },
      //重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 获取验证码
      getCaptcha () {
        this.ruleForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.ruleForm.uuid}`)
      }
    }
  }
</script>

<style>
  .mod-register {
    line-height: 1.5;
    width: 800px;
    margin: 30px auto;
  }
  .register-btn {
      width: 300px;
  }
</style>

