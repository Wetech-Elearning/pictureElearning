<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item :label="$t('student.student_surname')" prop="surname">
        <el-input v-model="dataForm.surname" :placeholder="$t('student.student_surname')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('student.student_name')" prop="userName">
        <el-input v-model="dataForm.userName" :placeholder="$t('student.student_name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('platform.account')" prop="account">
        <el-input v-model="dataForm.account" :placeholder="$t('platform.account')" :disabled="!dataForm.uuid ? false : true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('student.student_mobile')" prop="userMobile">
        <el-input v-model="dataForm.userMobile" :placeholder="$t('student.student_mobile')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('student.student_email')" prop="userEmail">
        <el-input v-model="dataForm.userEmail" :placeholder="$t('student.student_email')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('student.student_related_company')" prop="relatedCompany">
        <el-select v-model="dataForm.relatedCompany" :placeholder="$t('student.student_related_company')" @change="companyChange" style="width:100%;">
          <el-option
            v-for="item in companyOptions"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('student.student_related_department')" prop="relatedDepartment">
        <el-select v-model="dataForm.relatedDepartment" :placeholder="$t('student.student_related_department')" @change="departmentChange" style="width:100%;">
          <el-option
            v-for="item in departmentOptions"
            :key="item.uuid"
            :label="item.orgName"
            :value="item.uuid"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('student.student_related_office')" prop="relatedOffice">
        <el-select v-model="dataForm.relatedOffice" :placeholder="$t('student.student_related_office')" style="width:100%;">
          <el-option
            v-for="item in officeOptions"
            :key="item.uuid"
            :label="item.orgName"
            :value="item.uuid"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('student.student_employment_time')" prop="employmentTime">
        <el-input type="number" v-model="dataForm.employmentTime" :placeholder="$t('student.student_employment_time')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('student.student_subjects')" prop="subjects">
        <el-input v-model="dataForm.subjects" :placeholder="$t('student.student_subjects')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('student.student_sex')" prop="sex">
        <el-select v-model="dataForm.sex" :placeholder="$t('student.student_sex')" style="width:100%;">
          <el-option :label="$t('common.man')" value="0"></el-option>
          <el-option :label="$t('common.woman')" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('student.student_age')" prop="age">
        <el-input type="number" min="1" max="100" v-model="dataForm.age" :placeholder="$t('student.student_age')"></el-input>
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
  import { isEmail, ageCheck, isMobileNumber } from '@/utils/validate'
  import { getNowTime } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          uuid: 0,
          userName: '',
          surname: '',
          account: '',
          userMobile: '',
          userEmail: '',
          relatedCompany: '',
          relatedDepartment: '',
          relatedOffice: '',
          employmentTime: '',
          subjects: '',
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
          userName: [
            { required: true, message: '名字不能为空', trigger: 'blur' }
          ],
          surname: [
            { required: true, message: '姓氏不能为空', trigger: 'blur' }
          ],
          account: [
            { required: true, message: '登录账户不能为空', trigger: 'blur' }
          ],
          userEmail: [
            { required: true, message: '学员邮箱不能为空', trigger: 'blur' },
            { validator: isEmail, trigger: 'blur'}
          ],
          userMobile: [
            { required: true, message: '学员手机号不能为空', trigger: 'blur' },
            { validator: isMobileNumber, trigger: 'blur'}
          ],
          relatedCompany: [
            { required: true, message: '归属企业不能为空', trigger: 'blur' }
          ],
          relatedDepartment: [
            { required: true, message: '归属部门不能为空', trigger: 'blur' }
          ],
          relatedOffice: [
            { required: true, message: '归属科室不能为空', trigger: 'blur' }
          ],
          age: [
            { required: true, message: '年龄不能为空', trigger: 'blur' },
            { validator: ageCheck, trigger: 'blur'}
          ]
        },
        companyOptions: [],
        departmentOptions: [],
        officeOptions: []
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
              url: this.$http.adornUrl(`/generator/student/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.student.userName
                this.dataForm.surname = data.student.surname
                this.dataForm.account = data.student.account
                this.dataForm.userMobile = data.student.userMobile
                this.dataForm.userEmail = data.student.userEmail
                this.dataForm.relatedCompany = String(data.student.relatedCompany)
                this.dataForm.relatedDepartment = String(data.student.relatedDepartment)
                this.dataForm.relatedOffice = data.student.relatedOffice
                this.dataForm.sex = data.student.sex
                this.dataForm.employmentTime = data.student.employmentTime
                this.dataForm.subjects = data.student.subjects
                this.dataForm.age = data.student.age
                this.dataForm.creater = data.student.creater
                this.dataForm.createDate = data.student.createDate
                this.dataForm.updater = data.student.updater
                this.dataForm.updateDate = data.student.updateDate
                this.dataForm.remark = data.student.remark
                this.dataForm.deleteFlag = data.student.deleteFlag
                this.initCompanyOptions()
              }
            })
          } else {
            this.dataForm.creater = this.userName
            this.dataForm.createDate = getNowTime()
            this.dataForm.updater = this.userName
            this.dataForm.updateDate = getNowTime()
            this.initCompanyOptions()
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/student/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'userName': this.dataForm.userName,
                'surname': this.dataForm.surname,
                'account': this.dataForm.account,
                'userMobile': this.dataForm.userMobile,
                'userEmail': this.dataForm.userEmail,
                'relatedCompany': this.dataForm.relatedCompany,
                'relatedDepartment': this.dataForm.relatedDepartment,
                'relatedOffice': this.dataForm.relatedOffice,
                'employmentTime': this.dataForm.employmentTime,
                'subjects': this.dataForm.subjects,
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
      // 初始化所属企业
      initCompanyOptions () {
        this.$http({
          url: this.$http.adornUrl('/generator/company/getByUserId/' + this.userId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.companyOptions = [data.company]
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 所选公司变化
      companyChange (value) {
        this.dataForm.relatedDepartment = ''
        this.dataForm.relatedOffice = ''
        this.initOrgOptions('department', value)
      },
      // 所选部门变化
      departmentChange (value) {
        this.dataForm.relatedOffice = ''
        this.initOrgOptions('office', value)
      },
      // 初始化所属部门和科室
      initOrgOptions (type, id) {
        this.$http({
          url: this.$http.adornUrl('/generator/organization/getByParentOrgId/' + id),
          method: 'get',
          data: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            if ('department' == type) {
              this.departmentOptions = data.data
            } else {
              this.officeOptions = data.data
            }
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
