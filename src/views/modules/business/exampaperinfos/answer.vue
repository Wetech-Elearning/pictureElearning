<!--考生答题界面-->
<template>
  <div id="answer">
    <!--顶部信息栏-->
     <div class="top">
       <ul class="item">
         <li><i class="iconfont el-icon-back icon20" ref="toggle" @click="slider_flag = !slider_flag"></i></li>
         <li>{{examData.examPaperName}}</li>
         <li style="margin-right: 10px;">
           <el-button @click="previous()" style="margin-left: 0px;" type="success" circle>{{$t('paper.paper_pre_question')}}</el-button>
         </li>
         <li style="margin-right: 10px;">
           <el-button @click="mark()" style="margin-left: 0px;" type="primary" circle>{{$t('paper.paper_mark_questions')}}</el-button>
         </li>
         <li style="margin-right: 10px;">
           <el-button @click="next()" style="margin-left: 0px;" type="success" circle>{{$t('paper.paper_next_question')}}</el-button>
         </li>
         <li @click="flag = !flag">
           <i class="iconfont icon-user icon20"></i>
           <div class="msg"  v-if="flag" @click="flag = !flag">
             <p>{{$t('platform.username')}}：{{userName}}</p>
           </div>
         </li>
         <li><i class="iconfont icon-arrLeft icon20"></i></li>
       </ul>
     </div>
     <div class="flexarea">
        <!--左边题目编号区-->
        <transition name="slider-fade">
          <div class="left" v-if="slider_flag">
            <ul class="l-top">
              <li>
                <a href="javascript:;"></a>
                <span>{{$t('paper.paper_current_questions')}}</span>
              </li>
              <li>
                <a href="javascript:;"></a>
                <span>{{$t('paper.paper_unanswered_questions')}}</span>
              </li>
              <li>
                <a href="javascript:;"></a>
                <span>{{$t('paper.paper_answered_questions')}}</span>
              </li>
              <li>
                <a href="javascript:;"></a>
                <span>{{$t('paper.paper_mark_questions')}}</span>
              </li>
            </ul>
            <div class="l-bottom">
              <div class="item" v-if="radioQuestion.total > 0">
                <p>{{$t('paper.paper_radioquestion')}}</p>
                <ul>
                  <li v-for="(list, index0) in radioQuestion.radioQuestionList" :key="index0">
                    <a href="javascript:;"
                       @click="radioChange(index0)"
                       :class="{'border': index == index0 && currentType == 0,'bg': bg_flag && radioQuestion.radioQuestionList[index0].isClick == true}">
                      <span :class="{'mark': radioQuestion.radioQuestionList[index0].isMark == true}"></span>
                      {{index0+1}}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="item" v-if="multiQuestion.total > 0">
                <p>{{$t('paper.paper_multiquestion')}}</p>
                <ul>
                  <li v-for="(list, index1) in multiQuestion.multiQuestionList" :key="index1">
                    <a href="javascript:;"
                      @click="change(index1)"
                      :class="{'border': index == index1 && currentType == 1,'bg': bg_flag && multiQuestion.multiQuestionList[index1].isClick == true}">
                      <span :class="{'mark': multiQuestion.multiQuestionList[index1].isMark == true}"></span>
                      {{radioQuestion.total + index1+1}}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="item" v-if="fillQuestion.total > 0">
                <p>{{$t('paper.paper_fillquestion')}}</p>
                <ul>
                  <li v-for="(list, index2) in fillQuestion.fillQuestionList" :key="index2">
                    <a href="javascript:;" @click="fill(index2)" :class="{'border': index == index2 && currentType == 2,'bg': fillAnswer[index2][3] == true}">
                      <span :class="{'mark': fillQuestion.fillQuestionList[index2].isMark == true}"></span>
                      {{radioQuestion.total + multiQuestion.total+index2+1}}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="item" v-if="judgeQuestion.total > 0">
                <p>{{$t('paper.paper_judgequestion')}}</p>
                <ul>
                  <li v-for="(list, index3) in judgeQuestion.judgeQuestionList" :key="index3">
                    <a href="javascript:;" @click="judge(index3)" :class="{'border': index == index3 && currentType == 3,'bg': bg_flag && judgeQuestion.judgeQuestionList[index3].isClick == true}">
                      <span :class="{'mark': judgeQuestion.judgeQuestionList[index3].isMark == true}"></span>
                      {{fillQuestion.total + radioQuestion.total + multiQuestion.total+index3+1}}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="item" v-if="translateQuestion.total > 0">
                <p>{{$t('paper.paper_translatequestion')}}</p>
                <ul>
                  <li v-for="(list, index4) in translateQuestion.translateList" :key="index4">
                    <a href="javascript:;" @click="translateHandler(index4)" :class="{'border': index == index4 && currentType == 4,'bg': translateAnswer[index4] != undefined && translateAnswer[index4] != ''}">
                      <span :class="{'mark': translateQuestion.translateList[index4].isMark == true}"></span>
                      {{fillQuestion.total + radioQuestion.total + multiQuestion.total + judgeQuestion.total + index4 + 1}}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="item" v-if="discussionQuestion.total > 0">
                <p>{{$t('paper.paper_discussionquestion')}}</p>
                <ul>
                  <li v-for="(list, index5) in discussionQuestion.discussionQuestionList" :key="index5">
                    <a href="javascript:;" @click="discussionHandler(index5)" :class="{'border': index == index5 && currentType == 5,'bg': discussionAnswer[index5] != undefined && discussionAnswer[index5] != ''}">
                      <span :class="{'mark': discussionQuestion.discussionQuestionList[index5].isMark == true}"></span>
                      {{fillQuestion.total + radioQuestion.total + multiQuestion.total + judgeQuestion.total + translateQuestion.total + index5 + 1}}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="final" v-if="!isPractice" @click="commit()">{{$t('paper.paper_end')}}</div>
            </div>
          </div>
        </transition>
        <!--右边选择答题区-->
        <transition name="slider-fade">
          <div class="right">
            <div class="title">
              <p>{{title}}</p>
              <i class="iconfont icon-right el-icon-document auto-right" style="margin-top: 20px;"></i>
              <span v-if="!isPractice">{{$t('paper.paper_message')}} {{number}}/{{multiQuestion.total + fillQuestion.total + judgeQuestion.total + translateQuestion.total + discussionQuestion.total}} {{$t('paper.paper_questions')}}
                <i class="iconfont icon-time el-icon-time"></i>{{$t('paper.paper_down_time')}}：<b>{{time}}</b>{{$t('paper.paper_time_unit')}}
              </span>
            </div>
            <div class="content">
              <p class="topic"><span class="number">{{number}}</span>{{showQuestion}}</p>
              <div class="radio" v-if="currentType == 0 && radioQuestion.total > 0">
                <el-radio-group v-model="radio[index]" @change="getChangeLabel"  :disabled="isPractice">
                  <el-radio :label="1">A：{{showAnswer.answera}}</el-radio>
                  <el-radio :label="2">B：{{showAnswer.answerb}}</el-radio>
                  <el-radio :label="3">C：{{showAnswer.answerc}}</el-radio>
                  <el-radio :label="4">D：{{showAnswer.answerd}}</el-radio>
                </el-radio-group>
                <div class="analysis" v-if="isPractice">
                  <ul>
                    <li> <el-tag type="info">{{$t('paper.paper_your_answer')}}：</el-tag><span class="right">{{radioQuestion.radioQuestionList[index].userAnswer}}</span></li>
                    <li> <el-tag type="success">{{$t('paper.paper_answer')}}：</el-tag><span class="right">{{radioQuestion.radioQuestionList[index].answer}}</span></li>
                    <li><el-tag>{{$t('paper.paper_parse_question')}}：</el-tag></li>
                    <li>{{radioQuestion.radioQuestionList[index].analysis == null ? $t('paper.paper_no_answer') : radioQuestion.radioQuestionList[index].analysis}}</li>
                  </ul>
                </div>
              </div>
              <div class="multi" v-if="currentType == 1 && multiQuestion.total > 0">
                <el-checkbox-group v-model="multi[index]" @change="getMultiChangeLabel"  :disabled="isPractice">
                  <el-checkbox class="mycheckbox" label="A">A：{{showAnswer.answera}}</el-checkbox>
                  <el-checkbox class="mycheckbox" style="margin-left: 0;" label="B">B：{{showAnswer.answerb}}</el-checkbox>
                  <el-checkbox class="mycheckbox" style="margin-left: 0;" label="C">C：{{showAnswer.answerc}}</el-checkbox>
                  <el-checkbox class="mycheckbox" style="margin-left: 0;" label="D">D：{{showAnswer.answerd}}</el-checkbox>
                </el-checkbox-group>
                <div class="analysis" v-if="isPractice">
                  <ul>
                    <li> <el-tag type="info">{{$t('paper.paper_your_answer')}}：</el-tag><span class="right">{{multiQuestion.multiQuestionList[index].userAnswer}}</span></li>
                    <li> <el-tag type="success">{{$t('paper.paper_answer')}}：</el-tag><span class="right">{{multiQuestion.multiQuestionList[index].answer}}</span></li>
                    <li><el-tag>{{$t('paper.paper_parse_question')}}：</el-tag></li>
                    <li>{{multiQuestion.multiQuestionList[index].analysis == null ? $t('paper.paper_no_answer') : multiQuestion.multiQuestionList[index].analysis}}</li>
                  </ul>
                </div>
              </div>
              <div class="fill" v-if="currentType == 2 && fillQuestion.total > 0">
                <div v-for="(item,currentIndex) in part" :key="currentIndex">
                  <el-input :placeholder="$t('paper.paper_fill_line')"
                    v-model="fillAnswer[index][currentIndex]"
                    clearable
                    :disabled="isPractice"
                    @blur="fillBG">
                  </el-input>
                </div>
                <div class="analysis" v-if="isPractice">
                  <ul>
                    <li> <el-tag type="info">{{$t('paper.paper_your_answer')}}：</el-tag><span class="right">{{fillQuestion.fillQuestionList[index].userAnswer}}</span></li>
                    <li> <el-tag type="success">{{$t('paper.paper_answer')}}：</el-tag><span class="right">{{fillQuestion.fillQuestionList[index].answer}}</span></li>
                    <li><el-tag>{{$t('paper.paper_parse_question')}}：</el-tag></li>
                    <li>{{fillQuestion.fillQuestionList[index].analysis == null ? $t('paper.paper_no_answer'): fillQuestion.fillQuestionList[index].analysis}}</li>
                  </ul>
                </div>
              </div>
              <div class="judge" v-if="currentType == 3 && judgeQuestion.total > 0">
                <el-radio-group v-model="judgeAnswer[index]" @change="getJudgeLabel" v-if="currentType == 3" :disabled="isPractice">
                  <el-radio :label="1">{{$t('common.right')}}</el-radio>
                  <el-radio :label="2">{{$t('common.error')}}</el-radio>
                </el-radio-group>
                <div class="analysis" v-if="isPractice">
                  <ul>
                    <li> <el-tag type="info">{{$t('paper.paper_your_answer')}}：</el-tag><span class="right">{{judgeQuestion.judgeQuestionList[index].userAnswer == 'correct'?$t('common.right'):$t('common.error')}}</span></li>
                    <li> <el-tag type="success">{{$t('paper.paper_answer')}}：</el-tag><span class="right">{{judgeQuestion.judgeQuestionList[index].answer == 'correct'?$t('common.right'):$t('common.error')}}</span></li>
                    <li><el-tag >{{$t('paper.paper_parse_question')}}：</el-tag></li>
                    <li>{{judgeQuestion.judgeQuestionList[index].analysis == null ? $t('paper.paper_no_answer'): judgeQuestion.judgeQuestionList[index].analysis}}</li>
                  </ul>
                </div>
              </div>
              <div class="translate" v-if="currentType == 4 && translateQuestion.total > 0">
                <el-input :placeholder="$t('paper.paper_fill_line')"
                          v-model="translateAnswer[index]"
                          clearable
                          :disabled="isPractice"
                          v-if="currentType == 4"
                          >
                </el-input>
                <div class="analysis" v-if="isPractice">
                  <ul>
                    <li> <el-tag type="info">{{$t('paper.paper_your_answer')}}：</el-tag><span class="right">{{translateQuestion.translateList[index].userAnswer}}</span></li>
                    <li> <el-tag type="success">{{$t('paper.paper_answer')}}：</el-tag><span class="right">{{translateQuestion.translateList[index].answer}}</span></li>
                    <li><el-tag>{{$t('paper.paper_parse_question')}}：</el-tag></li>
                    <li>{{translateQuestion.translateList[index].analysis == null ? $t('paper.paper_no_answer'): translateQuestion.translateList[index].analysis}}</li>
                  </ul>
                </div>
              </div>
              <div class="discussion" v-if="currentType == 5 && discussionQuestion.total > 0">
                <el-input :placeholder="$t('paper.paper_fill_line')"
                          v-model="discussionAnswer[index]"
                          clearable
                          v-if="currentType == 5"
                          type="textarea"
                          :disabled="isPractice"
                          :autosize="{ minRows: 2, maxRows: 4}">
                </el-input>
                <div class="analysis" v-if="isPractice">
                  <ul>
                    <li> <el-tag type="info">{{$t('paper.paper_your_answer')}}：</el-tag><span class="right">{{discussionQuestion.discussionQuestionList[index].userAnswer}}</span></li>
                    <li> <el-tag type="success">{{$t('paper.paper_answer')}}：</el-tag><span class="right">{{discussionQuestion.discussionQuestionList[index].answer}}</span></li>
                    <li><el-tag>{{$t('paper.paper_parse_question')}}：</el-tag></li>
                    <li>{{discussionQuestion.discussionQuestionList[index].analysis == null ? $t('paper.paper_no_answer'): discussionQuestion.discussionQuestionList[index].analysis}}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="operation">
              <ul class="end">
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </div>
        </transition>
     </div>
  </div>
