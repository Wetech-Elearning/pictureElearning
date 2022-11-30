<template>
  <el-dialog class="abow_dialog"
             v-if="dialogAddQuestionsVisible"
             :visible.sync="dialogAddQuestionsVisible"
             width="70%" >
    <el-transfer class="edit_dev"
                 filterable
                 :titles="[$t('paper.paper_no_checked_questions'), $t('paper.paper_checked_questions')]"
                 :filter-placeholder="$t('paper.paper_tip')"
                 v-model="value"
                 :render-content="renderFunc"
                 @change="handleChange"
                 :data="data">
      <el-button class="transfer-footer" slot="left-footer" size="small" @click="refresh">{{$t('button.refresh')}}</el-button>
      <el-button class="transfer-footer" slot="right-footer" size="small" @click="cancle">{{$t('button.cancle')}}</el-button>
      <el-button class="transfer-footer" slot="right-footer" size="small" type="primary" @click="save">{{$t('button.confirm')}}</el-button>
    </el-transfer>
  </el-dialog>
</template>

<script>
  export default {
    name: "addQuestions",
    data () {
      return {
        transferData: [],
        dialogAddQuestionsVisible: false,
        examPaperId: '',
        subject: '',
        data: [],
        value: [],
        renderFunc(h, option) {
          console.log('option=================',option)
          return <span>{ option.type } : { option.label }</span>;
        }
      }
    },
    methods: {
      // 初始化
      init(id,courseId) {
        this.value = []
        this.dialogAddQuestionsVisible = true
        this.examPaperId = id
        this.subject = courseId
        this.data = []
        this.value = []
        this.$nextTick(() => {
          this.getLeftQuestions()
          this.getRightQuestions()
        })
      },
      //初始化左侧试题
      getLeftQuestions() {
        this.$http({
          url: this.$http.adornUrl(`/generator/exampaperinfos/getAllQuestionsBySubject`),
          method: 'get',
          params: this.$http.adornParams({
            'subject': this.subject
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            if(data.data.radioQuestionEntityList.length > 0){
              const radioQuestionArr = data.data.radioQuestionEntityList.map((item)=>{
                return {type:this.$t('paper.paper_radioquestion'),key:item.uuid,label:item.question}
              })
              console.log('radioQuestionArr===>',radioQuestionArr)
              this.data = this.data.concat(radioQuestionArr)
            }
            if(data.data.multiQuestionEntityList.length > 0){
              const multiQuestionArr = data.data.multiQuestionEntityList.map((item)=>{
                return {type:this.$t('paper.paper_multiquestion'),key:item.uuid,label:item.question}
              })
              console.log('multiQuestionArr===>',multiQuestionArr)
              this.data = this.data.concat(multiQuestionArr)
            }
            if(data.data.fillQuestionEntityList.length > 0){
              const fillQuestionArr = data.data.fillQuestionEntityList.map((item)=>{
                return {type:this.$t('paper.paper_fillquestion'),key:item.uuid,label:item.question}
              })
              console.log('fillQuestionArr===>',fillQuestionArr)
              this.data = this.data.concat(fillQuestionArr)
            }
            if(data.data.judgeQuestionEntityList.length > 0){
              const judgeQuestionArr = data.data.judgeQuestionEntityList.map((item)=>{
                return {type:this.$t('paper.paper_judgequestion'),key:item.uuid,label:item.question}
              })
              console.log('judgeQuestionArr===>',judgeQuestionArr)
              this.data = this.data.concat(judgeQuestionArr)
            }
            if(data.data.discussionQuestionEntityList.length > 0){
              const discussionQuestionArr = data.data.discussionQuestionEntityList.map((item)=>{
                return {type:this.$t('paper.paper_discussionquestion'),key:item.uuid,label:item.question}
              })
              console.log('discussionQuestionArr===>',discussionQuestionArr)
              this.data = this.data.concat(discussionQuestionArr)
            }
            if(data.data.translateQuestionEntityList.length > 0){
              const translateQuestionArr = data.data.translateQuestionEntityList.map((item)=>{
                return {type:this.$t('paper.paper_translatequestion'),key:item.uuid,label:item.question}
              })
              console.log('translateQuestionArr===>',translateQuestionArr)
              this.data = this.data.concat(translateQuestionArr)
            }
          }
        })
      },
      //初始化右侧已经选择的试题
      getRightQuestions() {
        this.$http({
          url: this.$http.adornUrl(`/generator/paperQuestion/getRightQuestions/`+this.examPaperId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.value = data.data
          }
        })
      },
      // 确定
      save() {
        const questionIds = this.value.map((item1)=>{
          this.data.map((item2)=>{
            if(item2.key == item1){
              item1 = item2
            }
          })
          return item1
        })
        this.$http({
          url: this.$http.adornUrl('/generator/paperQuestion/save'),
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
                this.dialogAddQuestionsVisible = false
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
        this.dialogAddQuestionsVisible = false
        this.$emit('init')
      },
      //刷新
      refresh() {
        this.data = []
        this.getLeftQuestions()
      },
      handleChange(value, direction, movedKeys) {
        if('left' == direction){
          this.$http({
            url: this.$http.adornUrl(`/generator/paperQuestion/deleteByQuestionIds`),
            method: 'post',
            data: this.$http.adornData(movedKeys, false)
          }).then(({data}) => {
            console.log('操作成功')
          })
        }
      }
    }
  }
</script>
<style scoped lang="css">
  .edit_dev >>> .el-transfer-panel {
    width:40%;
    margin-left: 35px;
    height: 500px;
  }
  .edit_dev >>> .el-transfer-panel__list {
    height: 175%;
  }
  .abow_dialog {
    display: flex;
    justify-content: center;
    align-items: Center;
    overflow: hidden;
    .el-dialog {
      margin: 0 auto !important;
      height: 90%;
      overflow: hidden;
      .el-dialog__body {
        position: absolute;
        left: 0;
        top: 54px;
        bottom: 0;
        right: 0;
        padding: 0;
        z-index: 1;
        overflow: hidden;
        overflow-y: auto;
      }
    }
  }
</style>

