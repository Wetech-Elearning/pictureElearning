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
      <el-form-item :label="$t('question.question_translate_type')" prop="type">
        <el-radio v-model="dataForm.type" label="1">{{$t('question.question_translate_zh_japan')}}</el-radio>
        <el-radio v-model="dataForm.type" label="2">{{$t('question.question_translate_japan_zh')}}</el-radio>
      </el-form-item>
      <el-form-item :label="dataForm.type == '1'? $t('question.question_translate_zh') : $t('question.question_translate_japan')" prop="question">
        <el-input v-model="dataForm.question" :placeholder="dataForm.type == '1'? $t('question.question_translate_zh_tip') : $t('question.question_translate_japan_tip')"></el-input>
      </el-form-item>
      <el-form-item :label="dataForm.type == '2'? $t('question.question_translate_zh') : $t('question.question_translate_japan')" prop="answer">
        <el-input v-model="dataForm.answer" :placeholder="dataForm.type == '2'? $t('question.question_translate_zh_tip') : $t('question.question_translate_japan_tip')"></el-input>
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
      <!--<el-form-item label="????????????" prop="section">
        <el-input v-model="dataForm.section" placeholder="????????????"></el-input>
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
          subject: '',
          question: '',
          answer: '',
          analysis: '',
          score: '',
          level: '',
          section: '',
          createDate: '',
          deleteFlag: '0',
          type: '1'
        },
        dataRule: {
          subject: [
            { required: true, message: '????????????????????????', trigger: 'blur' }
          ],
          question: [
            { required: true, message: '????????????????????????', trigger: 'blur' }
          ],
          answer: [
            { required: true, message: '????????????????????????', trigger: 'blur' }
          ],
          analysis: [
            { required: true, message: '????????????????????????', trigger: 'blur' }
          ],
          score: [
            { required: true, message: '??????????????????', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '????????????????????????', trigger: 'blur' }
          ],
          section: [
            { required: true, message: '????????????????????????', trigger: 'blur' }
          ],
          deleteFlag: [
            { required: true, message: '????????????????????????', trigger: 'blur' }
          ],
          tenantId: [
            { required: true, message: '??????????????????', trigger: 'blur' }
          ]
        },
        courseOptions: [],
        levelOptions: []
      }
    },
    created() {
      this.initCourses()
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
              url: this.$http.adornUrl(`/generator/translatequestion/info/${this.dataForm.uuid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.subject = data.translateQuestion.subject
                this.dataForm.type = data.translateQuestion.type
                this.dataForm.question = data.translateQuestion.question
                this.dataForm.answer = data.translateQuestion.answer
                this.dataForm.analysis = data.translateQuestion.analysis
                this.dataForm.score = data.translateQuestion.score
                this.dataForm.level = data.translateQuestion.level
                this.dataForm.section = data.translateQuestion.section
                this.dataForm.deleteFlag = data.translateQuestion.deleteFlag
                this.dataForm.tenantId = data.translateQuestion.tenantId
              }
            })
          }else{
            this.dataForm.createDate = getNowTime()
          }
        })
      },
      // ????????????
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/translatequestion/${!this.dataForm.uuid ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.uuid || undefined,
                'subject': this.dataForm.subject,
                'type': this.dataForm.type,
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
      // ???????????????????????????
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
      // ?????????????????????
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
      // ??????Dialog
      closeDialog () {
        this.$refs['dataForm'].resetFields()
        this.visible = false
      }
    }
  }
</script>
