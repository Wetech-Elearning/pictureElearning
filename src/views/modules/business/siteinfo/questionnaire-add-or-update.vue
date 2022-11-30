<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
    <el-form-item label="" prop="questionnaireName">
      <el-input v-model="dataForm.questionnaireName" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="creater">
      <el-input v-model="dataForm.creater" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="createDate">
      <el-input v-model="dataForm.createDate" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="updater">
      <el-input v-model="dataForm.updater" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="updateDate">
      <el-input v-model="dataForm.updateDate" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="remark">
      <el-input v-model="dataForm.remark" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="deleteFlag">
      <el-input v-model="dataForm.deleteFlag" placeholder=""></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          uuid: 0,
          questionnaireName: '',
          creater: '',
          createDate: '',
          updater: '',
          updateDate: '',
          remark: '',
          deleteFlag: ''
        },
        dataRule: {
          questionnaireName: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          creater: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          createDate: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          updater: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          updateDate: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          deleteFlag: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
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
              url: this.$http.adornUrl(`/generator/questionnaire/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.questionnaireName = data.questionnaire.questionnaireName
                this.dataForm.creater = data.questionnaire.creater
                this.dataForm.createDate = data.questionnaire.createDate
                this.dataForm.updater = data.questionnaire.updater
                this.dataForm.updateDate = data.questionnaire.updateDate
                this.dataForm.remark = data.questionnaire.remark
                this.dataForm.deleteFlag = data.questionnaire.deleteFlag
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/questionnaire/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'questionnaireName': this.dataForm.questionnaireName,
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
