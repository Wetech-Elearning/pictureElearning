<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
    <el-form-item :label="$t('classes.classes_name')" prop="className">
      <el-input v-model="dataForm.className" :placeholder="$t('classes.classes_name')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('common.start_date')" prop="startDate">
      <el-date-picker
        v-model="dataForm.endDate"
        type="datetime"
        placeholder="选择日期时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item :label="$t('common.end_date')" prop="endDate">
      <el-date-picker
        style="width:100%;"
        v-model="dataForm.endDate"
        type="datetime"
        :placeholder="$t('common.end_date')"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
    </el-form-item>
    <el-form-item :label="$t('common.status')" prop="status">
      <el-select v-model="dataForm.status" :placeholder="$t('common.status')" style="width:100%;">
        <el-option :label="$t('classes.used')" value="0"></el-option>
        <el-option :label="$t('classes.disable')" value="1"></el-option>
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
  import { getNowTime } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          uuid: 0,
          className: '',
          startDate: '',
          endDate: '',
          status: '0',
          creater: '',
          createDate: '',
          updater: '',
          updateDate: '',
          remark: '',
          deleteFlag: '0'
        },
        dataRule: {
          className: [
            { required: true, message: this.$t('classes.not_null_name'), trigger: 'blur' }
          ],
          startDate: [
            { required: true, message: this.$t('classes.not_null_start_time'), trigger: 'blur' }
          ],
          endDate: [
            { required: true, message: this.$t('classes.not_null_end_time'), trigger: 'blur' }
          ],
          status: [
            { required: true, message: this.$t('classes.not_null_status'), trigger: 'blur' }
          ]
        }
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
    methods: {
      init (id) {
        this.dataForm.uuid = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.uuid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/classes/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.className = data.classes.className
                this.dataForm.startDate = data.classes.startDate
                this.dataForm.endDate = data.classes.endDate
                this.dataForm.status = string(data.classes.status)
                this.dataForm.creater = data.classes.creater
                this.dataForm.createDate = data.classes.createDate
                this.dataForm.updater = data.classes.updater
                this.dataForm.updateDate = data.classes.updateDate
                this.dataForm.remark = data.classes.remark
                this.dataForm.deleteFlag = data.classes.deleteFlag
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
              url: this.$http.adornUrl(`/generator/classes/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'className': this.dataForm.className,
                'startDate': this.dataForm.startDate,
                'endDate': this.dataForm.endDate,
                'status': this.dataForm.status,
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
