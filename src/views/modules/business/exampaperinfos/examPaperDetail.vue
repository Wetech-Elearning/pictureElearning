// 点击试卷后的缩略信息
<template>
  <div id="msg">
    <div class="wrapper">
      <ul class="top">
        <li class="example">{{examPaperData.examPaperName}}</li>
        <li class="right">
          <div>
            <span class="count">{{$t('paper.paper_total_score')}}</span>
            <span class="score">{{examPaperData.totalScore}}</span>
          </div>
        </li>
      </ul>
      <ul class="bottom">
        <li>{{$t('paper.paper_create_time')}}{{examPaperData.createDate}}</li>
        <li>{{$t('paper.paper_create_from')}} {{examPaperData.creater}}</li>
        <li class="right">
          <el-button v-if="roles == 4" @click="toAnswer(examPaperData.uuid,examPaperData.subject)">{{$t('button.start_exam')}}</el-button>
         <!-- <el-button @click="toAnswer(examPaperData.uuid,examPaperData.subject)">开始考试</el-button>-->
        </li>
      </ul>
      <ul class="info">
        <li @click="dialogVisible = true"><a href="javascript:;"><i class="iconfont icon-info"></i>{{$t('paper.paper_exam_info')}}</a></li>
      </ul>
    </div>
    <div class="content">
      <div v-if="roles == 3">
        <el-button type="primary" size="small" @click="addQuestions">{{$t('button.add_question')}}</el-button>
        <el-button type="primary" size="small" @click="randomAddQuestions">{{$t('button.random_add_question')}}</el-button>
        <el-button v-if="examPaperData.status == 0" type="success" size="small" @click="publicHandler(1)">{{$t('button.release')}}</el-button>
        <el-button v-if="examPaperData.status == 1" type="info" size="small" @click="publicHandler(0)">{{$t('button.un_release')}}</el-button>
        <el-button type="danger" size="small" @click="deleteHandler">{{$t('button.delete')}}</el-button>
      </div>
      <el-collapse class="inner">
        <el-collapse-item v-if="multiQuestion.total > 0">
          <template slot="title" name="1">
            {{ $t('paper.paper_radioquestion') }} ({{$t('paper.paper_question_count')}}{{radioQuestion.total}}{{$t('paper.paper_questions')}} {{$t('paper.paper_question_score_count')}}{{radioQuestion.score}}{{$t('paper.paper_unit')}})
          </template>
          <div class="contenti">
            <ul class="question" v-for="(item, index) in radioQuestion.radioQuestionList" :key="index">
              <li>{{index+1}}. {{item.question}} {{item.score}}分</li>
            </ul>
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="multiQuestion.total > 0">
          <template slot="title" name="1">
            {{ $t('paper.paper_multiquestion') }} ({{$t('paper.paper_question_count')}}{{multiQuestion.total}}{{$t('paper.paper_questions')}} {{$t('paper.paper_question_score_count')}}{{multiQuestion.score}}{{$t('paper.paper_unit')}})
          </template>
          <div class="contenti">
            <ul class="question" v-for="(item, index) in multiQuestion.multiQuestionList" :key="index">
              <li>{{radioQuestion.total + index+1}}. {{item.question}} {{item.score}}分</li>
            </ul>
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="fillQuestion.total > 0">
          <template slot="title" name="2">
            {{ $t('paper.paper_fillquestion') }} ({{$t('paper.paper_question_count')}}{{fillQuestion.total}}{{$t('paper.paper_questions')}}  {{$t('paper.paper_question_score_count')}}{{fillQuestion.score}}{{$t('paper.paper_unit')}})
          </template>
          <div class="contenti">
            <ul class="question" v-for="(item, index) in fillQuestion.fillQuestionList" :key="index">
              <li>{{radioQuestion.total + multiQuestion.total+index+1}}.{{item.question}}  {{item.score}}分</li>
            </ul>
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="judgeQuestion.total > 0">
          <template slot="title" name="3">
            {{ $t('paper.paper_judgequestion') }} ({{$t('paper.paper_question_count')}}{{judgeQuestion.total}}{{$t('paper.paper_questions')}} {{$t('paper.paper_question_score_count')}}{{judgeQuestion.score}}{{$t('paper.paper_unit')}})
          </template>
          <div class="contenti">
            <ul class="question" v-for="(item, index) in judgeQuestion.judgeQuestionList" :key="index">
              <li>{{radioQuestion.total + multiQuestion.total+fillQuestion.total+index+1}}. {{item.question}} {{item.score}}分</li>
            </ul>
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="translateQuestion.total > 0">
          <template slot="title" name="4">
            {{ $t('paper.paper_translatequestion') }} ({{$t('paper.paper_question_count')}}{{translateQuestion.total}}{{$t('paper.paper_questions')}} {{$t('paper.paper_question_score_count')}}{{translateQuestion.score}}{{$t('paper.paper_unit')}})
          </template>
          <div class="contenti">
            <ul class="question" v-for="(item, index) in translateQuestion.translateList" :key="index">
              <li>{{radioQuestion.total + multiQuestion.total+fillQuestion.total + judgeQuestion.total + index + 1}}. {{item.question}} {{item.score}}分</li>
            </ul>
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="discussionQuestion.total > 0">
          <template slot="title" name="5">
            {{ $t('paper.paper_discussionquestion') }} ({{$t('paper.paper_question_count')}}{{discussionQuestion.total}}{{$t('paper.paper_questions')}} {{$t('paper.paper_question_score_count')}}{{discussionQuestion.score}}{{$t('paper.paper_unit')}})
          </template>
          <div class="contenti">
            <ul class="question" v-for="(item, index) in discussionQuestion.discussionQuestionList" :key="index">
              <li>{{radioQuestion.total + multiQuestion.total + fillQuestion.total + judgeQuestion.total + translateQuestion.total +index+1}}. {{item.question}} {{item.score}}{{$t('paper.paper_unit')}}</li>
            </ul>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!--考生须知对话框-->
    <el-dialog
      :title="$t('paper.paper_exam_info')"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{examPaperData.tips}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('button.know')}}</el-button>
      </span>
    </el-dialog>
    <!-- 添加试题 -->
    <addQuestions v-if="dialogAddQuestionsVisible" ref="addQuestions" @refreshDataList="init"></addQuestions>
    <!-- 随机添加试题 -->
    <randomAddQuestions v-if="dialogRandomAddQuestionsVisible" ref="randomAddQuestions" @refreshDataList="init"></randomAddQuestions>
  </div>
