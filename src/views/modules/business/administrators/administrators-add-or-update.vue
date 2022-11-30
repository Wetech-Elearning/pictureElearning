<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    v-if="visible"
    @close="closeDialog"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"label-width="80px">
      <el-form-item :label="$t('administrators.surname')" prop="surname">
        <el-input v-model="dataForm.surname" :placeholder="$t('administrators.surname')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('administrators.name')" prop="userName">
        <el-input v-model="dataForm.userName" :placeholder="$t('administrators.name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('administrators.login_account')" prop="account">
        <el-input v-model="dataForm.account" :placeholder="$t('administrators.login_account')" :disabled="!dataForm.uuid ? false : true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('administrators.mobile')" prop="userMobile">
        <el-input v-model="dataForm.userMobile" :placeholder="$t('administrators.mobile')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('administrators.mail')" prop="userEmail">
        <el-input v-model="dataForm.userEmail" :placeholder="$t('administrators.mail')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('administrators.related_company')" prop="relatedCompany">
        <el-select v-model="dataForm.relatedCompany" :placeholder="$t('administrators.related_company')" style="width:100%;">
          <el-option
            v-for="item in companyOptions"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('administrators.sex')" prop="sex">
        <el-select v-model="dataForm.sex" :placeholder="$t('administrators.sex')" style="width:100%;">
          <el-option :label="$t('common.man')" value="0"></el-option>
          <el-option :label="$t('common.woman')" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('administrators.age')" prop="age">
        <el-input v-model="dataForm.age" :placeholder="$t('administrators.age')" type="number"></el-input>
      </el-form-item>
      <el-form-item :label="$t('administrators.remark')" prop="remark">
        <el-input v-model="dataForm.remark" :placeholder="$t('administrators.remark')"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isEmail } from '@/utils/validate'
  import { getNowTime } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          uuid: 0,
          userName: '',
          surname: '',
          account : '',
          userMobile: '',
          userEmail: '',
          relatedCompany: '',
          sex: '0',
          age: '',
          creater: '',
          createDate: '',
          updater: '',
          updateDate: '',
          remark: '',
          deleteFlag: '0'
        },
        dataRule: {
          surname: [
            { required: true, message: this.$t('administrators.not_null_surname'), trigger: 'blur' }
          ],
          userName: [
            { required: true, message: this.$t('administrators.not_null_name'), trigger: 'blur' }
          ],
          account: [
            { required: true, message: this.$t('administrators.not_null_account'), trigger: 'blur' }
          ],
          userEmail: [
            { required: true, message: this.$t('administrators.not_null_mail'), trigger: 'blur' },
            { validator: isEmail, trigger: 'blur'}
          ],
          relatedCompany: [
            { required: true, message: this.$t('administrators.not_null_company'), trigger: 'blur' }
          ]
        },
        companyOptions: []
      }
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      },
      userId: {
        get () { return this.$store.state.user.id }
      }
    },
    created () {
      this.initCompanyOptions()
    },
    methods: {
      init (id) {
        this.dataForm.uuid = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.uuid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/administrators/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.surname = data.administrators.surname
                this.dataForm.userName = data.administrators.userName
                this.dataForm.account = data.administrators.account
                this.dataForm.userMobile = data.administrators.userMobile
                this.dataForm.userEmail = data.administrators.userEmail
                this.dataForm.relatedCompany = data.administrators.relatedCompany
                this.dataForm.sex = data.administrators.sex
                this.dataForm.age = data.administrators.age
                this.dataForm.creater = data.administrators.creater
                this.dataForm.createDate = data.administrators.createDate
                this.dataForm.updater = data.administrators.updater
                this.dataForm.updateDate = data.administrators.updateDate
                this.dataForm.remark = data.administrators.remark
                this.dataForm.deleteFlag = data.administrators.deleteFlag
              }
            })
          }else{
            this.dataForm.creater = this.userName
            this.dataForm.createDate = getNowTime()
            this.dataForm.updater = this.userName
            this.dataForm.updateDate = getNowTime()
          }
        })
      },
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/administrators/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'surname': this.dataForm.surname,
                'userName': this.dataForm.userName,
                'account': this.dataForm.account,
                'userMobile': this.dataForm.userMobile,
                'userEmail': this.dataForm.userEmail,
                'relatedCompany': this.dataForm.relatedCompany,
                'sex': this.dataForm.sex,
                'age': this.dataForm.age,
                'creater': this.dataForm.creater,
                'createDate': this.dataForm.createDate,
                'updater': this.dataForm.updater,
                'updateDate': this.dataForm.updateDate,
                'remark': this.dataForm.remark,
                'deleteFlag': this.dataForm.deleteFlag
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: this.$t('message.success'),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.closeDialog()
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
      // 关闭Dialog
      closeDialog () {
        this.$refs['dataForm'].resetFields()
        this.visible = false
      }
    }
  }
</script>
