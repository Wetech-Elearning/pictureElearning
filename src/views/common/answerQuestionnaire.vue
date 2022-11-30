<template>
  <el-dialog
    title="填写问卷"
    :close-on-click-modal="false"
    :fullscreen="true"
    append-to-body
    v-if="visible"
    :visible.sync="visible">
    <div class="box">
      <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" class="my-form">
        <el-form-item v-for="(item,index) in dataList"  :key="index" :label="(index + 1) + '.' + item.question">
          <el-input
            v-if="item.questionType === '简答' || item.questionType === '长文'"
            type="textarea"
            :rows="2"
            placeholder="请输入回答"
            v-model="item.questionnaireQuestionAnswer">
          </el-input>
          <div v-if="item.questionType === '单项选择'">
            <el-radio v-model="item.questionnaireQuestionAnswer" label="A">{{'A：' + item.answerA}}</el-radio>
            <el-radio v-model="item.questionnaireQuestionAnswer" label="B">{{'B：' + item.answerB}}</el-radio>
            <el-radio v-model="item.questionnaireQuestionAnswer" label="C">{{'C：' + item.answerC}}</el-radio>
            <el-radio v-model="item.questionnaireQuestionAnswer" label="D">{{'D：' + item.answerD}}</el-radio>
          </div>
          <div v-if="item.questionType === '多项选择'">
            <el-checkbox-group v-model="item.questionnaireQuestionAnswer">
              <el-checkbox label="A">{{'A：' + item.answerA}}</el-checkbox>
              <el-checkbox label="B">{{'B：' + item.answerB}}</el-checkbox>
              <el-checkbox label="C">{{'C：' + item.answerC}}</el-checkbox>
              <el-checkbox label="D">{{'D：' + item.answerD}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('button.cancle')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('button.confirm')}}</el-button>
    </span>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataList: [],
      uuid: '',
      dataForm: {
        questionnaireId: '',
        questionnaireQuestionId: '',
        questionnaireQuestionAnswer: [],
        userId:''
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
      this.dataList = []
      this.uuid = id
      this.visible = true
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl(`/generator/questionnairedetail/info/${this.uuid}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
             data.data.forEach((item)=>{
                this.dataList.push({
                  questionnaireId: this.uuid,
                  questionnaireQuestionId: item.uuid,
                  question: item.question,
                  questionType: item.questionType,
                  answerA: item.answerA,
                  answerB: item.answerB,
                  answerC: item.answerC,
                  answerD: item.answerD,
                  questionnaireQuestionAnswer: '多项选择' === item.questionType ? [] : ''
                })
            })
            console.log('this.dataList',this.dataList)
          }
        })
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataList.map((item) => {
            if(item.questionType === '多项选择'){
              item.questionnaireQuestionAnswer = item.questionnaireQuestionAnswer.join().replaceAll(',','')
            }
            return item
          })
          this.$http({
            url: this.$http.adornUrl(`/generator/questionnairerecord/save`),
            method: 'post',
            data: this.$http.adornData({
              questionnaireRecords: this.dataList,
              userId: this.userId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: this.$t('message.success'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .box{
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    padding: 20px 20px;
    width: 80%;
    height: auto;
    margin: 0 auto;
  }

  /deep/ .my-form .el-form-item__label{
    text-align:left;
    float: none;
    word-break: break-word;
  }

  /deep/ .el-radio{
    display: block;
    line-height: 36px;
    white-space: normal;
    margin-left: 0;
  }

  /deep/ .el-checkbox{
    display: block;
    line-height: 36px;
    white-space: normal;
    margin-left: 0;
  }
</style>