</template>

<script>
  import addQuestions from './addQuestions'
  import randomAddQuestions from './randomAddQuestions'
export default {
  data() {
    return {
      roles: '',
      dialogAddQuestionsVisible: false,
      dialogRandomAddQuestionsVisible: false,
      dialogVisible: false,
      // 默认打开序号
      activeName: '0',
      // 试卷信息
      examPaperData: {
        examPaperName: '',
        subject: '',
        subjectId: '',
        status: '',
        creater: '',
        createDate: '',
        totalScore: 0,
        tips: '认真答题，不要作弊'
      },
      //单选题
      radioQuestion: {
        total: 0,
        score: 0,
        radioQuestionList: []
      },
      //多选题
      multiQuestion: {
        total: 0,
        score: 0,
        multiQuestionList: []
      },
      //填空题
      fillQuestion: {
        total: 0,
        score: 0,
        fillQuestionList: []
      },
      //判断题
      judgeQuestion: {
        total: 0,
        score: 0,
        judgeQuestionList: []
      },
      //翻译题
      translateQuestion: {
        total: 0,
        score: 0,
        translateList: []
      },
      //问答题
      discussionQuestion: {
        total: 0,
        score: 0,
        discussionQuestionList: []
      }
    }
  },
  components: {
    addQuestions,
    randomAddQuestions
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化页面数据
    init() {
      this.roles = this.$cookie.get('roles')
      this.multiQuestion.score = 0
      this.fillQuestion.score = 0
      this.judgeQuestion.score = 0
      this.translateQuestion.score = 0
      this.discussionQuestion.score = 0
      this.examPaperData.totalScore = 0
      // 获取路由传递过来的试卷编号
      let uuid = this.$route.query.uuid
      this.examPaperData.uuid = uuid
      this.examPaperData.subject = this.$route.query.subject
      this.examPaperData.subjectId = this.$route.query.subjectId
      this.$http({
        url: this.$http.adornUrl(`/generator/paperQuestion/info`),
        method: 'get',
        params: this.$http.adornParams({
          "uuid":uuid,
          'userId':this.$store.state.user.id,
          'isPractice':false,
          'pageName':'examPaperDetail'
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.examPaperData.examPaperName = data.examPaperInfos.examPaperName
          this.examPaperData.subject = data.examPaperInfos.subject
          this.examPaperData.status = data.examPaperInfos.status
          this.examPaperData.description = data.examPaperInfos.description
          this.examPaperData.passScore = data.examPaperInfos.passScore
          this.examPaperData.exmaTimeLimit = data.examPaperInfos.exmaTimeLimit
          this.examPaperData.examMaxNum = data.examPaperInfos.examMaxNum
          this.examPaperData.creater = data.examPaperInfos.creater
          this.examPaperData.createDate = data.examPaperInfos.createDate
          this.examPaperData.updater = data.examPaperInfos.updater
          this.examPaperData.updateDate = data.examPaperInfos.updateDate
          this.examPaperData.remark = data.examPaperInfos.remark
          this.initRadioQuestionInfo(data.examPaperInfos.examPaperDetail.radioQuestionEntityList)
          this.initMultiQuestionInfo(data.examPaperInfos.examPaperDetail.multiQuestionEntityList)
          this.initFillQuestionInfo(data.examPaperInfos.examPaperDetail.fillQuestionEntityList)
          this.initJudgeQuestionInfo(data.examPaperInfos.examPaperDetail.judgeQuestionEntityList)
          this.initTranslateQuestionInfo(data.examPaperInfos.examPaperDetail.translateQuestionEntityList)
          this.initDiscussionQuestionInfo(data.examPaperInfos.examPaperDetail.discussionQuestionEntityList)
        }
      })
    },
    initRadioQuestionInfo(data){
      if(data != undefined && data.length > 0){
        this.radioQuestion.radioQuestionList = data
        this.radioQuestion.total = data.length
        data.forEach((item, index, arr) => {
          this.radioQuestion.score += item.score
        })
        this.examPaperData.totalScore += this.radioQuestion.score
      }
    },
    initMultiQuestionInfo(data){
      if(data != undefined && data.length > 0){
        this.multiQuestion.multiQuestionList = data
        this.multiQuestion.total = data.length
        data.forEach((item, index, arr) => {
          this.multiQuestion.score += item.score
        })
        this.examPaperData.totalScore += this.multiQuestion.score
      }
    },
    initFillQuestionInfo(data){
      if(data != undefined && data.length > 0){
        this.fillQuestion.fillQuestionList = data
        this.fillQuestion.total = data.length
        data.forEach((item, index, arr) => {
          this.fillQuestion.score += item.score
        })
        this.examPaperData.totalScore += this.fillQuestion.score
      }
    },
    initJudgeQuestionInfo(data){
      if(data != undefined && data.length > 0){
        this.judgeQuestion.judgeQuestionList = data
        this.judgeQuestion.total = data.length
        data.forEach((item, index, arr) => {
          this.judgeQuestion.score += item.score
        })
        this.examPaperData.totalScore += this.judgeQuestion.score
      }
    },
    initTranslateQuestionInfo(data){
      if(data != undefined && data.length > 0){
        this.translateQuestion.translateList = data
        this.translateQuestion.total = data.length
        data.forEach((item, index, arr) => {
          this.translateQuestion.score += item.score
        })
        this.examPaperData.totalScore += this.translateQuestion.score
      }
    },
    initDiscussionQuestionInfo(data){
      if(data != undefined && data.length > 0){
        this.discussionQuestion.discussionQuestionList = data
        this.discussionQuestion.total = data.length
        data.forEach((item, index, arr) => {
          this.discussionQuestion.score += item.score
        })
        this.examPaperData.totalScore += this.discussionQuestion.score
      }
    },
    toAnswer (uuid, subject) {
/*
       this.$router.push({name: 'answer', params: {uuid: uuid,totalScore: this.examPaperData.totalScore,isPractice: false}})
*/
      // 判断该试卷关联的课程是否学习完成
      this.$http({
        url: this.$http.adornUrl(`/generator/exampaperinfos/isExam`),
        method: 'get',
        params: this.$http.adornParams({
          'uuid': subject,
          'userId': this.$store.state.user.id}
        )
      }).then(({data}) => {
        if (data && data.code === 0) {
          if (data.data) {
            // 判断是否超过考试的最大次数，超过的不允许考试
            this.$http({
              url: this.$http.adornUrl(`/generator/userexaminfo/isMaxNum`),
              method: 'get',
              params: this.$http.adornParams({
                'uuid': uuid,
                'userId': this.$store.state.user.id}
              )
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (!data.data) {
                  this.$router.push({name: 'answer', params: {uuid: uuid,totalScore: this.examPaperData.totalScore,isPractice: false}})
                } else {
                  this.$message.error('已达到最大考试次数')
                }
              }
            })
          } else {
            this.$message.error('请学习完课程之后再来考试')
          }
        }
      })
    },
    // 发布/取消发布试卷
    publicHandler (status) {
      this.examPaperData.status = status
      this.$http({
        url: this.$http.adornUrl(`/generator/exampaperinfos/updateStatus`),
        method: 'get',
        params: this.$http.adornParams({
            'uuid': this.$route.query.uuid,
            'status': status
          }
        )
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: this.$t('message.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        }
      })
    },
    //删除
    deleteHandler () {
      this.$confirm(`确定对[${this.examPaperData.examPaperName}]进行['删除']操作?`, '提示', {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancle'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/generator/exampaperinfos/delete`),
          method: 'post',
          data: this.$http.adornData([this.$route.query.uuid], false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$router.push('/business-exampaperinfos/exampaperinfos')
          }
        })
      })
    },
    // 添加试题
    addQuestions(){
      this.dialogAddQuestionsVisible = true
      this.$nextTick(() => {
        this.$refs.addQuestions.init(this.examPaperData.uuid,this.examPaperData.subject)
      })
    },
    // 随机添加试题
    randomAddQuestions(){
      this.dialogRandomAddQuestionsVisible = true
      this.$nextTick(() => {
        this.$refs.randomAddQuestions.init(this.examPaperData.uuid,this.examPaperData.subjectId)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom {
  .right{
    .el-button{
      color: #409EFF;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }
}
.right {
  margin-left: auto;
}
.inner .contenti .question {
  margin-left: -5px;
  color: #9a9a9a;
  font-size: 14px;
  list-style-type:none;
}
.content .inner .titlei {
  margin-left: 20px;
  font-size: 16px;
  color: #88949b;
  font-weight: bold;
}
.content .title .time {
  font-size: 16px;
  margin-left: 420px;
  color: #999;
}
.content .stitle {
  background-color: #0195ff;
}
.content .title span {
  margin-right: 10px;
}
#msg .content .title {
  font-size: 20px;
  margin: 0px;
  display: flex;
  align-items: center;
}
.content {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
}
.content .header {
  padding: 10px 30px;
}
.wrapper .info {
  margin: 20px 0px 0px 20px;
  border-top: 1px solid #eee;
  padding: 20px 0px 10px 0px;
}
.wrapper .info a {
  color: #88949b;
  font-size: 14px;
}
.wrapper .info a:hover {
  color: #0195ff;
}
.wrapper .bottom .btn {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #88949b;
  border-radius: 4px;
}
.wrapper .bottom {
  display: flex;
  margin-left: 20px;
  color: #999;
  font-size: 14px;
  align-items: center;
}
.wrapper .bottom li {
  margin-right: 14px;
}
#msg {
  background-color: #eee;
  width: 100%;
  margin: 0 auto;
}
#msg .title {
  margin: 20px;
}
#msg .wrapper {
  background-color: #fff;
  padding: 10px;
}
.wrapper .top {
  display: flex;
  margin: 20px;
  align-items: center;
}
.wrapper .top .right {
  margin-left: auto;
}
.wrapper .top .example {
  color: #333;
  font-size: 22px;
  font-weight: 700;
}
.wrapper .top li i {
  margin-left: 20px;
  color: #88949b;
}
.wrapper .right .count {
  margin-right: 60px;
  color: #fff;
  padding: 4px 10px;
  background-color: #88949b;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid #88949b;
}
.wrapper .right .score {
  position: absolute;
  left: 53px;
  top: -5px;
  padding: 1px 12px;
  font-size: 20px;
  color: #88949b;
  border: 1px dashed #88949b;
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  font-weight: bold;
}
.wrapper .right div {
  position: relative;
}
.wrapper * {
  list-style: none;
}
</style>
