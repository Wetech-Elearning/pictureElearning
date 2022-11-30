<template>
  <el-dialog
    :title="$t('button.add')"
    :close-on-click-modal="false"
    :before-close="handleClose"
    v-if="visibleAuto"
    :visible.sync="visibleAuto">
    <el-form :model="autoDataForm" :rules="dataRule" ref="autoDataForm" label-width="80px">
      <el-form-item :label="$t('question.question_subject')" prop="subject">
        <el-select v-model="autoDataForm.subject" :placeholder="$t('question.question_subject')" style="width:100%;">
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
        <el-radio v-model="autoDataForm.type" label="1">{{$t('question.question_translate_zh_japan')}}</el-radio>
        <el-radio v-model="autoDataForm.type" label="2">{{$t('question.question_translate_japan_zh')}}</el-radio>
      </el-form-item>
      <el-form-item :label="$t('question.question_num')" prop="count">
        <el-input v-model="autoDataForm.count" :placeholder="$t('question.question_num')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('question.question_score')" prop="score">
        <el-input v-model="autoDataForm.score" :placeholder="$t('question.question_score')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('question.question_level')" prop="level">
        <el-select v-model="autoDataForm.level" :placeholder="$t('question.question_level')" style="width:100%;">
          <el-option
            v-for="item in levelOptions"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getNowTime } from '@/utils'
  export default {
    data () {
      return {
        visibleAuto: false,
        autoDataForm: {
          uuid: 0,
          subject: '',
          count: '',
          score: '',
          level: '',
          section: '',
          deleteFlag: '0',
          type: '1'
        },
        dataRule: {
          subject: [
            { required: true, message: '考试课程不能为空', trigger: 'blur' }
          ],
          count: [
            { required: true, message: '数量不能为空', trigger: 'blur' }
          ],
          score: [
            { required: true, message: '分数不能为空', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '难度等级不能为空', trigger: 'blur' }
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
      init () {
        this.visibleAuto = true
        this.$nextTick(() => {
          this.$refs['autoDataForm'].resetFields()
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['autoDataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/translatequestion/autoSave`),
              method: 'post',
              data: this.$http.adornData({
                'subject': this.autoDataForm.subject,
                'type': this.autoDataForm.type,
                'count': this.autoDataForm.count,
                'score': this.autoDataForm.score,
                'level': this.autoDataForm.level,
                'section': this.autoDataForm.section,
                'deleteFlag': this.autoDataForm.deleteFlag
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: this.$t('message.success'),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visibleAuto = false
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
      // 关闭
      handleClose() {
        this.visibleAuto = false
        this.$refs['autoDataForm'].resetFields()
      }
    }
  }
</script>
