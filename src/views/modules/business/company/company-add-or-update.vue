<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
    <el-form-item :label="$t('common.name')" prop="companyName">
      <el-input v-model="dataForm.companyName" :placeholder="$t('company.company_name')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('company.company_introduction')" prop="companyIntroduction">
      <el-input v-model="dataForm.companyIntroduction" :placeholder="$t('company.company_introduction')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('company.company_contact')" prop="companyContact">
      <el-input v-model="dataForm.companyContact" :placeholder="$t('company.company_contact')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('company.company_email')" prop="companyEmail">
      <el-input v-model="dataForm.companyEmail" :placeholder="$t('company.company_email')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('company.company_address')" prop="companyLocation">
      <el-input v-model="dataForm.companyLocation" :placeholder="$t('company.company_address')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('company.company_nature')" prop="companyNature">
      <el-select v-model="dataForm.companyNature" :placeholder="$t('company.company_nature')" style="width:100%;">
        <el-option
          v-for="item in natureOptions"
          :key="item.dictCode"
          :label="item.dictName"
          :value="item.dictCode"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('company.company_legal_person')" prop="companyLegalPerson">
      <el-input v-model="dataForm.companyLegalPerson" :placeholder="$t('company.company_legal_person')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('company.company_mobile')" prop="companyMobile">
      <el-input v-model="dataForm.companyMobile" :placeholder="$t('company.company_mobile')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common.status')" prop="status">
      <el-select v-model="dataForm.status" :placeholder="$t('common.status')" style="width:100%;">
        <el-option label="禁用" value="0"></el-option>
        <el-option label="正常" value="1"></el-option>
      </el-select>
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
          companyName: '',
          companyIntroduction: '',
          companyContact: '',
          companyEmail: '',
          companyLocation: '',
          companyNature: '',
          companyLegalPerson: '',
          companyMobile: '',
          createDate: '',
          updateDate: '',
          creater: '',
          updater: '',
          status: '',
          deleteFlag: '0',
          remark: ''
        },
        dataRule: {
          companyName: [
            { required: true, message: this.$t('company.not_null_company_name'), trigger: 'blur' },
            { max: 50, message: this.$t('company.max_company_name'), trigger: 'blur' }
          ],
          companyIntroduction: [
            { required: true, message: this.$t('company.not_null_company_introduction'), trigger: 'blur' }
          ],
          companyContact: [
            { required: true, message: this.$t('company.not_null_company_contact'), trigger: 'blur' }
          ],
          companyEmail: [
            { required: true, message: this.$t('company.not_null_company_email'), trigger: 'blur' },
            { validator: isEmail, trigger: 'blur'}
          ],
          companyLocation: [
            { required: true, message: this.$t('company.not_null_company_location'), trigger: 'blur' }
          ],
          companyNature: [
            { required: true, message: this.$t('company.not_null_company_nature'), trigger: 'blur' }
          ],
          status: [
            { required: true, message: this.$t('company.not_null_company_status'), trigger: 'blur' }
          ]
        },
        natureOptions: []
      }
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      },
      userId: {
        get () { return this.$store.state.user.relateUserId }
      }
    },
    created () {
      this.initNatureOptions()
    },
    methods: {
      init (id) {
        this.dataForm.uuid = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.uuid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/company/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.companyName = data.company.companyName
                this.dataForm.companyIntroduction = data.company.companyIntroduction
                this.dataForm.companyContact = data.company.companyContact
                this.dataForm.companyEmail = data.company.companyEmail
                this.dataForm.companyLocation = data.company.companyLocation
                this.dataForm.companyNature = data.company.companyNature
                this.dataForm.companyLegalPerson = data.company.companyLegalPerson
                this.dataForm.companyMobile = data.company.companyMobile
                this.dataForm.createDate = data.company.createDate
                this.dataForm.updateDate = data.company.updateDate
                this.dataForm.creater = data.company.creater
                this.dataForm.updater = data.company.updater
                this.dataForm.status = String(data.company.status)
                this.dataForm.deleteFlag = data.company.deleteFlag
                this.dataForm.remark = data.company.remark
              }
            })
          } else {
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
              url: this.$http.adornUrl(`/generator/company/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'companyName': this.dataForm.companyName,
                'companyIntroduction': this.dataForm.companyIntroduction,
                'companyContact': this.dataForm.companyContact,
                'companyEmail': this.dataForm.companyEmail,
                'companyLocation': this.dataForm.companyLocation,
                'companyNature': this.dataForm.companyNature,
                'companyLegalPerson': this.dataForm.companyLegalPerson,
                'companyMobile': this.dataForm.companyMobile,
                'createDate': this.dataForm.createDate,
                'updateDate': this.dataForm.updateDate,
                'creater': this.dataForm.creater,
                'updater': this.dataForm.updater,
                'status': this.dataForm.status,
                'deleteFlag': this.dataForm.deleteFlag,
                'remark': this.dataForm.remark
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
      // 初始化企业性质
      initNatureOptions () {
        this.$http({
          url: this.$http.adornUrl('/sys/dict/json/data/companyNature'),
          method: 'get',
          data: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.natureOptions = data.data
          } else {
            this.$message.error(data.msg)
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
