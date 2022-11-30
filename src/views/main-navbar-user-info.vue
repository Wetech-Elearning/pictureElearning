<template>
  <el-dialog
    :title="$t('platform.user_info')"
    :visible.sync="visible"
    :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item :label="$t('userinfo.avatar')" prop="avatar">
        <el-popover
          placement="right-start"
          width="500"
          trigger="click"
          v-model="avatarvisible">
          <ul>
            <li v-for="(item, index) in avatarList">
              <div v-html="item" class="avtart-block" @click="setAvatar(index,item)"></div>
            </li>
          </ul>
          <div v-html="avatar" slot="reference" class="avtart-block" @click="selectAvatar"></div>
        </el-popover>
      </el-form-item>
      <el-form-item :label="$t('userinfo.username')">
        <el-input v-model="dataForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('userinfo.email')" prop="email">
        <el-input v-model="dataForm.email"></el-input>
      </el-form-item>
      <el-form-item :label="$t('userinfo.mobile')" prop="mobile">
        <el-input v-model="dataForm.mobile"></el-input>
      </el-form-item>
      <el-form-item :label="$t('userinfo.status')" prop="status">
        <el-select v-model="dataForm.status" style="width: 100%;">
          <el-option :label="$t('common.normal')" :value="1"></el-option>
          <el-option :label="$t('common.disable')" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('userinfo.introduction')" prop="introduction">
        <el-input type="textarea" v-model="dataForm.introduction"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { clearLoginInfo } from '@/utils'
  import multiavatar from '@multiavatar/multiavatar'
  export default {
    data () {
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          callback(new Error(this.$t('message.confirm_password')))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          username: '',
          avatar: '',
          email: '',
          mobile: '',
          status: 0,
          introduction: ''
        },
        dataRule: {

        },
        avatar: '',
        avatarList: [],
        userId: '',
        avatarvisible: false
      }
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      }
    },
    methods: {
      // 初始化
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$http({
            url: this.$http.adornUrl(`/sys/user/info/${this.$store.state.user.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.username = data.user.username
              this.dataForm.email = data.user.email
              this.dataForm.mobile = data.user.mobile
              this.dataForm.status = data.user.status
              this.dataForm.avatar = data.user.avatar
              this.dataForm.introduction = data.user.introduction
              this.avatar = multiavatar(this.dataForm.avatar)
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/user/changeUserInfo'),
              method: 'post',
              data: this.$http.adornData({
                'username': this.dataForm.username,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                'avatar': this.dataForm.avatar,
                'introduction': this.dataForm.introduction
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: this.$t('message.success'),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 头像选择器
      selectAvatar(){
        this.avatarvisible = true
        this.avatarList = []
        for (let i = 0; i < 28; i++) {
          this.avatarList.push(multiavatar(i))
        }
      },
      // 设置头像
      setAvatar(index,item){
        this.dataForm.avatar = index
        this.avatar = item
        this.avatarvisible = false
      }
    }
  }
</script>
<style scoped>
  img {
    width: 80px;
    height: auto;
    margin-right: 5px;
    border-radius: 100%;
    vertical-align: middle;
  }
  .avtart-block {
    width: 80px;
    height: auto;
    margin-right: 5px;
    border-radius: 100%;
    vertical-align: middle;
  }
  ul li{
    float:left;
    margin-left:10px;
    list-style-type:none;
  }
  ul li  .avtart-block {
    width: 40px;
    height: auto;
    margin-right: 5px;
    border-radius: 100%;
    vertical-align: middle;
  }
</style>

