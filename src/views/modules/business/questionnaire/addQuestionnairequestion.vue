<template>
  <el-dialog class="abow_dialog" :visible.sync="dialogAddQuestionsVisible" v-if="dialogAddQuestionsVisible" width="70%" >
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
  import { getNowTime, uniqueArr } from '@/utils'
  export default {
    name: "addQuestions",
    data () {
      return {
        questionnaireId: '',
        transferData: [],
        dialogAddQuestionsVisible: false,
        data: [],
        value: [],
        del: [],
        renderFunc(h, option) {
          console.log('option=================',option)
          return <span>{ option.label }</span>;
        }
      }
    },
    methods: {
      // 初始化
      init(id) {
        this.questionnaireId = id
        this.dialogAddQuestionsVisible = true
        this.data = []
        this.value = []
        this.del = []
        this.$nextTick(() => {
          this.getLeftQuestions()
          this.getRightQuestions()
        })
      },
      //初始化左侧试题
      getLeftQuestions() {
        this.$http({
          url: this.$http.adornUrl(`/generator/questionnairequestion/listAll`),
          method: 'get',
          params: this.$http.adornParams({
            'questionnaireId': this.questionnaireId
          })
        }).then(({data}) => {
          if (data && data.code == 0) {
            if(data.data.length > 0){
              const temp = data.data.map((item)=>{
                return {key:item.uuid,label:item.question}
              })
              this.data = temp
              console.log(('this.data',this.data))
            }
          }
        })
      },
      //初始化右侧已经选择的试题
      getRightQuestions() {
        this.$http({
          url: this.$http.adornUrl(`/generator/questionnaire/getRightQuestionnaire/`+this.questionnaireId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.value = data.data.map((item)=>{
              return item.questionId
            })
          }
        })
      },
      // 确定
      save() {
        if(this.del.length > 0){
          this.$http({
            url: this.$http.adornUrl(`/generator/questionnaire/deleteByQuestionIds`),
            method: 'post',
            data: this.$http.adornData({
              'questionIds' : uniqueArr(this.del),
              'questionnaireId' : this.questionnaireId
            })
          }).then(({data}) => {
            console.log('操作成功')
          })
        }
        console.log('this.value',this.value)
        console.log('this.data',this.data)
        const questionIds = []
        this.value.map((item1)=>{
          this.data.map((item2)=>{
            if(item2.key == item1){
              questionIds.push(item2)
            }
          })
          return item1
        })
        console.log('questionIds',questionIds)
        this.$http({
          url: this.$http.adornUrl('/generator/questionnairedetail/save'),
          method: 'post',
          data: this.$http.adornData({
            'questionnaireId': this.questionnaireId,
            'questionIds': questionIds,
            'creater': this.$store.state.user.id,
            'createDate': getNowTime()
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
      },
      //刷新
      refresh() {
        this.data = []
        this.getLeftQuestions()
      },
      handleChange(value, direction, movedKeys) {
        if('left' == direction){
          this.del = this.del.concat(movedKeys)
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

