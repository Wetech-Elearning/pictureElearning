<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px" >
      <el-form-item :label="$t('lecturer.lecturer_surname')" prop="surname">
        <el-input v-model="dataForm.surname" :placeholder="$t('lecturer.lecturer_surname')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('lecturer.lecturer_name')" prop="lecturerName">
        <el-input v-model="dataForm.lecturerName" :placeholder="$t('lecturer.lecturer_name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('platform.account')" prop="account">
        <el-input v-model="dataForm.account" :placeholder="$t('platform.account')" :disabled="!dataForm.uuid ? false : true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('lecturer.lecturer_mobile')" prop="lecturerMobile">
        <el-input v-model="dataForm.lecturerMobile" :placeholder="$t('lecturer.lecturer_mobile')"></el-input>
      </el-form-item>
        <el-form-item :label="$t('lecturer.lecturer_mail')" prop="lecturerEmail">
          <el-input v-model="dataForm.lecturerEmail" :placeholder="$t('lecturer.lecturer_mail')"></el-input>
        </el-form-item>
      <el-form-item :label="$t('lecturer.lecturer_introduction')" prop="lecturerIntroduction">
        <el-input v-model="dataForm.lecturerIntroduction" :placeholder="$t('lecturer.lecturer_introduction')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('lecturer.lecturer_sex')" prop="sex">
        <el-select v-model="dataForm.sex" :placeholder="$t('lecturer.lecturer_sex')" style="width:100%;">
          <el-option :label="$t('common.man')" value="0"></el-option>
          <el-option :label="$t('common.woman')" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('lecturer.lecturer_age')" prop="age">
        <el-input v-model="dataForm.age" :placeholder="$t('lecturer.lecturer_age')" type="number"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remark">
        <el-input v-model="dataForm.remark" :placeholder="$t('common.remark')"></el-input>
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
          surname: '',
          lecturerName: '',
          account: '',
          lecturerMobile: '',
          lecturerEmail:'',
          lecturerIntroduction: '',
          lecturerCertificate: '',
          lecturerBook: '',
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
            { required: true, message: '姓氏不能为空', trigger: 'blur' }
          ],
          lecturerName: [
            { required: true, message: '名字不能为空', trigger: 'blur' }
          ],
          account: [
            { required: true, message: '登录账户不能为空', trigger: 'blur' }
          ],
          lecturerEmail: [
            { required: true, message: '讲师的邮箱不能为空', trigger: 'blur' },
            { validator: isEmail, trigger: 'blur'}
          ]
        }
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
    methods: {
      init (id) {
        this.dataForm.uuid = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.uuid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/lecturer/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.surname = data.lecturer.surname
                this.dataForm.lecturerName = data.lecturer.lecturerName
                this.dataForm.account = data.lecturer.account
                this.dataForm.lecturerMobile = data.lecturer.lecturerMobile
                this.dataForm.lecturerEmail = data.lecturer.lecturerEmail
                this.dataForm.lecturerIntroduction = data.lecturer.lecturerIntroduction
            /*    this.dataForm.lecturerCertificate = data.lecturer.lecturerCertificate
                this.dataForm.lecturerBook = data.lecturer.lecturerBook*/
                this.dataForm.sex = data.lecturer.sex
                this.dataForm.age = data.lecturer.age
                this.dataForm.creater = data.lecturer.creater
                this.dataForm.createDate = data.lecturer.createDate
                this.dataForm.updater = data.lecturer.updater
                this.dataForm.updateDate = data.lecturer.updateDate
                this.dataForm.remark = data.lecturer.remark
                this.dataForm.deleteFlag = data.lecturer.deleteFlag
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/lecturer/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'surname': this.dataForm.surname,
                'lecturerName': this.dataForm.lecturerName,
                'account': this.dataForm.account,
                'lecturerMobile': this.dataForm.lecturerMobile,
                'lecturerEmail': this.dataForm.lecturerEmail,
                'lecturerIntroduction': this.dataForm.lecturerIntroduction,
                /*'lecturerCertificate': this.dataForm.lecturerCertificate,
                'lecturerBook': this.dataForm.lecturerBook,*/
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
