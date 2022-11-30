<template>
  <el-dialog
    :title="!dataForm.uuid ? '新增' : '修改'"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item :label="$t('siteinfo.send_people')" prop="sendUserId">
        <el-select v-model="dataForm.sendUserId" :placeholder="$t('siteinfo.send_people')" style="width:100%;">
          <el-option :label="userName" :value="userId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('siteinfo.send_content')" prop="content">
        <el-input v-model="dataForm.content" :placeholder="$t('siteinfo.send_content')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('siteinfo.is_send_all_conpany')" prop="isAllCompany">
        <el-radio v-model="dataForm.isAllCompany" label="1">{{ $t('common.no') }}</el-radio>
        <el-radio v-model="dataForm.isAllCompany" label="0">{{ $t('common.yes') }}</el-radio>
      </el-form-item>
      <el-form-item v-if="dataForm.isAllCompany === '1'" :label="$t('siteinfo.accept_people_type')" prop="type">
        <el-select v-model="dataForm.type" :placeholder="$t('siteinfo.accept_people_type')" style="width:100%;" @change="typeChange">
          <el-option :label="$t('platform.lecturer')" value="1"></el-option>
          <el-option :label="$t('platform.student')" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.isAllCompany === '1'" :label="$t('siteinfo.accept_people')" prop="acceptUserId">
        <el-popover
          ref="popover"
          width="630"
          offset="0"
          trigger="focus">
          <div>
            <el-table :data="acceptUsers"
                      border
                      :show-header="false"
                      v-loading="loading"
                      @selection-change="selectionChangeHandle">
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                prop="userName"
                header-align="center"
                align="center"
                :label="$t('siteinfo.accept_people')">
              </el-table-column>
            </el-table>
          </div>
        </el-popover>
        <el-input v-model="acceptUsersSelections" v-popover:popover @focus="focusHandle"></el-input>
      </el-form-item>
      <!--<el-form-item label="发信时间" prop="sendDate">
        <el-date-picker
          style="width:100%;"
          v-model="dataForm.sendDate"
          type="datetime"
          placeholder="发信时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          default-time="12:00:00">
        </el-date-picker>
      </el-form-item>-->
    <!--<el-form-item label="失效时间" prop="invalidDate">
      <el-date-picker
        style="width:100%;"
        v-model="dataForm.invalidDate"
        type="datetime"
        placeholder="失效时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        default-time="12:00:00">
      </el-date-picker>
    </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">{{$t('button.cancle')}}</el-button>
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
        acceptUsersSelections:'',
        dataForm: {
          uuid: 0,
          sendUserId: '',
          content: '',
          type: '',
          acceptUserId: '',
          sendDate: '',
          invalidDate: '',
          isAllCompany: '1',
          deleteFlag: 0
        },
        dataRule: {
          sendUserId: [
            { required: true, message: '发信人不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '发信内容不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '收信人类型不能为空', trigger: 'blur' }
          ],
          sendDate: [
            { required: true, message: '发信时间不能为空', trigger: 'blur' }
          ],
          invalidDate: [
            { required: true, message: '失效时间不能为空', trigger: 'blur' }
          ]
        },
        acceptUsers: [],
        loading: false
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
              url: this.$http.adornUrl(`/generator/siteinfo/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.sendUserId = data.siteInfo.sendUserId
                this.dataForm.content = data.siteInfo.content
                this.dataForm.isAllCompany = String(data.siteInfo.isAllCompany)
                this.dataForm.type = String(data.siteInfo.type)
                this.dataForm.acceptUserId = String(data.siteInfo.acceptUserId)
                this.dataForm.sendDate = data.siteInfo.sendDate
                this.dataForm.invalidDate = data.siteInfo.invalidDate
                this.dataForm.deleteFlag = data.siteInfo.deleteFlag
              }
            })
          }else{
            this.dataForm.sendUserId = this.userId
            this.dataForm.sendDate = getNowTime()
          }
        })
      },
      focusHandle(){
        this.initacceptUsers()
      },
      // 多选
      selectionChangeHandle (val) {
        this.acceptUsersSelections = []
        this.dataForm.acceptUserId = ''
        if(val.length > 0){
          val.forEach((item)=>{
            this.acceptUsersSelections += item.userName + ';'
            this.dataForm.acceptUserId += item.uuid + ','

          })
        }
        console.log('this.val',val)

      },
      //收信人类型改变事件
      typeChange() {
        this.acceptUsers = []
      },
      //初始化收信人
      initacceptUsers (userName) {
        if(this.dataForm.type == 1){
          this.queryLecturer(userName)
        }else{
          this.queryStudent(userName)
        }
      },
      //{{$t('button.search')}}讲师
      queryLecturer (userName) {
        if (userName !== '') {
          this.loading = true;
          this.$http({
            url: this.$http.adornUrl(`/generator/lecturer/listAll`),
            method: 'get',
            params: this.$http.adornParams({
              'lecturerName': userName
            })
          }).then(({data}) => {
            this.loading = false
            if (data && data.code === 0) {
              if(data.data.length > 0){
                this.acceptUsers = data.data.map((item) => {
                  return {
                    uuid: item.uuid,
                    userName: item.surname + item.lecturerName
                  };
                })
              }
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.acceptUsers = []
        }
      },
      //初始化收信人
      queryStudent (userName) {
        if (userName !== '') {
          this.loading = true;
          this.$http({
            url: this.$http.adornUrl(`/generator/student/listAll`),
            method: 'get',
            params: this.$http.adornParams({
              'studentName': userName
            })
          }).then(({data}) => {
            this.loading = false
            if (data && data.code === 0) {
              if(data.data.length > 0){
                this.acceptUsers = data.data.map((item) => {
                  return {
                    uuid: item.uuid,
                    userName: item.surname + item.userName
                  };
                })
              }
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.options = [];
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.dataForm.isAllCompany == 1 && this.dataForm.acceptUserId === ''){
              this.$message.error(this.$t('siteinfo.accept_user'))
              return
            }
            this.$http({
              url: this.$http.adornUrl(`/generator/siteinfo/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'sendUserId': this.dataForm.sendUserId,
                'content': this.dataForm.content,
                'isAllCompany': this.dataForm.isAllCompany,
                'type': this.dataForm.type,
                'acceptUserId': this.dataForm.acceptUserId,
                'sendDate': this.dataForm.sendDate,
                'invalidDate': this.dataForm.invalidDate,
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
                    this.$refs['dataForm'].resetFields()
                    this.dataForm.type = ''
                    this.acceptUsers = []
                    this.acceptUsersSelections = []
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
<style>
.el-popover{
  height: 150px;
  overflow: auto;
}
</style>
