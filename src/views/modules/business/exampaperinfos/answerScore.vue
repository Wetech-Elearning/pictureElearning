<template>
  <div class="score">
    <div class="title">
      <p class="name">{{paperName}}</p>
      <p class="description">({{$t('paper.paper_total_score')}}：{{totalScore}}{{$t('paper.paper_unit')}},{{$t('paper.paper_time_limit')}}：{{exmaTimeLimit}}{{$t('paper.paper_time_unit')}})</p>
      <p class="description">{{$t('platform.student')}}：{{userName}}</p>
    </div>
    <div class="total">
      <div class="look">
        {{$t('paper.paper_result')}}
      </div>
      <div class="show">
        <div class="number" :class="{'border': isTransition}">
          <span>{{score}}</span>
          <span>{{$t('paper.paper_unit')}}</span>
        </div>
      </div>
      <ul class="time">
        <li class="start"><span>{{$t('common.start_time')}}</span> <span>{{startTime}}</span></li>
        <li class="end"><span>{{$t('common.end_time')}}</span> <span>{{endTime}}</span></li>
        <li>
          <el-button type="primary" @click="checkAnswer">{{$t('paper.check_answer')}}</el-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import multiavatar from '@multiavatar/multiavatar'

export default {
  data() {
    return {
      userName: '',
      // 是否渲染完成
      isTransition: false,
      // 试卷名称
      paperName: '',
      // 试卷id
      paperId: '',
      //课程id
      courseId: '',
      //及格分
      passScore: '',
      // 总分
      totalScore: 0,
      // 得分
      score: 0,
      // 时间
      exmaTimeLimit: 0,
      imgShow: false, //不及格图片显示
      imgSrc: {
        fail1: require("@/assets/img/cry1.gif"),
        fail2: require('@/assets/img/cry2.jpg'),
        pass1: require('@/assets/img/good1.jpg'),
        pass2: require('@/assets/img/good2.gif')
      },
      startTime: null, //考试开始时间
      endTime: null, //考试结束时间
    }
  },
  computed: {
    userId: {
      get () { return this.$store.state.user.id }
    }
  },
  created() {
    this.transiton()
    this.getScore()
    this.getStudentInfo()
  },
  methods: {
    //一秒后过渡
    transiton() {
      setTimeout(() => {
        this.isTransition = true
        this.imgShow = true
      },1000)
    },
    //获取相关信息
    getScore() {
      this.totalScore = this.$route.query.total
      this.score = this.$route.query.score
      this.startTime = this.$route.query.startTime
      this.endTime = this.$route.query.endTime
      this.paperId = this.$route.query.paperId
      this.passScore = this.$route.query.passScore
      this.paperName = this.$route.query.paperName
      this.courseId = this.$route.query.courseId
      this.exmaTimeLimit = this.$route.query.exmaTimeLimit
      if(this.score >= this.passScore){
        this.grantCertificate()
      }
    },
    // 获取学员信息
    getStudentInfo() {
      const userId = this.$cookie.get('userId')
      this.$http({
        url: this.$http.adornUrl(`/generator/student/info/` + userId),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.userName = data.student.surname + data.student.userName
        }
      })
    },
    //授予证书
    grantCertificate(){
      this.$http({
        url: this.$http.adornUrl(`/generator/certificateuserinfo/save`),
        method: 'post',
        data: this.$http.adornData({
          'uuid': '',
          'courseId': this.courseId,
          'userId': this.userId,
          'creater': 'auto',
          'deleteFlag': '0'
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          console.log('证书授予成功')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 查看试卷答案
    checkAnswer(){
      // this.$router.push({path:"/answer",query:{uuid: this.paperId,totalScore: this.$route.query.total,isPractice: true}})
      this.$router.push({name:"answer",params:{uuid: this.paperId,totalScore: this.$route.query.total,isPractice: true}})
    }
  }
}
</script>

<style lang="scss" scoped>
.show {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 160px;
    height: 160px;
  }
  .img1Transform {
    opacity: 1 !important;
    transform: translateX(30px) !important;
    transition: all 0.6s ease !important;
  }
  .img2Transform {
    opacity: 1 !important;
    transform: translateX(-30px) !important;
    transition: all 0.6s ease !important;
  }
  .img1 {
    margin-top: 70px;
    opacity: 0;
    transform: translateX(0px);
    transition: all 0.6s ease;
  }
  .img2 {
    margin-top: 30px;
    opacity: 0;
    transform: translateX(0px);
    transition: all 0.6s ease;
  }
}
.time {
  padding: 0px 70px;
  li {
    display: flex;
    justify-content: space-around;
    padding: 10px;
    margin: 20px 0px;
  }
  li:nth-child(1) {
    background-color: #fcf8e3;
  }
  li:nth-child(2) {
    background-color: #e9f5e9;
  }
}
.border {
  border: 6px solid #36aafd !important;
  transition: all 2s ease;
  width: 160px !important;
  height: 160px !important;
  transform: rotate(360deg) !important;
  opacity: 1 !important;
}
.score {
  max-width: 800px;
  margin: 0 auto;
  .title {
    margin: 60px 0px 30px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .name {
      font-size: 26px;
      color: inherit;
      font-weight: 500;
    }
    .description {
      font-size: 14px;
      color: #888;
    }
  }
  .total {
    border: 1px solid #dbdbdb;
    background-color: #fff;
    padding: 40px;
    .look {
      border-bottom: 1px solid #dbdbdb;
      padding: 0px 0px 14px 14px;
      color: #36aafd;
    }
    .number {
      opacity: 0;
      border: 6px solid #fff;
      transform: rotate(0deg);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 0 auto;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      margin-top: 80px;
      margin-bottom: 20px;
      transition: all 1s ease;

      span:nth-child(1) {
        font-size: 36px;
        font-weight: 600;
      }
      span:nth-child(2) {
        font-size: 14px;
      }
    }
  }
}
</style>

