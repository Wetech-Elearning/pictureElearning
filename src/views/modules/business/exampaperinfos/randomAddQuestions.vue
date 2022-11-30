<template>
  <el-dialog
    title="随机生成试卷"
    class="abow_dialog"
    v-if="dialogRandomAddQuestionsVisible"
    :visible.sync="dialogRandomAddQuestionsVisible"
    width="50%" >
    <div class="box">
      <el-table
        :data="data"
        style="width: 100%">
        <el-table-column
          prop="questionType"
          label="题库类型">
        </el-table-column>
        <el-table-column
          prop="questionNums"
          label="题目总数量">
        </el-table-column>
        <el-table-column
          prop="addQuestionNum"
          label="添加数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.addQuestionNum" type="number" size="mini"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "addQuestions",
    data () {
      return {
        transferData: [],
        dialogRandomAddQuestionsVisible: false,
        examPaperId: '',
        subject: '',
        data: []
      }
    },
    methods: {
      // 初始化
      init(id,courseId) {
        this.value = []
        this.dialogRandomAddQuestionsVisible = true
        this.examPaperId = id
        this.subject = courseId
        this.data = []
        this.$nextTick(() => {
          this.getQuestions()
        })
      },
      //初始化试题
      getQuestions() {
        this.$http({
          url: this.$http.adornUrl(`/generator/exampaperinfos/getAllQuestionsBySubject`),
          method: 'get',
          params: this.$http.adornParams({
            'subject': this.subject
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            if(data.data.radioQuestionEntityList.length > 0){
              this.data = this.data.concat({
                'questionType' : this.$t('paper.paper_radioquestion'),
                'questionNums' : data.data.radioQuestionEntityList.length,
                'addQuestionNum' : 0
              })
            }
            if(data.data.multiQuestionEntityList.length > 0){
              this.data = this.data.concat({
                'questionType' : this.$t('paper.paper_multiquestion'),
                'questionNums' : data.data.multiQuestionEntityList.length,
                'addQuestionNum' : 0
              })
            }
            if(data.data.fillQuestionEntityList.length > 0){
              this.data = this.data.concat({
                'questionType' : this.$t('paper.paper_fillquestion'),
                'questionNums' : data.data.fillQuestionEntityList.length,
                'addQuestionNum' : 0
              })
            }
            if(data.data.judgeQuestionEntityList.length > 0){
              this.data = this.data.concat({
                'questionType' : this.$t('paper.paper_judgequestion'),
                'questionNums' : data.data.judgeQuestionEntityList.length,
                'addQuestionNum' : 0
              })
            }
            if(data.data.discussionQuestionEntityList.length > 0){
              this.data = this.data.concat({
                'questionType' : this.$t('paper.paper_discussionquestion'),
                'questionNums' : data.data.discussionQuestionEntityList.length,
                'addQuestionNum' : 0
              })
            }
            if(data.data.translateQuestionEntityList.length > 0){
              this.data = this.data.concat({
                'questionType' : this.$t('paper.paper_translatequestion'),
                'questionNums' : data.data.translateQuestionEntityList.length,
                'addQuestionNum' : 0
              })
            }
          }
        })
      },
      // 确定
      save() {
        const questionIds = this.data.map((item) => {
          return {
            'type' : item.questionType,
            'num' : item.addQuestionNum,
            'subject' : this.subject,
          }
        })
        this.$http({
          url: this.$http.adornUrl('/generator/paperQuestion/randomAddQuestions'),
          method: 'post',
          data: this.$http.adornData({
            'paperId': this.examPaperId,
            'questionIds': questionIds
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: this.$t('message.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dialogRandomAddQuestionsVisible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 取消
      cancle() {
        this.dialogRandomAddQuestionsVisible = false
        this.$emit('init')
      }
    }
  }
</script>
<style scoped lang="css">
</style>

