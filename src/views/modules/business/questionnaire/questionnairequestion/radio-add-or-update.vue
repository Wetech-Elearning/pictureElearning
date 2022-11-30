<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item :label="$t('questionnaire.questionnaire_content')" prop="question">
        <el-input v-model="dataForm.question" :placeholder="$t('questionnaire.questionnaire_content')"></el-input>
      </el-form-item>
      <el-form-item label="选项A" prop="answerA">
        <el-input v-model="dataForm.answerA" placeholder="选项A"></el-input>
      </el-form-item>
      <el-form-item label="选项B" prop="answerB">
        <el-input v-model="dataForm.answerB" placeholder="选项B"></el-input>
      </el-form-item>
      <el-form-item label="选项C" prop="answerC">
        <el-input v-model="dataForm.answerC" placeholder="选项C"></el-input>
      </el-form-item>
      <el-form-item label="选项D" prop="answerD">
        <el-input v-model="dataForm.answerD" placeholder="选项D"></el-input>
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
          questionType:'radio',
          question: '',
          answerA: '',
          answerB: '',
          answerC: '',
          answerD: '',
          creater: '',
          createDate: '',
          updater: '',
          updateDate: '',
          remark: '',
          deleteFlag: '0'
        },
        dataRule: {
          question: [
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
          deleteFlag: [
            { required: true, message: '不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/generator/questionnairequestion/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.question = data.questionnaireQuestion.question
                this.dataForm.answerA = data.questionnaireQuestion.answerA
                this.dataForm.answerB = data.questionnaireQuestion.answerB
                this.dataForm.answerC = data.questionnaireQuestion.answerC
                this.dataForm.answerD = data.questionnaireQuestion.answerD
                this.dataForm.creater = data.questionnaireQuestion.creater
                this.dataForm.createDate = data.questionnaireQuestion.createDate
                this.dataForm.updater = data.questionnaireQuestion.updater
                this.dataForm.updateDate = data.questionnaireQuestion.updateDate
                this.dataForm.remark = data.questionnaireQuestion.remark
                this.dataForm.deleteFlag = data.questionnaireQuestion.deleteFlag
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
              url: this.$http.adornUrl(`/generator/questionnairequestion/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'questionType': this.dataForm.questionType,
                'question': this.dataForm.question,
                'answerA': this.dataForm.answerA,
                'answerB': this.dataForm.answerB,
                'answerC': this.dataForm.answerC,
                'answerD': this.dataForm.answerD,
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
