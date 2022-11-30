<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item :label="$t('common.name')" prop="examPaperName">
        <el-input v-model="dataForm.examPaperName" :placeholder="$t('paper.paper_name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('course.course_name')" prop="subject">
        <custom-select
          style="width:100%;"
          :action="'/generator/coursetype/listTwoLevelCourseType'"
          :props="{label: 'courseTypeName', value: 'uuid'}"
          :placeHolder="$t('course.course_name')"
          :value.sync="dataForm.subject"
          :label.sync="dataForm.relatedCourseType"
        ></custom-select>
      </el-form-item>
      <el-form-item :label="$t('paper.paper_desc')" prop="description">
        <el-input v-model="dataForm.description" :placeholder="$t('paper.paper_desc')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('paper.paper_status')" prop="status">
        <el-select v-model="dataForm.status" :placeholder="$t('paper.paper_status')" style="width: 100%;">
          <el-option :label="$t('common.unrelease')" value="0"></el-option>
          <el-option :label="$t('common.release')" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('paper.paper_total_score')" prop="totalScore">
        <el-input v-model="dataForm.totalScore" :placeholder="$t('paper.paper_total_score')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('paper.paper_pass_scores')" prop="passScore">
        <el-input v-model="dataForm.passScore" :placeholder="$t('paper.paper_pass_scores')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('paper.paper_time_limit')" prop="exmaTimeLimit">
        <el-input v-model="dataForm.exmaTimeLimit" :placeholder="$t('paper.paper_time_limit')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('paper.paper_try_nums')" prop="examMaxNum">
        <el-input v-model="dataForm.examMaxNum" :placeholder="$t('paper.paper_try_nums')"></el-input>
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
          examPaperName: '',
          status: '0',
          subject: '',
          description: '',
          totalScore: '',
          passScore: '',
          exmaTimeLimit: '',
          examMaxNum: '',
          creater: '',
          createDate: '',
          updater: '',
          updateDate: '',
          remark: '',
          deleteFlag: '0'
        },
        dataRule: {
          examPaperName: [
            { required: true, message: '试卷名称不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '试卷描述不能为空', trigger: 'blur' }
          ],
          totalScore: [
            { required: true, message: '试卷总分不能为空', trigger: 'blur' }
          ],
          passScore: [
            { required: true, message: '试卷及格分不能为空', trigger: 'blur' }
          ],
          exmaTimeLimit: [
            { required: true, message: '考试时长阈值不能为空', trigger: 'blur' }
          ],
          examMaxNum: [
            { required: true, message: '试卷考试最大次数不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/generator/exampaperinfos/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.examPaperName = data.examPaperInfos.examPaperName
                this.dataForm.subject = data.examPaperInfos.subject
                this.dataForm.status = data.examPaperInfos.status
                this.dataForm.description = data.examPaperInfos.description
                this.dataForm.totalScore = data.examPaperInfos.totalScore
                this.dataForm.passScore = data.examPaperInfos.passScore
                this.dataForm.exmaTimeLimit = data.examPaperInfos.exmaTimeLimit
                this.dataForm.examMaxNum = data.examPaperInfos.examMaxNum
                this.dataForm.creater = data.examPaperInfos.creater
                this.dataForm.createDate = data.examPaperInfos.createDate
                this.dataForm.updater = data.examPaperInfos.updater
                this.dataForm.updateDate = data.examPaperInfos.updateDate
                this.dataForm.remark = data.examPaperInfos.remark
                this.dataForm.deleteFlag = data.examPaperInfos.deleteFlag
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
              url: this.$http.adornUrl(`/generator/exampaperinfos/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'examPaperName': this.dataForm.examPaperName,
                'description': this.dataForm.description,
                'status': this.dataForm.status,
                'subject': this.dataForm.subject,
                'totalScore': this.dataForm.totalScore,
                'passScore': this.dataForm.passScore,
                'exmaTimeLimit': this.dataForm.exmaTimeLimit,
                'examMaxNum': this.dataForm.examMaxNum,
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
