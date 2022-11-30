<template>
  <el-dialog
    :title="!dataForm.uuid ? $t('button.add') : $t('button.update')"
    :close-on-click-modal="false"
    @close="closeDialog"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item :label="$t('question.question_subject')" prop="subject">
        <el-select v-model="dataForm.subject" :placeholder="$t('question.question_subject')" style="width:100%;">
          <el-option
            v-for="item in courseOptions"
            :key="item.uuid"
            :label="item.courseTypeName"
            :value="item.uuid"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('question.question_content')" prop="question">
        <el-input v-model="dataForm.question" :placeholder="$t('question.question_content')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('question.question_right')" prop="answer">
        <el-select v-model="dataForm.answer" :placeholder="$t('question.question_right')" style="width:100%;">
          <el-option
            v-for="item in answerOptions"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('question.question_analysis')" prop="analysis">
        <el-input v-model="dataForm.analysis" :placeholder="$t('question.question_analysis')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('question.question_score')" prop="score">
        <el-input v-model="dataForm.score" :placeholder="$t('question.question_score')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('question.question_level')" prop="level">
        <el-select v-model="dataForm.level" :placeholder="$t('question.question_level')" style="width:100%;">
          <el-option
            v-for="item in levelOptions"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="所属章节" prop="section">
        <el-input v-model="dataForm.section" placeholder="所属章节"></el-input>
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
        dataForm: {
          uuid: 0,
          questionid: '',
          subject: '',
          question: '',
          answer: '',
          analysis: '',
          score: '',
          level: '',
          section: '',
          createDate: '',
          deleteFlag: '0'
        },
        dataRule: {
          subject: [
            { required: true, message: '考试科目不能为空', trigger: 'blur' }
          ],
          question: [
            { required: true, message: '试题内容不能为空', trigger: 'blur' }
          ],
          answer: [
            { required: true, message: '正确答案不能为空', trigger: 'blur' }
          ],
          analysis: [
            { required: true, message: '题目解析不能为空', trigger: 'blur' }
          ],
          score: [
            { required: true, message: '分数不能为空', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '难度等级不能为空', trigger: 'blur' }
          ]
        },
        courseOptions: [],
        answerOptions: [],
        levelOptions: []
      }
    },
    created () {
      this.initCourses()
      this.initAnswerOptions()
      this.initLevel()
    },
    methods: {
      init (id) {
        this.dataForm.uuid = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.uuid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/judgequestion/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.uuid = data.judgeQuestion.uuid
                this.dataForm.questionid = data.judgeQuestion.questionid
                this.dataForm.subject = data.judgeQuestion.subject
                this.dataForm.question = data.judgeQuestion.question
                this.dataForm.answer = data.judgeQuestion.answer
                this.dataForm.analysis = data.judgeQuestion.analysis
                this.dataForm.score = data.judgeQuestion.score
                this.dataForm.level = data.judgeQuestion.level
                this.dataForm.section = data.judgeQuestion.section
                this.dataForm.deleteFlag = data.judgeQuestion.deleteFlag
              }
            })
          }else{
            this.dataForm.createDate = getNowTime()
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/judgequestion/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'questionid': this.dataForm.questionid,
                'subject': this.dataForm.subject,
                'question': this.dataForm.question,
                'answer': this.dataForm.answer,
                'analysis': this.dataForm.analysis,
                'score': this.dataForm.score,
                'level': this.dataForm.level,
                'section': this.dataForm.section,
                'createDate': this.dataForm.createDate,
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
      // 初始化考试课程选项
      initCourses () {
        this.$http({
          url: this.$http.adornUrl('/generator/coursetype/listTwoLevelCourseType'),
          method: 'post',
          data: this.$http.adornData({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.courseOptions = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 初始化答案
      initAnswerOptions () {
        this.$http({
          url: this.$http.adornUrl('/sys/dict/json/data/answer'),
          method: 'get',
          data: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.answerOptions = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 初始化难度等级
      initLevel () {
        this.$http({
          url: this.$http.adornUrl('/sys/dict/json/data/difficultLevel'),
          method: 'get',
          data: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.levelOptions = data.data
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