</template>

<script>
import store from '@/store'
import {mapState} from 'vuex'
export default {
  store,
  data() {
    return {
      // 试卷信息
      examData: {
        uuid: '',
        examPaperName: '',
        courseId: '',
        creater: '',
        createDate: '',
        totalScore: 0,
        tips: this.$t('paper.paper_anwer_tips'),
        examNum: 0
      },
      // 单选题
      radioQuestion: {
        total: 0,
        score: 0,
        radioQuestionList: []
      },
      // 多选题
      multiQuestion: {
        total: 0,
        score: 0,
        multiQuestionList: []
      },
      // 填空题
      fillQuestion: {
        total: 0,
        score: 0,
        fillQuestionList: []
      },
      // 判断题
      judgeQuestion: {
        total: 0,
        score: 0,
        judgeQuestionList: []
      },
      // 翻译题
      translateQuestion: {
        total: 0,
        score: 0,
        translateList: []
      },
      // 问答题
      discussionQuestion: {
        total: 0,
        score: 0,
        discussionQuestionList: []
      },
      // 考试开始时间
      startTime: null,
      // 考试结束时间
      endTime: null,
      // 考试持续时间
      time: null,
      // 定时器
      timer: null,
      reduceAnswer: [],  // vue官方不支持3层以上数据嵌套,如嵌套则会数据渲染出现问题,此变量直接接收3层嵌套时的数据。
      answerScore: 0, // 答题总分数
      bg_flag: false, // 已答标识符,已答改变背景色
      isFillClick: false, // 选择题是否点击标识符
      slider_flag: true, // 左侧显示隐藏标识符
      flag: false, // 个人信息显示隐藏标识符
      currentType: 0, // 当前题型类型  0--单选题  1--多选题  2--填空题  3--判断题 4--翻译题 5--问答题
      radio: [], // 保存考生所有选择题的选项
      multi: [[]],
      title: this.$t('paper.paper_right_tip'),
      index: 0, // 全局index
      topicCount: [], // 每种类型题目的总数
      score: [],  // 每种类型分数的总数
      showQuestion: [], // 当前显示题目信息
      showAnswer: {}, // 当前题目对应的答案选项
      number: 1, // 题号
      part: null, // 填空题的空格数量
      fillAnswer: [[]], // 二维数组保存所有填空题答案
      judgeAnswer: [], // 保存所有判断题答案
      discussionAnswer: [], // 保存所有问答题答案
      translateAnswer: [], // 保存所有翻译题答案
      topic1Answer: [],  // 学生单选题作答编号,
      multiAnswer: [[]],  // 学生多选题作答编号,
      rightAnswer: '',
      isPractice: false // 是否显示答案解析
    }
  },
  mounted () {
    window.addEventListener('beforeunload', this.beforeunloadHandler())
    if (!this.isPractice) {
      this.showTime()
    }
  },
  destroyed () {
    window.removeEventListener('beforeunload', this.beforeunloadHandler())
    window.name = ''
  },
  beforeMount () {
    this.init()
  },
  methods: {
    beforeunloadHandler () {
      if (window.name != '' && this.$route.path == '/answer') {
        this.$confirm(this.$t('message.is_commit_paper'), this.$t('message.tip'), {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancle'),
          type: 'warning'
        }).then(() => {
          this.commit()
        }).catch(() => {})
      } else {
        window.name = 'answer'
      }
      if (window.name != '' && this.$route.path != '/answer' && this.$route.path != '/answerScore' && !this.isPractice) {
        this.commit2()
        this.$message.info('正在交卷')
      } else {
        window.name = 'answer'
      }
    },
    init () {
      this.fillAnswer = [[]]
      this.judgeAnswer = []
      this.discussionAnswer = []
      this.translateAnswer = []
      this.topic1Answer = []
      this.isPractice = this.$route.params.isPractice
      this.getExamData()
    },
    // 获取时间
    getTime (date) { // 日期格式化
      let year = date.getFullYear()
      let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      // 拼接
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    },
    calcuScore () { // 计算答题分数

    },
    getExamData () { // 获取当前试卷所有信息
      this.fillAnswer = [[]]
      this.judgeAnswer = []
      this.discussionAnswer = []
      this.translateAnswer = []
      this.topic1Answer = []
      let date = new Date()
      this.startTime = this.getTime(date)
      // 获取路由传递过来的试卷编号
      let uuid = this.$route.params.uuid
      this.examData.uuid = uuid
      this.$http({
        url: this.$http.adornUrl(`/generator/paperQuestion/info`),
        method: 'get',
        params: this.$http.adornParams({
          'uuid': this.examData.uuid,
          'userId': this.$store.state.user.id,
          'isPractice': this.isPractice,
          'pageName': 'answer'
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.examData.examPaperName = data.examPaperInfos.examPaperName
          this.examData.description = data.examPaperInfos.description
          this.examData.passScore = data.examPaperInfos.passScore
          this.examData.exmaTimeLimit = data.examPaperInfos.exmaTimeLimit
          this.examData.examMaxNum = data.examPaperInfos.examMaxNum
          this.examData.creater = data.examPaperInfos.creater
          this.examData.createDate = data.examPaperInfos.createDate
          this.examData.updater = data.examPaperInfos.updater
          this.examData.updateDate = data.examPaperInfos.updateDate
          this.examData.remark = data.examPaperInfos.remark
          this.examData.courseId = data.examPaperInfos.subject
          this.examData.examNum = data.examPaperInfos.examNum
          this.index = 0
          this.time = this.examData.exmaTimeLimit
          this.initRadioQuestionInfo(data.examPaperInfos.examPaperDetail.radioQuestionEntityList)
          this.initMultiQuestionInfo(data.examPaperInfos.examPaperDetail.multiQuestionEntityList)
          this.initFillQuestionInfo(data.examPaperInfos.examPaperDetail.fillQuestionEntityList)
          this.initJudgeQuestionInfo(data.examPaperInfos.examPaperDetail.judgeQuestionEntityList)
          this.initTranslateQuestionInfo(data.examPaperInfos.examPaperDetail.translateQuestionEntityList)
          this.initDiscussionQuestionInfo(data.examPaperInfos.examPaperDetail.discussionQuestionEntityList)
        }
      })
    },
    initRadioQuestionInfo (data) {
      console.log('单选题：', data)
      if (data.length > 0) {
        this.radioQuestion.radioQuestionList = data
        this.radioQuestion.total = data.length
        data.forEach((item, index, arr) => {
          this.radioQuestion.score += item.score
        })
        this.examData.totalScore += this.radioQuestion.score
        this.examData.courseId = data[0].subject
        this.number = 1
        this.showQuestion = this.radioQuestion.radioQuestionList[0].question
        this.showAnswer = this.radioQuestion.radioQuestionList[0]
      }
    },
    initMultiQuestionInfo (data) {
      console.log('多选题：', data)
      if (data.length > 0) {
        this.multiQuestion.multiQuestionList = data
        this.multiQuestion.total = data.length
        data.forEach((item, index, arr) => {
          this.multiQuestion.score += item.score
        })
        this.examData.totalScore += this.multiQuestion.score
        this.examData.courseId = data[0].subject
        //this.number = 1
        //this.showQuestion = this.multiQuestion.multiQuestionList[0].question
        //this.showAnswer = this.multiQuestion.multiQuestionList[0]
      }
    },
    initFillQuestionInfo (data) {
      console.log('填空题：', data)
      if (data.length > 0) {
        // 根据填空题数量创建二维空数组存放每道题答案
        let father = []
        for (let i = 0; i < data.length; i++) {
          let children = [null, null , null, null]
          father.push(children)
        }
        this.fillAnswer = father
        this.fillQuestion.fillQuestionList = data
        this.fillQuestion.total = data.length
        data.forEach((item, index, arr) => {
          this.fillQuestion.score += item.score
        })
        this.examData.totalScore += this.fillQuestion.score
        if(this.multiQuestion.total == 0){
          this.fill(0)
        }
      }
    },
    initJudgeQuestionInfo(data){
      console.log('判断题：',data)
      if(data.length > 0){
        this.judgeQuestion.judgeQuestionList = data
        this.judgeQuestion.total = data.length
        data.forEach((item, index, arr) => {
          this.judgeQuestion.score += item.score
        })
        this.examData.totalScore += this.judgeQuestion.score
        if(this.multiQuestion.total == 0 && this.fillQuestion.total == 0){
          this.judge(0)
        }
      }
    },
    initTranslateQuestionInfo(data){
      console.log('翻译题：',data)
      if(data.length > 0){
        this.translateQuestion.translateList = data
        this.translateQuestion.total = data.length
        data.forEach((item, index, arr) => {
          this.translateQuestion.score += item.score
        })
        this.examData.totalScore += this.translateQuestion.score
        if(this.multiQuestion.total == 0 && this.fillQuestion.total == 0 && this.judgeQuestion.total == 0){
          this.translateHandler(0)
        }
      }
    },
    initDiscussionQuestionInfo(data){
      console.log('问答题：',data)
      if(data.length > 0){
        this.discussionQuestion.discussionQuestionList = data
        this.discussionQuestion.total = data.length
        data.forEach((item, index, arr) => {
          this.discussionQuestion.score += item.score
        })
        this.examData.totalScore += this.discussionQuestion.score
        if(this.multiQuestion.total == 0 && this.fillQuestion.total == 0 && this.judgeQuestion.total == 0 && this.translateQuestion.total == 0){
          this.discussionHandler(0)
        }
      }
    },
    radioChange (index) { // 选择题
      this.index = index
      let reduceAnswer = this.radioQuestion.radioQuestionList[this.index]
      this.reduceAnswer = reduceAnswer
      this.isFillClick = true
      this.currentType = 0
      let len = this.radioQuestion.radioQuestionList.length
      if(this.index < len) {
        if(this.index <= 0){
          this.index = 0
        }
        console.log(`总长度${len}`)
        console.log(`当前index:${index}`)
        this.title = this.$t('paper.paper_right_tip')
        let Data = this.radioQuestion.radioQuestionList[this.index]
        console.log('Data===',Data)
        console.log('index===',this.index)
        this.showQuestion = Data.question // 获取题目信息
        this.showAnswer = Data
        this.number = this.index + 1
      } else if (this.index >= len) {
        this.index = 0
        this.change(this.index)
      }
    },
    change (index) { // 选择题
      this.index = index
      let reduceAnswer = this.multiQuestion.multiQuestionList[this.index]
      this.reduceAnswer = reduceAnswer
      this.isFillClick = true
      this.currentType = 1
      let len = this.multiQuestion.multiQuestionList.length
      if(this.index < len) {
        if(this.index <= 0){
          this.index = 0
        }
        console.log(`总长度${len}`)
        console.log(`当前index:${index}`)
        this.title = this.$t('paper.paper_right_tip')
        let Data = this.multiQuestion.multiQuestionList[this.index]
        console.log('Data===',Data)
        console.log('index===',this.index)
        this.showQuestion = Data.question // 获取题目信息
        this.showAnswer = Data
        this.number = this.radioQuestion.radioQuestionList.length + this.index + 1
      } else if (this.index >= len) {
        this.index = 0
        this.fill(this.index)
      }
    },
    // 填空题已答题目 如果已答该题目,设置第四个元素为true为标识符
    fillBG () {
      if (this.fillAnswer[this.index][0] != null) {
        this.fillAnswer[this.index][3] = true
      }
    },
    // 填空题
    fill (index) {
      let len = this.fillQuestion.total
      this.currentType = 2
      this.index = index
      if (index < len) {
        if (index < 0) {
          index = this.multiQuestion.multiQuestionList.length - 1
          this.change(index)
        } else {
          console.log(`总长度${len}`)
          console.log(`当前index:${index}`)
          this.title = this.$t('paper.paper_line_tip')
          let Data = this.fillQuestion.fillQuestionList
          this.showQuestion = Data[index].question // 获取题目信息
          console.log('当前填空题========》', this.showQuestion)
          // 根据题目中括号的数量确定填空横线数量
          let part1 = this.showQuestion.split('（）').length - 1
          let part2 = this.showQuestion.split('()').length - 1
          this.part = part1 + part2
          this.number = this.radioQuestion.radioQuestionList.length + this.multiQuestion.multiQuestionList.length + index + 1
          console.log('fillAnswer===============', this.fillAnswer[this.index][this.part - 1])
        }
      } else if (index >= len) {
        this.index = 0
        this.judge(this.index)
      }
    },
    judge (index) { // 判断题
      let len = this.judgeQuestion.judgeQuestionList.length
      this.currentType = 3
      this.index = index
      if(this.index < len) {
        if(this.index < 0){
          this.index = this.fillQuestion.fillQuestionList.length - 1
          this.fill(this.index)
        }else {
          console.log(`总长度${len}`)
          console.log(`当前index:${this.index}`)
          this.title = this.$t('paper.paper_right_tip')
          let Data = this.judgeQuestion.judgeQuestionList
          console.log(Data)
          this.showQuestion = Data[index].question //获取题目信息
          this.number = this.radioQuestion.radioQuestionList.length + this.multiQuestion.total + this.fillQuestion.total + index + 1
        }
      }else if (this.index >= len) {
        this.index = 0
        this.change(this.index)
        this.translateHandler(this.index)
      }
    },
    // 翻译题
    translateHandler(index) {
      let len = this.translateQuestion.translateList.length
      this.currentType = 4
      this.index = index
      if(this.index < len) {
        if(this.index < 0){
          this.index = this.translateQuestion.translateList.length - 1
          this.judge(this.index)
        }else {
          console.log(`总长度${len}`)
          console.log(`当前index:${this.index}`)
          this.title = this.$t('paper.paper_right_tip')
          let Data = this.translateQuestion.translateList
          console.log(Data)
          this.showQuestion = Data[index].question //获取题目信息
          this.number = this.radioQuestion.radioQuestionList.length + this.multiQuestion.total + this.fillQuestion.total + this.judgeQuestion.total + index + 1
        }
      } else if (this.index >= len) {
        this.index = 0
        this.discussionHandler(this.index)
      }
    },
    // 问答题
    discussionHandler(index) {
      let len = this.discussionQuestion.discussionQuestionList.length
      this.currentType = 5
      this.index = index
      if(this.index < len) {
        if(this.index < 0){
          this.index = this.discussionQuestion.discussionQuestionList.length - 1
          this.translateHandler(this.index)
        }else {
          console.log(`总长度${len}`)
          console.log(`当前index:${this.index}`)
          this.title = this.$t('paper.paper_right_tip')
          let Data = this.discussionQuestion.discussionQuestionList
          console.log(Data)
          this.showQuestion = Data[index].question //获取题目信息
          this.number = this.radioQuestion.radioQuestionList.length + this.multiQuestion.total + this.fillQuestion.total + this.judgeQuestion.total + this.translateQuestion.total + index + 1
        }
      } else if (this.index >= len) {
        this.index = 0
        this.change(this.index)
      }
    },

    getChangeLabel (val) { // 获取选择题作答选项
      this.radio[this.index] = val // 当前选择的序号
      if (val) {
        let data = this.radioQuestion.radioQuestionList
        this.bg_flag = true
        data[this.index]['isClick'] = true
      }
      /* 保存学生答题选项 */
      this.topic1Answer[this.index] = val
    },
    getMultiChangeLabel (val) { // 获取选择题作答选项
      this.multi[[this.index]] = val // 当前选择的序号
      if (val) {
        let data = this.multiQuestion.multiQuestionList
        this.bg_flag = true
        data[this.index]['isClick'] = true
      }
      /* 保存学生答题选项 */
      this.multiAnswer[[this.index]] = val
    },
    getJudgeLabel (val) {  // 获取判断题作答选项
      this.judgeAnswer[this.index] = val
      if (val) {
        let data = this.judgeQuestion.judgeQuestionList
        this.bg_flag = true
        data[this.index]['isClick'] = true
      }
    },
    previous () { // 上一题
      this.index --
      switch (this.currentType) {
        case 1:
          this.change(this.index)
          break
        case 2:
          this.fill(this.index)
          break
        case 3:
          this.judge(this.index)
          break
        case 4:
          this.translateHandler(this.index)
          break
        case 5:
          this.discussionHandler(this.index)
          break
      }
    },
    next () { // 下一题
      this.index ++
      switch (this.currentType) {
        case 0:
          this.radioChange(this.index)
          break
        case 1:
          this.change(this.index)
          break
        case 2:
          this.fill(this.index)
          break
        case 3:
          this.judge(this.index)
          break
        case 4:
          this.translateHandler(this.index)
          break
        case 5:
          this.discussionHandler(this.index)
          break
      }
    },
    mark () { // 标记功能
      switch (this.currentType) {
        case 0:
          this.radioQuestion.radioQuestionList[this.index]['isMark'] = true // 单选题标记
          break
        case 1:
          this.multiQuestion.multiQuestionList[this.index]['isMark'] = true // 多选题标记
          break
        case 2:
          this.fillQuestion.fillQuestionList[this.index]['isMark'] = true // 填空题标记
          break
        case 3:
          this.judgeQuestion.judgeQuestionList[this.index]['isMark'] = true // 判断题标记
        case 4:
          this.translateQuestion.translateList[this.index]['isMark'] = true // 判断题标记
        case 5:
          this.discussionQuestion.discussionQuestionList[this.index]['isMark'] = true // 判断题标记
      }
    },
    // 答案提交计算分数
    commit() {
      /* 计算选择题总分 */
      let finalScore = 0
      console.log('this.multiAnswer', this.multiAnswer)
      if(this.multiAnswer != undefined && this.multiAnswer[0].length > 0){
        this.multiAnswer.forEach((element,index) => {
          let isScore = false
          let right = null
          if(element != null) {
            right = element.join().replaceAll(',','')
            console.log('this.multiQuestion.multiQuestionList', this.multiQuestion.multiQuestionList)
            console.log('index',index)
            if(right == this.multiQuestion.multiQuestionList[index].answer) { // 当前选项与正确答案对比
              finalScore += this.multiQuestion.multiQuestionList[index].score // 计算总分数
              isScore = true
            }
            this.$http({
              url: this.$http.adornUrl(`/generator/userexamrecord/save`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.$store.state.user.id,
                'paperId': this.examData.uuid,
                'questionType': '多选题',
                'questionId': this.multiQuestion.multiQuestionList[index].uuid,
                'questionAnswer': right,
                'score': isScore?this.multiQuestion.multiQuestionList[index].score:0,
                'examNum': this.examData.examNum
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                console.log(data.msg)
              }
            })
            console.log(right,this.multiQuestion.multiQuestionList[index].answer)
          }
        })
      }
      let topic1Answer = this.topic1Answer
      if(topic1Answer != undefined && topic1Answer.length > 0){
        topic1Answer.forEach((element,index) => { //循环每道选择题根据选项计算分数
          let isScore = false
          let right = null
          if(element != null) {
            switch(element) { //选项1,2,3,4 转换为 "A","B","C","D"
              case 1:
                right = "A"
                break
              case 2:
                right = "B"
                break
              case 3:
                right = "C"
                break
              case 4:
                right = "D"
            }
            if(right == this.radioQuestion.radioQuestionList[index].answer) { // 当前选项与正确答案对比
              finalScore += this.radioQuestion.radioQuestionList[index].score // 计算总分数
              isScore = true
            }
            this.$http({
              url: this.$http.adornUrl(`/generator/userexamrecord/save`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.$store.state.user.id,
                'paperId': this.examData.uuid,
                'questionType': '单选题',
                'questionId': this.radioQuestion.radioQuestionList[index].uuid,
                'questionAnswer': right,
                'score': isScore?this.radioQuestion.radioQuestionList[index].score:0,
                'examNum': this.examData.examNum
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                console.log(data.msg)
              }
            })
            console.log(right,this.radioQuestion.radioQuestionList[index].answer)
          }
        })
      }
      /**计算填空题总分 */
      let fillAnswer = this.fillAnswer
      if(fillAnswer != undefined && fillAnswer[0].length > 0){
        fillAnswer.forEach((element,index) => { //此处index和 this.index数据不一致，注意
          let isScore = false
          element.forEach((inner) => {
            if(this.fillQuestion.fillQuestionList[index].answer.includes(inner)) { //判断填空答案是否与数据库一致
              console.log("正确")
              finalScore += this.fillQuestion.fillQuestionList[this.index].score
              isScore = true
            }
          })
          this.$http({
            url: this.$http.adornUrl(`/generator/userexamrecord/save`),
            method: 'post',
            data: this.$http.adornData({
              'userId': this.$store.state.user.id,
              'paperId': this.examData.uuid,
              'questionType': '填空题',
              'questionId': this.fillQuestion.fillQuestionList[index].uuid,
              'questionAnswer': element[0],
              'score': isScore?this.fillQuestion.fillQuestionList[index].score:0,
              'examNum': this.examData.examNum
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              console.log(data.msg)
            }
          })
        });
      }
      /** 计算判断题总分 */
      let topic3Answer = this.judgeAnswer
      if(topic3Answer != undefined && topic3Answer.length > 0){
        topic3Answer.forEach((element,index) => {
          let isScore = false
          let right = null
          switch(element) {
            case 1:
              right = "correct"
              break
            case 2:
              right = "wrong"
          }
          if(right == this.judgeQuestion.judgeQuestionList[index].answer) { // 当前选项与正确答案对比
            finalScore += this.judgeQuestion.judgeQuestionList[index].score // 计算总分数
            isScore = true
          }
          this.$http({
            url: this.$http.adornUrl(`/generator/userexamrecord/save`),
            method: 'post',
            data: this.$http.adornData({
              'userId': this.$store.state.user.id,
              'paperId': this.examData.uuid,
              'questionType': '判断题',
              'questionId': this.judgeQuestion.judgeQuestionList[index].uuid,
              'questionAnswer': right,
              'score': isScore?this.judgeQuestion.judgeQuestionList[index].score:0,
              'examNum': this.examData.examNum
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              console.log(data.msg)
            }
          })
        })
        console.log('判断题答案==>',topic3Answer)
      }
      /** 计算翻译题总分 */
      let topic4Answer = this.translateAnswer
      if(topic4Answer != undefined && topic4Answer.length > 0){
        topic4Answer.forEach((element,index) => {
          let isScore = false
          let right = element
          if(right == this.translateQuestion.translateList[index].answer) {
            finalScore += this.translateQuestion.translateList[index].score
            isScore = true
          }
          this.$http({
            url: this.$http.adornUrl(`/generator/userexamrecord/save`),
            method: 'post',
            data: this.$http.adornData({
              'userId': this.$store.state.user.id,
              'paperId': this.examData.uuid,
              'questionType': '翻译题',
              'questionId': this.translateQuestion.translateList[index].uuid,
              'questionAnswer': right,
              'score': isScore?this.translateQuestion.translateList[index].score:0,
              'examNum': this.examData.examNum
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              console.log(data.msg)
            }
          })
        })
        console.log('翻译题答案==>',topic4Answer)
      }
      /** 计算问答题总分 */
      let topic5Answer = this.discussionAnswer
      if(topic5Answer != undefined && topic5Answer.length > 0){
        topic5Answer.forEach((element,index) => {
          let isScore = false
          let right = element
          if(right == this.discussionQuestion.discussionQuestionList[index].answer) {
            finalScore += this.discussionQuestion.discussionQuestionList[index].score
            isScore = true
          }
          this.$http({
            url: this.$http.adornUrl(`/generator/userexamrecord/save`),
            method: 'post',
            data: this.$http.adornData({
              'userId': this.$store.state.user.id,
              'paperId': this.examData.uuid,
              'questionType': '问答题',
              'questionId': this.discussionQuestion.discussionQuestionList[index].uuid,
              'questionAnswer': right,
              'score': 0,
              'examNum': this.examData.examNum
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              console.log(data.msg)
            }
          })
        })
        console.log('翻译题答案==>',topic5Answer)
      }
      console.log(`目前总分${finalScore}`)
      if(this.time != 0) {
        this.$confirm("考试结束时间未到,是否提前交卷","友情提示",{
          confirmButtonText: '立即交卷',
          cancelButtonText: '再检查一下',
          type: 'warning'
        }).then(() => {
          console.log("交卷")
          let date = new Date()
          this.endTime = this.getTime(date)
          let answerDate = this.endTime.substr(0,10)
          this.commitPaper(finalScore)
        }).catch(() => {
          console.log("继续答题")
        })
      } else {
        console.log('交卷')
        let date = new Date()
        this.endTime = this.getTime(date)
        this.commitPaper(finalScore)
      }
    },
    commit2 () {
      /* 计算选择题总分 */
      let topic1Answer = this.topic1Answer
      let finalScore = 0
      if(topic1Answer != undefined && topic1Answer.length > 0){
        topic1Answer.forEach((element,index) => { //循环每道选择题根据选项计算分数
          let isScore = false
          let right = null
          if(element != null) {
            switch(element) { //选项1,2,3,4 转换为 "A","B","C","D"
              case 1:
                right = 'A'
                break
              case 2:
                right = 'B'
                break
              case 3:
                right = 'C'
                break
              case 4:
                right = 'D'
            }
            if(right == this.multiQuestion.multiQuestionList[index].rightanswer) { // 当前选项与正确答案对比
              finalScore += this.multiQuestion.multiQuestionList[index].score // 计算总分数
              isScore = true
            }
            this.$http({
              url: this.$http.adornUrl(`/generator/userexamrecord/save`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.$store.state.user.id,
                'paperId': this.examData.uuid,
                'questionType': '选择题',
                'questionId': this.multiQuestion.multiQuestionList[index].uuid,
                'questionAnswer': right,
                'score': isScore?this.multiQuestion.multiQuestionList[index].score:0,
                'examNum': this.examData.examNum
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                console.log(data.msg)
              }
            })
            console.log(right,this.multiQuestion.multiQuestionList[index].rightanswer)
          }
        })
      }
      /**计算填空题总分 */
      let fillAnswer = this.fillAnswer
      if(fillAnswer != undefined && fillAnswer[0].length > 0){
        fillAnswer.forEach((element,index) => { //此处index和 this.index数据不一致，注意
          let isScore = false
          element.forEach((inner) => {
            if(this.fillQuestion.fillQuestionList[index].answer.includes(inner)) { //判断填空答案是否与数据库一致
              console.log("正确")
              finalScore += this.fillQuestion.fillQuestionList[this.index].score
              isScore = true
            }
          })
          this.$http({
            url: this.$http.adornUrl(`/generator/userexamrecord/save`),
            method: 'post',
            data: this.$http.adornData({
              'userId': this.$store.state.user.id,
              'paperId': this.examData.uuid,
              'questionType': '填空题',
              'questionId': this.fillQuestion.fillQuestionList[index].uuid,
              'questionAnswer': element[0],
              'score': isScore?this.fillQuestion.fillQuestionList[index].score:0,
              'examNum': this.examData.examNum
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              console.log(data.msg)
            }
          })
        });
      }
      /** 计算判断题总分 */
      let topic3Answer = this.judgeAnswer
      if(topic3Answer != undefined && topic3Answer.length > 0){
        topic3Answer.forEach((element,index) => {
          let isScore = false
          let right = null
          switch(element) {
            case 1:
              right = "correct"
              break
            case 2:
              right = "wrong"
          }
          if(right == this.judgeQuestion.judgeQuestionList[index].answer) { // 当前选项与正确答案对比
            finalScore += this.judgeQuestion.judgeQuestionList[index].score // 计算总分数
            isScore = true
          }
          this.$http({
            url: this.$http.adornUrl(`/generator/userexamrecord/save`),
            method: 'post',
            data: this.$http.adornData({
              'userId': this.$store.state.user.id,
              'paperId': this.examData.uuid,
              'questionType': '判断题',
              'questionId': this.judgeQuestion.judgeQuestionList[index].uuid,
              'questionAnswer': right,
              'score': isScore?this.judgeQuestion.judgeQuestionList[index].score:0,
              'examNum': this.examData.examNum
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              console.log(data.msg)
            }
          })
        })
        console.log('判断题答案==>',topic3Answer)
      }
      /** 计算翻译题总分 */
      let topic4Answer = this.translateAnswer
      if(topic4Answer != undefined && topic4Answer.length > 0){
        topic4Answer.forEach((element,index) => {
          let isScore = false
          let right = element
          if(right == this.translateQuestion.translateList[index].answer) {
            finalScore += this.translateQuestion.translateList[index].score
            isScore = true
          }
          this.$http({
            url: this.$http.adornUrl(`/generator/userexamrecord/save`),
            method: 'post',
            data: this.$http.adornData({
              'userId': this.$store.state.user.id,
              'paperId': this.examData.uuid,
              'questionType': '翻译题',
              'questionId': this.translateQuestion.translateList[index].uuid,
              'questionAnswer': right,
              'score': isScore?this.translateQuestion.translateList[index].score:0,
              'examNum': this.examData.examNum
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              console.log(data.msg)
            }
          })
        })
        console.log('翻译题答案==>',topic4Answer)
      }
      /** 计算问答题总分 */
      let topic5Answer = this.discussionAnswer
      if(topic5Answer != undefined && topic5Answer.length > 0){
        topic5Answer.forEach((element,index) => {
          let isScore = false
          let right = element
          if(right == this.discussionQuestion.discussionQuestionList[index].answer) {
            finalScore += this.discussionQuestion.discussionQuestionList[index].score
            isScore = true
          }
          this.$http({
            url: this.$http.adornUrl(`/generator/userexamrecord/save`),
            method: 'post',
            data: this.$http.adornData({
              'userId': this.$store.state.user.id,
              'paperId': this.examData.uuid,
              'questionType': '问答题',
              'questionId': this.discussionQuestion.discussionQuestionList[index].uuid,
              'questionAnswer': right,
              'score': 0,
              'examNum': this.examData.examNum
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              console.log(data.msg)
            }
          })
        })
        console.log('翻译题答案==>',topic5Answer)
      }
      console.log(`目前总分${finalScore}`)
      console.log("交卷")
      let date = new Date()
      this.endTime = this.getTime(date)
      let answerDate = this.endTime.substr(0,10)
      this.commitPaper(finalScore)
    },
    commitPaper(finalScore) {
      // 提交成绩信息
      this.$http({
        url: this.$http.adornUrl(`/generator/userexaminfo/save`),
        method: 'post',
        data: this.$http.adornData({
          'userId': this.$store.state.user.id,
          'courseId': this.examData.courseId,
          'examPaperId': this.examData.uuid,
          'score': finalScore,
          'startDate': this.startTime,
          'endDate': this.endTime,
          'isPass': finalScore >= this.examData.passScore ? 1 : 2,
          'isExam': 1
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: this.$t('message.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              if(data && data.code === 0) {
                this.$router.push({path:'/answerScore',query: {
                    paperId: this.examData.uuid,
                    passScore: this.examData.passScore,
                    courseId: this.examData.courseId,
                    paperName: this.examData.examPaperName,
                    exmaTimeLimit: this.examData.exmaTimeLimit,
                    total: this.$route.params.totalScore,
                    score: finalScore,
                    startTime: this.startTime,
                    endTime: this.endTime
                  }})
              }
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    showTime () { // 倒计时
      this.timer = setInterval(() => {
        this.time -= 1
        if (this.time == 10) {
          this.$message({
            showClose: true,
            type: 'error',
            message: '考生注意,考试时间还剩10分钟！！！'
          })
        }
       if (this.time == 0) {
         console.log('考试时间已到,强制交卷。')
         this.commit()
       }
      },1000 * 60)
      // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
      this.$once('hook:beforeDestroy', () => {
        clearInterval(this.timer);
      })
    }
  }
  // computed:mapState(["isPractice"])
}
</script>

<style lang="scss">
.iconfont.icon-time {
  color: #2776df;
  margin: 0px 6px 0px 20px;
}
.iconfont.el-icon-back {
  color: white;
}
.analysis {
  margin-top: 20px;
  .right {
    color: #2776df;
    font-size: 18px;
    border: 1px solid #2776df;
    padding: 0px 6px;
    border-radius: 4px;
    margin-left: 20px;
  }
  ul li:nth-child(2) {
    margin: 20px 0px;
  }
  ul li:nth-child(3) {
    padding: 0px;
    border-radius: 4px;
  }
  ul li:nth-child(4) {
    padding: 10px;
    border-radius: 4px;
  }
}
.analysis span:nth-child(1) {
  font-size: 18px;
}
.mark {
  position: absolute;
  width: 4px;
  height: 4px;
  content: "";
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 22px;
}
.border {
  position: relative;
  border: 1px solid #FF90AA !important;
}
.bg {
  background-color: #5188b8 !important;
}
.fill .el-input {
  display: inline-flex;
  width: 150px;
  margin-left: 20px;
  .el-input__inner {
    border: 1px solid transparent;
    border-bottom: 1px solid black;
    padding-left: 20px;
  }
}
/* slider过渡效果 */
.slider-fade-enter-active {
  transition: all .3s ease;
}
.slider-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slider-fade-enter, .slider-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}

.operation .end li:nth-child(2) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 50px;
  color: #fff;
}
.operation .end li {
  cursor: pointer;
  margin: 0 100px;
}
.operation {
  background-color: #fff;
  border-radius: 4px;
  padding: 10px 0px;
  margin-right: 10px;
  margin-top: -150px;
}
.operation .end {
  display: flex;
  justify-content: center;
  align-items: center;
}
.content .number {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: rgb(39, 118, 223);
  border-radius: 4px;
  margin-right: 4px;
}
.content {
  padding: 0px 20px;
}
.content .topic {
  padding: 20px 0px;
  padding-top: 30px;
}
.right .content {
  background-color: #fff;
  margin: 10px;
  margin-left: 0px;
  height: 430px;
}
.content .el-radio-group label {
  color: #000;
  margin: 5px 0px;
}
.content .el-radio-group {
  display: flex;
  flex-direction:column;
}
.right .title p {
  margin-left: 20px;
}
.flexarea {
  display: flex;
}
.flexarea .right {
  flex: 1;
}
.auto-right {
  margin-left: auto;
  color: #2776df;
  margin-right: 10px;
}
.right .title {
  margin-right: 10px;
  padding-right: 30px;
  display: flex;
  margin-top: 10px;
  background-color: #fff;
  height: 50px;
  line-height: 50px;
}
.clearfix {
  clear: both;
}
.l-bottom .final {
  cursor: pointer;
  display: inline-block;
  text-align: center;
 background-color: rgb(39, 118, 223);
  width: 240px;
  margin: 20px 0px 20px 10px;
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  margin-top: 22px;
}
#answer .left .item {
  padding: 0px;
  font-size: 16px;
}
ul {
  list-style-type:none;
}
.l-bottom {
  border-radius: 4px;
  background-color: #fff;
}
.l-bottom .item p {
  margin-bottom: 15px;
  margin-top: 10px;
  color: #000;
  margin-left: 10px;
  letter-spacing: 2px;
}
.l-bottom .item li {
  width: 15%;
  margin-left: 5px;
  margin-bottom: 10px;
}
.l-bottom .item {
  display: flex;
  flex-direction: column;
}
.l-bottom .item ul {
  width: 100%;
  margin-bottom: -8px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.l-bottom .item ul li a {
  position: relative;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #eee;
  text-align: center;
  color: #000;
  font-size: 16px;
}
.left .l-top {
  display: flex;
  justify-content: space-around;
  padding: 16px 0px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff;
}
.left {
  width: 260px;
  height: 100%;
  margin: 10px 10px 0px 10px;
}
.left .l-top li:nth-child(2) a {
  border: 1px solid #eee;
}
.left .l-top li:nth-child(3) a {
  background-color: #5188b8;
  border: none;
}
.left .l-top li:nth-child(4) a {
  position: relative;
  border: 1px solid #eee;
}
.left .l-top li:nth-child(4) a::before {
  width: 4px;
  height: 4px;
  content: " ";
  position: absolute;
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 16px;
}
.left .l-top li {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.left .l-top li a {
  display: inline-block;
  padding: 10px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #FF90AA;
}
#answer .top {
  background-color: rgb(39, 118, 223);
}
#answer .item {
  color: #fff;
  display: flex;
  padding: 20px;
  font-size: 20px;
}
#answer .top .item li:nth-child(1) {
  margin-right: 10px;
}
#answer .top .item li:nth-child(3) {
  position: relative;
  margin-left: auto;
}
#answer {
  padding-bottom: 30px;
}
.icon20 {
  font-size: 20px;
  font-weight: bold;
}
i {
  color: #0195ff;
}
.item .msg {
  padding: 10px 15px;
  border-radius: 4px;
  top: 47px;
  right: -30px;
  color: #6c757d;
  position: absolute;
  border: 1px solid rgba(0,0,0,.15);
  background-color: #fff;
}
.item .msg p {
  font-size: 16px;
  width: 200px;
  text-align: left;
}
.mycheckbox{
  display: block;
  line-height: 36px;
  white-space: normal;
  margin-left: 0;
}
</style>
