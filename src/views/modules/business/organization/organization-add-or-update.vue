<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    @close="closeDialog"
    :show-close="false"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item v-if="visibleCompany" :label="$t('login.company')" prop="relatedCompany">
        <el-select v-model="dataForm.parentOrg" :placeholder="$t('login.company')" style="width:100%;" disabled>
          <el-option
            v-for="item in companyOptions"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="visibleDepartment" :label="$t('organization.organization_department')" prop="department" disabled>
        <el-select v-model="dataForm.department" :placeholder="$t('organization.organization_department')" style="width:100%;">
          <el-option
            v-for="item in departmentOptions"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('organization.organization_type')" prop="orgType">
        <el-select v-model="dataForm.orgType" :placeholder="$t('organization.organization_type')" style="width:100%;" disabled>
          <el-option
            v-for="item in orgTypeOptions"
            :key="item.id"
            :label="item.dictName"
            :value="item.dictCode"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('organization.organization_name')" prop="orgName">
        <el-input v-model="dataForm.orgName" :placeholder="$t('organization.organization_name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remark">
        <el-input v-model="dataForm.remark" :placeholder="$t('common.remark')"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel()">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getNowTime } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        visibleCompany: true,
        visibleDepartment: false,
        dataList: [],
        dataForm: {
          uuid: 0,
          orgName: '',
          orgType: '',
          parentOrg: '',
          creater: '',
          createDate: '',
          updater: '',
          updateDate: '',
          remark: '',
          deleteFlag: '0',
          department: ''
        },
        dataRule: {
          orgName: [
            { required: true, message: '组织名称不能为空', trigger: 'blur' }
          ],
          orgType: [
            { required: true, message: '组织类型不能为空', trigger: 'blur' }
          ],
          parentOrg: [
            { required: true, message: '公司名称不能为空', trigger: 'blur' }
          ]
        },
        companyOptions: [],
        departmentOptions: [],
        orgTypeOptions: []
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
      this.initOrgTypeOptions()
    },
    methods: {
      init (uuid) {
        this.dataForm.uuid = uuid || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.uuid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/organization/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.orgName = data.organization.orgName
                this.dataForm.orgType = data.organization.orgType
                this.dataForm.parentOrg = data.organization.parentOrg
                this.dataForm.creater = data.organization.creater
                this.dataForm.createDate = data.organization.createDate
                this.dataForm.updater = data.organization.updater
                this.dataForm.updateDate = data.organization.updateDate
                this.dataForm.remark = data.organization.remark
                this.dataForm.deleteFlag = data.organization.deleteFlag
              }
            })
          }else{
            this.dataForm.creater = this.userName
            this.dataForm.createDate = getNowTime()
            this.dataForm.updater = this.userName
            this.dataForm.updateDate = getNowTime()
            this.dataForm.parentOrg = item.companyName
            this.dataForm.orgType = 'department'
          }
        })
      },
      initChildren(item){
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.creater = this.userName
          this.dataForm.createDate = getNowTime()
          if(item.orgType == 'company'){
            this.dataForm.parentOrg = item.uuid
            this.dataForm.orgType = 'department'
          }else if(item.orgType == 'department'){
            this.visibleDepartment = true
            this.visibleCompany = false
            this.departmentOptions = [{id:item.uuid,value:item.orgName}]
            this.dataForm.department = item.uuid
            this.dataForm.orgName = ''
            this.dataForm.orgType = 'office'
            setTimeout(() =>{
              this.dataForm.parentOrg = item.parentOrg
            },60000);
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/organization/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'orgName': this.dataForm.orgName,
                'orgType': this.dataForm.orgType,
                'parentOrg': this.visibleDepartment?this.dataForm.department:this.dataForm.parentOrg,
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
                    this.visible = false
                    this.visibleDepartment = false
                    this.visibleCompany = true
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
      //取消
      cancel(){
        this.visibleDepartment = false
        this.visibleCompany = true
        this.closeDialog()
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
      // 初始化组织类型
      initOrgTypeOptions () {
        this.$http({
          url: this.$http.adornUrl('/sys/dict/json/data/org'),
          method: 'get',
          data: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.orgTypeOptions = data.data
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
